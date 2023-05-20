import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [aiChatInput, setAiChatInput] = useState("");
  const [result, setResult] = useState();
  const [info, setInfo] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    if (aiChatInput.trim().length == 0) {
      return;
    }

    setResult("Generating...");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aiChat: aiChatInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const result_lines = data.result.text.split("\n").map((line, line_number) => {
        console.log(line);
        return (
          <div key={line_number}>
            {line}
            <br></br>
          </div>
        );
      });
      const info = (
        <div>
          model: {data.result.info.model}
          <br></br>
        </div>
      );

      setResult(result_lines);
      setInfo(info);
      setAiChatInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Simple AI Chat</title>
      </Head>

      <main className={styles.main}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="aiChat"
            placeholder="Say something..."
            value={aiChatInput}
            onChange={(e) => setAiChatInput(e.target.value)}
          />
          <input hidden type="submit" value="Submit" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.info}>{info}</div>
      </main>
    </div>
  );
}
