import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// configurations
const role_content_system = process.env.ROLE_CONTENT_SYSTEM ? process.env.ROLE_CONTENT_SYSTEM : "";
const temperature = process.env.TEMPERATURE ? Number(process.env.TEMPERATURE) : 0.7;  // default is 0.7
const top_p = process.env.TOP_P ? Number(process.env.TOP_P) : 1;                      // default is 1
const fine_tune_stop = process.env.FINE_TUNE_STOP ? process.env.FINE_TUNE_STOP : "";
const fine_tune_prompt_end = process.env.FINE_TUNE_PROMPT_END ? process.env.FINE_TUNE_PROMPT_END : "";
const prompt_prefix = process.env.PROMPT_PREFIX ? process.env.PROMPT_PREFIX : "";
const prompt_suffix = process.env.PROMPT_SUFFIX ? process.env.PROMPT_SUFFIX : "";

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }

  // Input
  let userInput = req.body.user_input || "";
  if (userInput.trim().length === 0) return;
  userInput = prompt_prefix + userInput + prompt_suffix;
  console.log("Input:\n" + userInput + "\n");

  // Configuration info
  console.log("--- configuration info ---\n" 
  + "model = " + process.env.MODEL + "\n"
  + "temperature = " + process.env.TEMPERATURE + "\n"
  + "top_p = " + process.env.TOP_P + "\n"
  + "endpoint = " + process.env.END_POINT + "\n"
  + "fine_tune_prompt_end = " + process.env.FINE_TUNE_PROMPT_END + "\n"
  + "fine_tune_stop = " + process.env.FINE_TUNE_STOP + "\n"
  + "role_content_system = " + process.env.ROLE_CONTENT_SYSTEM + "\n")
  + "prompt_prefix = " + process.env.PROMPT_PREFIX + "\n"
  + "prompt_suffix = " + process.env.PROMPT_SUFFIX + "\n";

  try {
    let result_text = "null";

    if (process.env.END_POINT === "chat_completion") {
      // endpoint: /v1/chat/completions
      const chatCompletion = await openai.createChatCompletion({
        model: process.env.MODEL,
        messages: [
          { role: "system", content: role_content_system },
          { role: "user", content: userInput }
        ],
        temperature: temperature,
        top_p: top_p,
      });
      result_text = chatCompletion.data.choices[0].message.content;
    }

    if (process.env.END_POINT === "text_completion") {
      // endpoint: /v1/completions
      const completion = await openai.createCompletion({
        model: process.env.MODEL,
        prompt: generatePrompt(userInput),
        temperature: temperature,
        top_p: top_p,
        stop: fine_tune_stop,
      });
      result_text = completion.data.choices[0].text;
    }

    // Output the result
    console.log("Output:\n" + result_text + "\n");
    res.status(200).json({
      result: {
        text : result_text, 
        info: {
          model: process.env.MODEL,
          temperature: process.env.TEMPERATURE,
          top_p: process.env.TOP_P,
        }
      },
    });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(userInput) {
  // TODO add prompt here
  console.log("Input: " + userInput);

  // Add fine tune prompt end
  userInput += fine_tune_prompt_end;
  return userInput;
}
