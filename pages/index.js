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
        body: JSON.stringify({ code: codeInput }),
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
    <div className="leading-normal h-full tracking-normal p-6 flex flex-col gap-2  text-black bg-green-300">
      <Head>
        <title>Meme Coder</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <div className="container mx-auto flex flex-col items-center">
        <img src="/meme.png" className="h-36 w-36" />
        <h3 className=" text-6xl font-bold">Meme my code</h3>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <textarea
          name="code_input"
          onChange={(e) => setCodeInput(e.target.value)}
          value={codeInput}
          id="message"
          rows="5"
          className="textarea textarea-info bg-neutral-100"
          placeholder="Enter your code"
        ></textarea>
      </form>

      <div className="flex gap-2">
        <button type="submit" onClick={onSubmit} className="btn btn-primary">
          Meme Code
        </button>
        <button className="btn btn-secondary" onClick={onButtonClick}>
          Download image
        </button>
      </div>

      <pre
        id="code-box"
        className="bg-gray-800 border border-gray-800 py-4 rounded-lg"
        ref={ref}
      >
        <div className="flex flex-col ">
          <div className="flex items-cente px-2">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div
            className="flex-1 bg-white mt-2 overflow-hidden whitespace-normal"
            id="code-text"
          >
            {result ? (
              <div className="flex flex-col">
                {result.memeTitle ? (
                  <h2 className="font-bold text-2xl">{result.memeTitle}</h2>
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
                  <h2 className="font-bold text-l">{result.caption}</h2>
                ) : null}
              </div>
            ) : (
              <div className="h-24"></div>
            )}
          </div>
        </div>
      </pre>
    </div>
  );
};

export default Home;
