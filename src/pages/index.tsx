import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { FaUndo, FaInfoCircle, FaCopy } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Health from "../components/health"
import { GuideSection, ColorExample } from "../components/guide"

enum correctIncorrect {
  correct = '#7fae7d',
  incorrect = '#db7171',
}

const Home: NextPage = () => {
  const [answer, setAnswer] = useState('');
  const [options, setOptions] = useState<string[]>();
  const [health, setHealth] = useState(10)
  const [points, setPoints] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<{ color: string, isCorrect: boolean }[]>([]);
  const [showCopy, setShowCopy] = useState(false);
  const [correctGuess, setCorrectGuess] = useState<boolean | undefined>();
  const guide = useRef(null);
  useOutsideCloser(guide);

  function useOutsideCloser(ref: any) {
    useEffect(() => {
      /**
       * Close if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowGuide(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const generateColor = (colorArray: string[]) => {
    let color = '';

    // Handeling duplicates
    while (color === '' || colorArray.includes(color)) {
      // Create new Hex value
      color = '#' + [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    // If this is the first color, set it as the answer
    if (colorArray.length === 0) {
      setAnswer(color);
    }

    return color;
  }

  const createGame = () => {
    let colorArray: string[] = [];
    const optionCount = 3;

    // Create equal amount of hexes to the optionCount
    [...Array(optionCount)].map(() =>
      colorArray = [...colorArray, generateColor(colorArray)]
    );

    // Update the options array and randomize the order
    setOptions(colorArray.sort(() => 0.5 - Math.random()));
  }

  useEffect(() => {
    createGame();
  }, [health, points]);

  const handleClick = (guess: string) => {
    if (guess === answer) {
      setCorrectGuess(true);
      setPoints(points + 100);
    } else {
      setCorrectGuess(false);
      setIsGameOver(health - 1 === 0);
      setHealth(health - 1);
    }

    setAnswerHistory([...answerHistory, { color: answer, isCorrect: guess === answer }]);
  }

  useEffect(() => {
    const timer = setTimeout(() => setCorrectGuess(undefined), 500);

    return () => {
      clearTimeout(timer);
    };
  }, [correctGuess])

  const handleRestart = () => {
    setIsGameOver(false);
    setHealth(10);
    setPoints(0);
    setAnswerHistory([]);
  }

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  }

  const handleCopy = (color: string) => {
    setShowCopy(true);
    navigator.clipboard.writeText(color);
    setTimeout(() => setShowCopy(false), 2000);
  }

  return (
    <>
      <Head>
        <title>Guess the hex</title>
        <meta name="description" content="Guess the hex value of a given color." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center p-4">
        <h1 className="mt-10 text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Guess the hex
        </h1>
        <button onClick={() => toggleGuide()} className="flex justify-center items-center rounded-xl pr-4 bg-gray-100 mb-6 duration-500 hover:scale-105">
          <FaInfoCircle className="mr-2 text-2xl" />
          <span className="text-sm ">Help</span>
        </button>

        <div className="relative flex flex-row place-content-center items-center">
          <p className="absolute sm:relative px-4 py-2 font-extrabold bg-white rounded text-2xl transition-all ease-in-out duration-300" style={{ color: correctIncorrect.incorrect, opacity: correctGuess === false ? 1 : 0 }}>Incorrect</p>
          <div style={{ background: answer }} className="rounded h-72 w-72 shadow-xl transition-all ease-in-out duration-200"></div>
          <p className="absolute sm:relative px-4 py-2 font-extrabold bg-white rounded text-2xl transition-all ease-in-out duration-300" style={{ color: correctIncorrect.correct, opacity: correctGuess === true ? 1 : 0 }}>Correct</p>
        </div>

        <Health
          isGameOver={isGameOver}
          health={health}
          maxHealth={10}
        />

        <div className="items-center mb-4">
          <p className="text-md transition ease-in-out duration-5000">Points:
            <span className="font-bold"> {points}</span>
          </p>
        </div>

        <div className="my-3 flex flex-wrap justify-center gap-3 pt-3 text-center lg:w-2/3">
          {
            isGameOver
              ?
              <button onClick={() => handleRestart()}
                className="flex justify-center items-center rounded border border-gray-200 px-8 py-3 shadow-md cursor-pointer duration-500 motion-safe:hover:scale-105" >
                <FaUndo className="mt-1" />
                <h2 className="text-lg ml-2 text-gray-700">Restart</h2>
              </button >
              :
              options?.map(color => (
                <button onClick={() => handleClick(color)} key={color}
                  className="flex flex-col w-2/3 sm:w-auto text-center justify-center items-center rounded border border-gray-200 px-8 py-3 shadow-sm cursor-pointer duration-500 motion-safe:hover:scale-105" >
                  <h2 className="text-lg text-gray-700 uppercase">{color}</h2>
                </button >
              ))
          }
        </div>

        {answerHistory.length > 0 &&
          <div className="flex flex-col sm:flex-row w-full sm:w-auto text-gray-700 gap-6 mt-10 mx-2">
            <h1 className="font-extrabold text-4xl text-center">History</h1>
            <div className="max-h-48 w-96 overflow-auto">
              {
                [...answerHistory].reverse().map((answer, i) => (
                  <div key={i} className="flex gap-2 items-center relative">

                    <span className="font-bold w-6 text-center">{answerHistory.length - i}.</span>
                    <div className="flex items-center gap-2 flex-even rounded border-gray-200 py-2">
                      <div style={{ background: answer.color }} className="grow w-10 h-10" ></div>
                      <span className="uppercase">{answer.color}</span>
                      <button onClick={() => handleCopy(answer.color)} className="pl-2 text-gray-300 hover:text-gray-700">
                        <FaCopy />
                      </button>
                      <p className="text-lg font-extrabold absolute right-5" style={{ color: answer.isCorrect ? correctIncorrect.correct : correctIncorrect.incorrect }}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        }

        <div style={{ opacity: showCopy ? 1 : 0 }} className="shadow-xl py-2 px-8 border border-gray-200 text-center rounded fixed bottom-5 bg-white transition-all duration-300 ease-in-out">
          Copied to clipboard
        </div>

        {showGuide &&
          <div ref={guide} className="text-center text-sm fixed bg-neutral-50 p-10 border rounded border-gray-200 shadow-sm transition-all ease-in-out duration-500">
            <button onClick={() => toggleGuide()} className="absolute top-5 right-5 text-xl" ><FiX /></button>

            <GuideSection title="What is hex?" >
              <p>
                A hex triplet is a six-digit number to represent colors. <br />
                Every pair represents one of the RGB colors in the range of 00 to FF (in hex) or 0 to 255 in decimals.
              </p>
              <div className="m-2"></div>
              <p>
                The values can be in ascending order: <br />
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F<br />
                The higher the value, the more of that color is on the RGB scale.
              </p>
            </GuideSection>

            <GuideSection title="Examples" >
              <ColorExample
                colorHex="#FF0000"
                colorName="pure Red"
              />
              <ColorExample
                colorHex="#00FF00"
                colorName="pure Green"
              />
              <ColorExample
                colorHex="#0000FF"
                colorName="pure Blue"
              />
            </GuideSection>

          </div>
        }
      </main>
    </>
  );
};

export default Home;

