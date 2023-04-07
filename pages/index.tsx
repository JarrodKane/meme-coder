import { toPng } from "html-to-image";
import Head from "next/head";
import { Resizable } from 're-resizable';
import { useCallback, useRef, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs/github";
import { languages } from "../utils/langList";

SyntaxHighlighter.registerLanguage("javascript", javascript);

const languageOptions = Object.keys(languages).map((key) => (
  <option key={key} value={languages[key]}>{key}</option>
));

const Home = () => {
  const [codeInput, setCodeInput] = useState(" ");
  const [result, setResult] = useState({ memeTitle: '', caption: '' });
  const [selectedOption, setSelectedOption] = useState(languageOptions[0]);
  const [resizeSize, setResizeSize] = useState({ width: 500, height: 500 });

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
        link.download = "code-meme.png";
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
        <link rel="icon" href="/memeWhite.png" />
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
          rows={5}
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

      <div className="alert alert-info shadow-lg max-w-3xl">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>You can adjust the width of the code output by going and dragging the side</span>
        </div>
      </div>

      <Resizable className='hover:outline outline-red-600'
        size={{ width: resizeSize.width, height: resizeSize.height }}
        onResizeStop={(e, direction, ref, d) => {
          setResizeSize({ width: resizeSize.width + d.width, height: resizeSize.height + d.height });
        }}
      >
        <pre
          id="code-box"
          className={`bg-gray-800 border border-gray-800 py-4 rounded-lg `}
          ref={ref}

        >
          <div className="flex flex-col ">
            <div className="flex  px-2">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div
              className="flex-1 bg-white mt-2 overflow-hidden whitespace-normal break-normal"
              id="code-text"
            >
              {result ? (
                <div className="flex flex-col mx-2">
                  {result?.memeTitle ? (
                    <h2 className="font-bold text-xl mx-5">{result.memeTitle}</h2>
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
                    <h2 className="font-bold text-l	mx-5">{result.caption}</h2>
                  ) : null}
                </div>
              ) : (
                <div className="h-24"></div>
              )}
            </div>
          </div>
        </pre>
      </Resizable>
    </div >
  );
};

export default Home;
