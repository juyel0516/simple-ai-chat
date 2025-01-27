import React from 'react';
import { getCommands } from '/command';
import { getFunctions } from '../function';

const Documentation = () => {
  const features = [
    { name: "GPT-4 Turbo", description: "Chat with the state-of-the-art GPT-4 Turbo model provided by OpenAI." },
    { name: "GPT-4 Vision (Image Input)", description: "Interact with powerful vision model, GPT-4 Vision. To use Vision model, simply paste the image to the input box." },
    { name: "File Input", description: "Upload files (supporting plain text, DOCX, PDF, JSON), and they will be processed as text. The results will be inserted into the prompt and will provide a GPT reference." },
    { name: "Roles", description: "Allow GPT to act in a role to provide more satisfactory answers, or provide your own instruction prompts to fit your needs." },
    { name: "Data Stores", description: "Support for vector database and relational database search and query. For vector database user can upload files to your personal database. When a store is used, the results will be inserted as prompts to provide knowledgeable answers." },
    { name: "Node (Node AI)", description: "Connect to another AI or any data source to use its data. When a node is used, the results will be utilized as prompts provided for the AI." },
    { name: "Midjourney (in progress)", description: "Midjourney is the first node AI. It utilizes the most advanced image generation AI in combination with ChatGPT prompts to generate high-quality certified images." },
  ];

  const sub_features = [
    { name: "Full-screen mode and split-screen mode", description: "For easy use requiring extensive input and output, such as programmers, essay writer. To use split-screen mode, use command \`:fullscreen split\`." },
    { name: "De-hallucination", description: "Detect hallucinations in chat to provide more trustworthiness. When the AI exhibits hallucination, it can sometimes generate completely fabricated answers. By enabling the dehallucination feature, a message in stats (`self_eval_score`) will be displayed along with statistics to allow users to judge the accuracy of the information. Essentially, this feature resends the user's input and the AI's output, along with reference information, back to AI for self-evaluation. Use command \`:stats on\`, and `:eval on` to turn on it." },
    { name: "TTS voice", description: "Reading with an option to select from the system's local TTS voice library, use command \`:speak on\` to enable." },
    { name: "Themes", description: "Supports 3 themes: Light mode, Dark mode, and Matrix-style Terminal mode." },
    { name: "Function calls", description: "GPT will choise function to use to get information he need. Such as weather and time queries, etc. Functions can be called by user directlly from the input as well. Refer: #functions" },
    { name: "Location-based query", description: "Questioning based on user's geographic location information. e.g., answering \"How's the weather today?\" by automatically obtaining the location. To use location feature, use command \`:location on\`." },
    { name: "Page redirection", description: "Jump to a specified page, GPT will do it automatically, for example: Open the official website of OpenAI. You can use it to open multiple URLs, simultaneously." },
    { name: "Shortcuts", description: "Supports convenient shortcut operations. Refer: `Shortcuts`" },
  ];

  const commands = getCommands();

  const functions = getFunctions();

  const shortcuts = [
    { action: "Clear the input.", shortcut: "ESC", condition: "Focused on the input area, input area has content." },
    { action: "Unfocus from the input box.", shortcut: "ESC", condition: "Focused on the input area, input area is cleared." },
    { action: "Repeat last input.", shortcut: "Tab", condition: "Focused on the input area, input area is cleared." },
    { action: "Navigate to the previous session history(log).", shortcut: "← or K", condition: "Unfocused from the input area， or input box is empty when using `←`." },
    { action: "Navigate to the next session history(log).", shortcut: "→ or J", condition: "Unfocused from the input area, or input box is empty when using `→`" },
    { action: "Change focus to input area.", shortcut: "Tab or /", condition: "Unfocused from the input area." },
  ];

  const content = (
    <>
      <div>
        <div className="mt-2"><a href="#introduction"><u>Introduction</u></a></div>
        <div className="mt-2"><a href="#quick-start"><u>Quick Start</u></a></div>
        <div className="mt-2"><a href="#features"><u>Features</u></a></div>
        <div>
          <div className="mt-2"><a href="#commands"><u>Commands</u></a></div>
          <div className="ml-3">
            <div><a href="#commands-general">- <u>General</u></a></div>
            <div><a href="#commands-session">- <u>Session</u></a></div>
            <div><a href="#commands-eval">- <u>Stats & Self-evaluation</u></a></div>
            <div><a href="#commands-speak">- <u>Speak</u></a></div>
            <div><a href="#commands-role">- <u>Roles</u></a></div>
            <div><a href="#commands-store">- <u>Data Store</u></a></div>
            <div><a href="#commands-node">- <u>Node (Node AI)</u></a></div>
            <div><a href="#commands-user">- <u>User</u></a></div>
            <div><a href="#commands-config">- <u>Information</u></a></div>
          </div>
        </div>
        <div className="mt-2"><a href="#functions"><u>Functions</u></a></div>
        <div className="mt-2"><a href="#shortcuts"><u>Shortcuts</u></a></div>
        <div className="mt-2"><a href="#feedback"><u>Feedback & Support</u></a></div>
      </div>
      <div id="introduction" className="mt-5">Introduction</div>
      <div className="mt-2">
        Simple AI (`simple-ai.io`) is an AI chat application. It focuses on improving the user experience of interacting with AI models. It provides a command-based and easy-to-use shell interface to interact with the AI models.
      </div>
      <div id="quick-start" className="mt-5">Quick Start</div>
      <div className="mt-2">
        <div>(Here insert the introduction video.)</div>
      </div>
      <div id="features" className="mt-5">Features</div>
      <div>
        {features.map((item, index) => (
          <div key={index} className="mt-2">
            <div>- {item.name}</div>
            <div>{item.description}</div>
          </div>
        ))}
      </div>
      <div className="mt-2">Sub features:</div>
      <div>
        {sub_features.map((item, index) => (
          <div key={index} className="mt-2">
            <div>- {item.name}</div>
            <div>{item.description}</div>
          </div>
        ))}
      </div>
      <div id="commands" className="mt-5">Commands</div>
      <div className="mt-2">
        Simple AI is command-based; most operations can be executed with commands. To distinguish from general input, commands must start with a ":". For example, to change the theme, use the `:theme` command; to enter full-screen mode, use the `:fullscreen` command. Use `:help` to list all available commands.
      </div>
      <div>
        {commands.map((item, index) => (<div key={index}>
            {item.id && <div id={item.id} className="mt-3">- {item.title}</div>}
            <div className="mt-2">
              <div>{item.command}</div>
              <div>Short description: {item.short_description || "-"}</div>
              <div>Description: {item.description || "-"}</div>
            </div>
          </div>
        ))}
      </div>
      <div id="functions" className="mt-5">Functions</div>
      <div className="mt-2">
        We provide some built-in functions to get information from the Internet. Both user and AI can use these functions. To get a list of available functions, use the `:function ls` command.
      </div>
      <div className="mt-3 table-container">
        <table>
          <thead>
            <tr>
              <th>Function</th>
              <th>Execute</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {functions.map((f, index) => (
              <tr key={index}>
                <td>{f.name}</td>
                <td>{(() => {
                  const args =(() => Object.keys(f.parameters.properties).map((p) => {
                    const type = f.parameters.properties[p].type;
                    if (type === "string") {
                      return `\"${p}\": \"___\"`;
                    } else if (type === "boolean") {
                      return `\"${p}\": [true|false]`;
                    } else {
                      return `\"${p}\": [${type}]`;
                    }
                  }).join(", "))();
                  return `!${f.name}({ ${args} })`
                })()}</td>
                <td>{f.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2">
          * Weather data is provided by WolframAlpha.
        </div>
      </div>
      <div id="shortcuts" className="mt-5">Shortcuts</div>
      <div className="mt-3 table-container">
        <table>
          <thead>
            <tr>
              <th>Shortcut</th>
              <th>Action</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {shortcuts.map((item, index) => (
              <tr key={index}>
                <td>{item.shortcut}</td>
                <td>{item.action}</td>
                <td>{item.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2">
          * Command shortcuts: Stop generating (⌃c), Clear output (⌃r), Clear output and reset session (⇧⌃r)
        </div>
      </div>
      <div id="feedback" className="mt-5">Feedback & Support</div>
      <div className="mt-2">
        Simple AI is open-source; you can visit our GitHub issues (<a href="https://github.com/gcc3/simple-ai-chat/issues"><u>link</u></a>) to report any issues you encounter, share your ideas or contribute to the project.
      </div>
      <div className="mt-2">
        You can also contact us via email `<a href="mailto:support@simple-ai.io"><u>support@simple-ai.io</u></a>`.
      </div>
    </>
  )

  return (
    <div className="Documentation">
      <div className="text-center mb-4">
        <div>Documentation</div>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default Documentation;