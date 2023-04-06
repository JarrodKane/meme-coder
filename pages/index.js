import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [codeInput, setCodeInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: codeInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setCodeInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="leading-normal h-screen tracking-normal p-6  text-black bg-green-300">
      <Head>
        <title>Meme Coder</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <div className="container mx-auto flex flex-col items-center">
        <img src="/dog.png" classNameName="h-36 w-36" />
        <h3 className=" text-6xl font-bold">Meme my code</h3>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <textarea
          name="code_input"
          onChange={(e) => setCodeInput(e.target.value)}
          value={codeInput}
          id="message"
          rows="10"
          className="textarea textarea-info bg-neutral-100"
          placeholder="Enter your code"
        ></textarea>
        <button type="submit" className="btn">
          Meme me
        </button>
      </form>
      <div className="">{result}</div>
    </div>
  );
}
