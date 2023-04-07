import { toPng } from "html-to-image";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs/github";

SyntaxHighlighter.registerLanguage("javascript", javascript);

const Home = () => {
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

      const lines = data.result.split("\n").filter((line) => line.trim());

      const objectResponse = {
        memeTitle: lines[0].split(":")[1].trim(),
        caption: lines[1].split(":")[1].trim(),
      };

      let newContent = `\\ ${objectResponse.memeTitle}
      ${codeInput}
      \\ ${objectResponse.caption}
      `;

      setResult(objectResponse);

      // setCodeInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  const ref = useRef(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      console.log("clicked");
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <div className="leading-normal h-screen tracking-normal p-6  text-black bg-green-300">
      <Head>
        <title>Meme Coder</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <div className="container mx-auto flex flex-col items-center">
        <img src="/meme.png" classNameName="h-36 w-36" />
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

      <button className="btn" onClick={onButtonClick}>
        Download image
      </button>
      {result ? (
        <pre id="my-code-block" ref={ref} className="bg-white">
          {result.memeTitle ? (
            <h2 className="bold text-3xl">{result.memeTitle}</h2>
          ) : null}
          <SyntaxHighlighter
            language="javascript"
            style={github}
            showLineNumbers={true}
            wrapLines={true}
          >
            {codeInput}
          </SyntaxHighlighter>
          {result.caption ? (
            <h2 className="bold text-xl">{result.caption}</h2>
          ) : null}
        </pre>
      ) : null}
    </div>
  );
};

export default Home;
