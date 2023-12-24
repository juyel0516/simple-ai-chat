import OpenAI from "openai";
import chalk from 'chalk';
import { generateMessages } from "utils/promptUtils";
import { logadd } from "utils/logUtils";
import { tryParseJSON } from "utils/jsonUtils"
import { evaluate } from './evaluate';
import { getFunctions, executeFunctions, getTools } from "function.js";
import { countToken, getMaxTokens } from "utils/tokenUtils";
import { verifySessionId } from "utils/sessionUtils";
import { authenticate } from "utils/authUtils";
import { getUacResult } from "utils/uacUtils";
import { getUser, getNode } from "utils/sqliteUtils";
import { getSystemConfigurations } from "utils/sysUtils";
import queryNodeAi from "utils/nodeUtils";

// OpenAI
const openai = new OpenAI();

// configurations
const { model : model_, model_v, role_content_system, welcome_message, querying, waiting, init_placeholder, enter, temperature, top_p, max_tokens, use_function_calling, use_node_ai, use_vector, use_payment, use_access_control, use_email } = getSystemConfigurations();

export default async function (req, res) {
  const session = req.query.session || "";
  const mem_length = req.query.mem_length || 0;
  const role = req.query.role || "";
  const store = req.query.store || "";
  const node = req.query.node || "";
  const use_stats = req.query.use_stats === "true" ? true : false;
  const use_eval_ = req.query.use_eval === "true" ? true : false;
  const use_location = req.query.use_location === "true" ? true : false;
  const location = req.query.location || "";
  const images_ = req.query.images || "";
  const files_ = req.query.files || "";
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const browser = req.headers['user-agent'];

  // Authentication
  const authResult = authenticate(req);
  let user = null;
  let authUser = null;
  if (authResult.success) {
    authUser = authResult.user;
    user = await getUser(authResult.user.username);
  }

  // Input & output
  let input = "";
  let output = "";

  res.writeHead(200, {
    'connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'X-Accel-Buffering': 'no',  // disables proxy buffering for NGINX
                                // IMPORTANT! without this the stream not working on remote server
  });
  
  // Query ID, same as session ID
  const verifyResult = verifySessionId(session);
  if (!verifyResult.success) {
    res.write(`data: ${verifyResult.message}\n\n`); res.flush();
    res.write(`data: [DONE]\n\n`); res.flush();
    res.end();
    return;
  }

  // Input
  input = req.query.user_input.replaceAll("%", "％").trim();  // escape %
  input = decodeURIComponent(input) || "";
  if (input.trim().length === 0) return;

  // Images & files
  const decodedImages = decodeURIComponent(images_) || "";
  const decodedFiles = decodeURIComponent(files_) || "";
  let images = [];
  let files = [];
  if (decodedImages) {
    if (decodedImages.includes("###")) {
      images = decodedImages.split("###");
    } else {
      images.push(decodedImages);
    }
  }
  if (decodedFiles) {
    if (decodedFiles.includes("###")) {
      files = decodedFiles.split("###");
    } else {
      files.push(decodedFiles);
    }
  }

  // Model switch
  const use_vision = images.length > 0;
  const model = use_vision ? model_v : model_;
  const use_eval = use_eval_ && use_stats && !use_vision;

  // User access control
  if (use_access_control) {
    const uacResult = await getUacResult(user, ip);
    if (!uacResult.success) {
      res.write(`data: ${uacResult.error}\n\n`); res.flush();
      res.write(`data: [DONE]\n\n`); res.flush();
      res.end();
      return;
    }
  }

  // Type I. Normal input
  if (!input.startsWith("!")) {
    console.log(chalk.yellowBright("Input (session = " + session + "):"));
    console.log(input + "\n");

    // Images & files
    if (images.length > 0) {
      console.log("--- images ---");
      console.log(images.join("\n") + "\n");
    }
    if (files.length > 0) {
      console.log("--- files ---");
      console.log(files.join("\n") + "\n");
    }

    // Configuration info
    console.log("--- configuration info ---\n" 
    + "model: " + model + "\n"
    + "temperature: " + temperature + "\n"
    + "top_p: " + top_p + "\n"
    + "role_content_system (chat): " + role_content_system + "\n"
    + "max_tokens: " + max_tokens + "\n"
    + "use_vision: " + use_vision + "\n"
    + "use_eval: " + use_eval + "\n"
    + "use_function_calling: " + use_function_calling + "\n"
    + "use_node_ai: " + use_node_ai + "\n"
    + "use_vector: " + use_vector + "\n"
    + "use_lcation: " + use_location + "\n"
    + "location: " + (use_location ? (location === "" ? "(not set)" : location) : "(disabled)") + "\n"
    + "role: " + (role || "(not set)") + "\n"
    + "store: " + (store || "(not set)") + "\n");
  }

  // Type II. Tool calls (function calling) input
  // Tool call input starts with "!" with fucntions, following with a user input starts with "Q="
  // Example: !func1(param1),!func2(param2),!func3(param3) Q=Hello
  let do_tool_calls = false;
  let functionNames = "";
  let functionResults = [];
  let originalInput = "";
  if (input.startsWith("!")) {
    do_tool_calls = true;
    console.log(chalk.cyanBright("Tool calls (session = " + session + "):"));
 
    // Curerently OpenAI only support function calling in tool calls.
    // Function name and arguments
    const functions = input.split("Q=")[0].substring(1).split(",!");
    console.log("Functions: " + JSON.stringify(functions));

    // Execute function
    functionResults = await executeFunctions(functions);
    console.log("Result:" + JSON.stringify(functionResults) + "\n");
    if (functionResults.length > 0) {
      for (let i = 0; i < functionResults.length; i++) {
        if (functionResults[i].success) {
          // Add function name
          functionNames += functionResults[i].function.split("(")[0] + ",";

          // Trigger event
          // Function trigger event
          if (functionResults[i].event) {
            const event = JSON.stringify(functionResults[i].event);
            res.write(`data: ###EVENT###${event}\n\n`);  // send event to frontend
          }

          // Add log
          const input_token_ct_f = countToken(model, "F=" + functionResults[i].function);
          const output_token_ct_f = countToken(model, "F=" + functionResults[i].message);
          logadd(user, session, model, input_token_ct_f, "F=" + functionResults[i].function, output_token_ct_f, "F=" + functionResults[i].message, ip, browser);
        }
      }
    }

    // Replace input with original
    originalInput = input.split("Q=")[1];
    input = originalInput;
  }

  try {
    let token_ct = [];  // detailed token count
    let input_token_ct = 0;
    let output_token_ct = 0;
    let messages = [];
    let raw_prompt = "";

    // Message base
    const generateMessagesResult = await generateMessages(user, model, input, files, images, 
                                                          session, mem_length,
                                                          role, store, node, 
                                                          use_location, location,
                                                          do_tool_calls, functionResults);
    token_ct.push(generateMessagesResult.token_ct);
    input_token_ct += generateMessagesResult.token_ct.total;
    messages = generateMessagesResult.messages;
    raw_prompt = generateMessagesResult.raw_prompt;

    console.log("--- messages ---");
    console.log(JSON.stringify(messages) + "\n");

    // endpoint: /v1/chat/completions
    const chatCompletion = await openai.chat.completions.create({
      model,
      // response_format: { type: "json_object" },
      messages,
      temperature,
      top_p,
      max_tokens,
      stream: true,
      // vision does not support function calling
      ...(use_function_calling && !use_vision && {
        tools: getTools(),
        tool_choice: "auto"
      })
    });

    res.write(`data: ###ENV###${model}\n\n`);
    res.write(`data: ###STATS###${temperature},${top_p},${input_token_ct + output_token_ct},${use_eval},${functionNames},${role},${store},${node}\n\n`);
    res.flush();

    let output_tool_calls = "";
    for await (const part of chatCompletion) {
      // handle tool calls
      const tool_calls = part.choices[0].delta.tool_calls;
      if (tool_calls) {
        res.write(`data: ###CALL###${JSON.stringify(tool_calls)}\n\n`); res.flush();
        output_tool_calls += tool_calls.arguments;  // TODO fix this
      }

      // handle message
      const content = part.choices[0].delta.content;
      if (content) {
        output += content;
        let message = content.replaceAll("\n", "###RETURN###");
        res.write(`data: ${message}\n\n`); res.flush();
      }
    }

    // Evaluate result
    // vision models not support evaluation
    if (use_eval) {
      if (output.trim().length > 0) {
        const evalResult = await evaluate(user, input, raw_prompt, output);
        if (evalResult.success) {
          res.write(`data: ###EVAL###${evalResult.output}\n\n`); res.flush();
          console.log("eval: " + evalResult.output + "\n");
          output_token_ct += evalResult.token_ct;
        } else {
          res.write(`data: ###EVAL###${evalResult.error}\n\n`); res.flush();
        }
      }
    }

    // Token
    console.log("--- token_ct ---");
    console.log(JSON.stringify(token_ct) + "\n");

    // Output
    console.log(chalk.blueBright("Output (session = "+ session + "):"));
    console.log((output || "(null)") + "\n");

    // Tool calls output
    if (output_tool_calls) {
      console.log("--- tool calls ---");
      console.log(JSON.stringify(output_tool_calls) + "\n");
    }

    // Log
    output_token_ct += countToken(model, output);
    res.write(`data: ###STATS###${temperature},${top_p},${input_token_ct + output_token_ct},${use_eval},${functionNames},${role},${store},${node}\n\n`);
    if (do_tool_calls) { input_token_ct = 0; input = ""; }  // Function calling intput is already logged
    logadd(user, session, model, input_token_ct, input, output_token_ct, output, ip, browser);

    // Done message
    res.write(`data: [DONE]\n\n`); res.flush();
    res.end();
    return;
  } catch (error) {
    console.log("Error (Generate SSE API):");
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.write(`data: An error occurred during your request. (${error.response.status})\n\n`)
    } else {
      console.error(`${error.message}`);
      res.write(`data: An error occurred during your request.\n\n`)
    }
    res.flush();
    res.end();
  }
}
