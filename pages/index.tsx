import { toPng } from "html-to-image";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs/github";
// import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { languages } from "../utils/langList";

SyntaxHighlighter.registerLanguage("javascript", javascript);

const languageOptions = Object.keys(languages).map((key) => (
  <option key={key} value={languages[key]}>{key}</option>
));

const Home = () => {
  const [codeInput, setCodeInput] = useState("");
  const [result, setResult] = useState();
  const [selectedOption, setSelectedOption] = useState(languageOptions[0]);




  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

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
        memeTitle: lines[0].split(":")[1].trim().replace(/"/g, ""),
        caption: lines[1].split(":")[1].trim().replace(/"/g, ""),
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
    <div
      className="leading-normal  min-h-screen	 h-full tracking-normal p-6 flex flex-col gap-2  text-black bg-green-300 
    "
    >
      <Head>
        <title>Meme Coder</title>
        <link rel="icon" href="/meme.png" />
      </Head>

      <div className="container flex flex-col items-center mx-auto">
        <img src="/meme.png" className="h-36 w-36" />
        <h3 className=" text-6xl font-bold">Meme my code</h3>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-5 ">
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


      <div>
        <label htmlFor="language-select">Select a language: </label>
        <select id="language-select" className='select w-full max-w-xs select-secondary bg-white ' value={selectedOption.toString()} onChange={handleOptionChange}>
          {languageOptions}
        </select>
      </div>

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
        className="bg-gray-800 border border-gray-800 py-4 rounded-lg "
        ref={ref}
      >
        <div className="flex flex-col ">
          <div className="flex items-cente px-2">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div
            className="flex-1 bg-white mt-2 overflow-hidden whitespace-normal break-normal"
            id="code-text"
          >
            {result ? (
              <div className="flex flex-col">
                {result?.memeTitle ? (
                  <h2 className="font-bold text-xl text-center	mx-5">{result.memeTitle}</h2>
                ) : null}
                <SyntaxHighlighter
                  language={selectedOption}
                  lineProps={{
                    style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
                  }}
                  wrapLines={true}
                  style={github}
                  showLineNumbers={true}
                >
                  {codeInput}
                </SyntaxHighlighter>
                {result?.caption ? (
                  <h2 className="font-bold text-l text-center	mx-5">{result.caption}</h2>
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
