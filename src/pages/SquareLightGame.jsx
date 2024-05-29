import React, { useRef, useState } from "react";

const SquareLightGame = () => {
  const [grid, setGrid] = useState(Array(6).fill(Array(6).fill(false)));
  const [isPlay, setIsPlay] = useState(false);
  const [isLightSquare, setIsLightSquare] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [responsesTimes, setResponsesTimes] = useState([]);
  const [seconds, setSeconds] = useState(null);
  const intervalRef = useRef(null);
  const clickRef = useRef(null);
  const [isPauseClick, setIsPauseClick] = useState(false);

  const startGame = () => {
    console.log("click");
    setIsPauseClick(false);
    if (seconds) {
      console.log(Date.now() / 1000);
      setIsPlay(true);
      generateRandomSquare();
      intervalRef.current = setInterval(() => {
        generateRandomSquare();
      }, seconds * 1000);
    }
    return () => clearInterval(intervalRef.current);
  };

  const pauseGame = () => {
    clearInterval(intervalRef.current);
    setIsPauseClick(true);
  };

  const resetGame = () => {
    setIsPauseClick(false);
    setResponsesTimes([]);
    setGrid(Array(6).fill(Array(6).fill(false)));
    clearInterval(intervalRef.current);
    setIsPlay(false);
    setStartTime(null);
  };

  const generateRandomSquare = () => {
    const row = Math.floor(Math.random() * 6);
    const col = Math.floor(Math.random() * 6);
    const newGrid = Array(6)
      .fill(Array(6).fill(false))
      .map((r, i) => r.map((c, j) => i === row && j === col));
    // console.log(newGrid)
    setGrid(newGrid);
    setIsLightSquare([row, col]);
    setStartTime(Date.now());
  };

  const handleSquareClick = (row, col) => {
    if (
      isPlay &&
      isLightSquare &&
      isLightSquare[0] === row &&
      isLightSquare[1] === col
    ) {
      clickRef.current = clickRef.current + 1;
      console.log(clickRef.current);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      setResponsesTimes((prevValue) => [
        ...prevValue,
        { mouseClick: clickRef.current, reactionTime: responseTime },
      ]);
      setStartTime(null);
      setIsLightSquare(null);
      setTimeout(() => {
        generateRandomSquare();
      }, seconds * 1000);
    }
  };
  return (
    <>
      {/* header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <input
          type="number"
          maxLength={5}
          minLength={0}
          placeholder="Enter seconds between 1 and 5"
          onChange={(e) => setSeconds(e.target.value)}
        />

        <button onClick={startGame}>Start</button>
        <button onClick={pauseGame}>Pause</button>
        <button onClick={resetGame}>Reset</button>
      </header>
      {/* content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,50px)",
          gridTemplateRow: "repeat(6,50px)",
          margin: "20px",
        }}
      >
        {grid?.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row?.map((col, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: "50px",
                  height: "50px",
                  border: "1px solid green",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: col ? (isPauseClick ? "" : "red") : "",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleSquareClick(rowIndex, colIndex);
                }}
              >
                {col ? "true" : "false"}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Table */}
      <table>
        <thead>
          <tr>
            <td>Mouse Click number</td>
            <td>Reaction time</td>
          </tr>
        </thead>
        <tbody>
          {responsesTimes.map((data, index) => (
            <tr key={index}>
              <td>{data?.mouseClick}</td>
              <td>{data?.reactionTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SquareLightGame;
