import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { FaUndo, FaInfoCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";


const Home: NextPage = () => {
  const [answer, setAnswer] = useState('');
  const [options, setOptions] = useState<string[]>();
  const [health, setHealth] = useState(10)
  const [points, setPoints] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const guide = useRef(null);
  useOutsideCloser(guide);

  function useOutsideCloser(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
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
      setPoints(points + 100);
    } else {
      setIsGameOver(health - 1 === 0);
      setHealth(health - 1);
    }
  }

  const handleRestart = () => {
    setIsGameOver(false);
    setHealth(10);
    setPoints(0);
  }

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  }

  return (
    <>
      <Head>
        <title>Guess the hex</title>
        <meta name="description" content="Guess the hex value of a given color." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Guess the hex
        </h1>
        <button onClick={() => toggleGuide()} className="flex justify-center items-center rounded-xl pr-4 bg-gray-100 mb-6 duration-500 hover:scale-105">
          <FaInfoCircle className="mr-2 text-2xl" />
          <span className="text-sm ">Help</span>
        </button>

        <div style={{ background: answer }} className="h-72 w-72 shadow-xl"></div>

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

        <div className="mt-3 flex justify-center gap-3 pt-3 text-center lg:w-2/3">
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
                  className="flex flex-col justify-center rounded border border-gray-200 px-8 py-3 shadow-md cursor-pointer duration-500 motion-safe:hover:scale-105" >
                  <h2 className="text-lg text-gray-700 uppercase">{color}</h2>
                </button >
              ))
          }
        </div>

        {showGuide &&
          <div ref={guide} className="text-center text-sm fixed bg-neutral-50 mt-10 p-10 border rounded border-gray-200 shadow-sm transition-all ease-in-out duration-500">
            <button onClick={() => toggleGuide()} className="absolute top-5 right-5 text-xl" ><FiX /></button>

            <h1 className="text-xl font-bold mb-4">What is hex?</h1>
            <p>A hex triplet is a six-digit number to represent colors. </p>
            <p>Every pair represents one of the RGB colors in the range of 00 to FF (in hex) or 0 to 255 in decimals.</p>
            <div className="m-2"></div>
            <p>The values can be in ascending order: <br />0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F</p>
            <p>The higher the value, the more of that color is on the RGB scale.</p>
            <div className="m-4"></div>
            <h2 className="text-xl mb-4 font-bold">Examples</h2>
            <div className="flex justify-center items-center">
              <div className="mr-2 w-3 h-3 bg-[#ff0000]"></div>
              <p>#FF0000 represents pure Red</p>
            </div>
            <div className="flex justify-center items-center">
              <div className="mr-2 w-3 h-3 bg-[#00ff00]"></div>
              <p>#00FF00 represents pure Green</p>
            </div>
            <div className="flex justify-center items-center">
              <div className="mr-2 w-3 h-3 bg-[#0000FF]"></div>
              <p>#0000FF represents pure Blue</p>
            </div>

          </div>
        }
      </main>
    </>
  );
};

export default Home;

type HealthProps = {
  isGameOver: boolean;
  health: number;
  maxHealth: number;
}

const Health = ({
  isGameOver,
  health,
  maxHealth
}: HealthProps) => {
  return (
    < div className="flex items-center mt-4" >
      {
        !isGameOver
          ?
          <>
            <span className="mr-2">Health:</span>
            <Hearts count={health} type={HeartType.Full} />
            <Hearts count={maxHealth - health} type={HeartType.Empty} />
          </>
          : <h1 className="text-red-600 text-lg font-bold">Game Over</h1>
      }
    </div >
  );
};

enum HeartType {
  Full,
  Empty
}

type HeartsProps = {
  count: number;
  type: HeartType;
}

const Hearts = ({
  count,
  type
}: HeartsProps) => {
  return (
    <>
      {
        [...Array(count)].map(heart => (
          type === HeartType.Full
            ? <FcLike key={heart} />
            : <FcLikePlaceholder key={heart} />
        ))
      }
    </>
  );
};
