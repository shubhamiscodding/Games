import React, { useState } from "react";
import "./rps.css";
import rocks from "../../../RPS/rocks.png";
import paper from "../../../RPS/paper.png";
import scissors from "../../../RPS/scissors.png";

const Game = () => {
  const [userChoice, setUserChoice] = useState(rocks);
  const [cpuChoice, setCpuChoice] = useState(rocks);
  const [result, setResult] = useState("let's play");
  const [count, setCount] = useState(0);

  const handleChoice = (choice) => {
    const choices = [rocks, paper, scissors];
    setUserChoice(choice);

    // Randomly select CPU choice
    const randomNum = Math.floor(Math.random() * 3);
    setCpuChoice(choices[randomNum]);

    // Map choices to values for comparison
    const cpuValue = ["r", "p", "s"][randomNum];
    const userValue = ["r", "p", "s"][["rocks.png", "paper.png", "scissors.png"].indexOf(choice)];

    const outcome = {
      rr: "DRAW",
      rp: "USER Win",
      rs: "CPU Win",
      pr: "CPU Win",
      pp: "DRAW",
      ps: "USER Win",
      sr: "USER Win",
      sp: "CPU Win",
      ss: "DRAW",
    };

    const outcomeValue = outcome[cpuValue + userValue];
    setResult(outcomeValue);

    // Update count if user wins
    if (outcomeValue === "USER Win") {
      setCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <section className="gamecontain">
      <div className="play">
        <div className="resultimg">
          <span className="cpu">
            <img src={cpuChoice} alt="cpu" />
            <p>CPU</p>
          </span>
          <span className="user">
            <img src={userChoice} alt="user" />
            <p>USER</p>
          </span>
        </div>
        <div>
          <p className="result">{result}</p>
        </div>
        <div className="options">
          <span
            className="option_img"
            onClick={() => handleChoice(rocks)}
          >
            <img src={rocks} alt="rock" />
            <p>Rock</p>
          </span>
          <span
            className="option_img"
            onClick={() => handleChoice(paper)}
          >
            <img src={paper} alt="paper" />
            <p>Paper</p>
          </span>
          <span
            className="option_img"
            onClick={() => handleChoice(scissors)}
          >
            <img src={scissors} alt="scissors" />
            <p>Scissors</p>
          </span>
        </div>
      </div>
      <div className="count">
        <div className="name">User/Computer</div>
        <br />
        <div className="countwin">User Wins: {count}</div>
      </div>
      {/* Show winner between user and CPU */}
      <div className="winner">
        <h2>
          {result === "USER Win" ? "You Win!" : result === "CPU Win" ? "CPU Wins!" : "It's a Draw!"}
        </h2>
      </div>
    </section>
  );
};

export default Game;
