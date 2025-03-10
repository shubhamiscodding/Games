import React, { useState, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import "./rps.css";
import rocks from "../../rocks.png";
import paper from "../../paper.png";
import scissors from "../../scissors.png";

// Constants
const CHOICES = {
  ROCK: { image: rocks, value: "r", label: "Rock" },
  PAPER: { image: paper, value: "p", label: "Paper" },
  SCISSORS: { image: scissors, value: "s", label: "Scissors" }
};

const OUTCOMES = {
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

const DIFFICULTY_LEVELS = {
  EASY: {
    label: "Easy",
    description: "CPU makes random choices",
    color: "#2ecc71"
  },
  MEDIUM: {
    label: "Medium",
    description: "CPU learns from your last move",
    color: "#f1c40f"
  },
  HARD: {
    label: "Hard",
    description: "CPU predicts your pattern",
    color: "#e74c3c"
  }
};

// Score Item Component
const ScoreItem = ({ label, score, subLabel, subValue }) => (
  <div className="score-item">
    <p>
      <span>{label}</span>
      <span>{score}</span>
    </p>
    <p>
      <span>{subLabel}</span>
      <span>{subValue}</span>
    </p>
  </div>
);

ScoreItem.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  subLabel: PropTypes.string.isRequired,
  subValue: PropTypes.string.isRequired
};

// Choice Button Component
const ChoiceButton = ({ choice, onClick, label }) => (
  <span className="option_img" onClick={() => onClick(choice)}>
    <img src={choice} alt={label.toLowerCase()} />
    <p>{label}</p>
  </span>
);

ChoiceButton.propTypes = {
  choice: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

// Difficulty Selector Component
const DifficultySelector = ({ currentDifficulty, onSelect }) => (
  <div className="difficulty-selector">
    <h3>Select Difficulty</h3>
    <div className="difficulty-options">
      {Object.entries(DIFFICULTY_LEVELS).map(([key, { label, description, color }]) => (
        <button
          key={key}
          className={`difficulty-button ${currentDifficulty === key ? 'active' : ''}`}
          onClick={() => onSelect(key)}
          style={{ '--button-color': color }}
        >
          <span className="difficulty-label">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

DifficultySelector.propTypes = {
  currentDifficulty: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

const Game = () => {
  // State
  const [userChoice, setUserChoice] = useState(CHOICES.ROCK.image);
  const [cpuChoice, setCpuChoice] = useState(CHOICES.ROCK.image);
  const [result, setResult] = useState("let's play");
  const [userScore, setUserScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [difficulty, setDifficulty] = useState('EASY');
  const [userHistory, setUserHistory] = useState([]);

  // Memoized calculations
  const winRates = useMemo(() => ({
    user: totalGames > 0 ? ((userScore / totalGames) * 100).toFixed(1) : 0,
    cpu: totalGames > 0 ? ((cpuScore / totalGames) * 100).toFixed(1) : 0,
    draws: totalGames - (userScore + cpuScore)
  }), [userScore, cpuScore, totalGames]);

  // CPU choice strategy based on difficulty
  const getCPUChoice = useCallback((userValue) => {
    const choices = Object.values(CHOICES);
    
    switch(difficulty) {
      case 'EASY':
        // Random choice
        return choices[Math.floor(Math.random() * choices.length)];
      
      case 'MEDIUM':
        // Counter last move
        if (userHistory.length > 0) {
          const lastUserChoice = userHistory[userHistory.length - 1];
          if (lastUserChoice === 'r') return CHOICES.PAPER;
          if (lastUserChoice === 'p') return CHOICES.SCISSORS;
          if (lastUserChoice === 's') return CHOICES.ROCK;
        }
        return choices[Math.floor(Math.random() * choices.length)];
      
      case 'HARD':
        // Pattern recognition
        if (userHistory.length >= 3) {
          const pattern = userHistory.slice(-3);
          // If player repeats a move twice, predict they'll do it again
          if (pattern[1] === pattern[2]) {
            if (pattern[2] === 'r') return CHOICES.PAPER;
            if (pattern[2] === 'p') return CHOICES.SCISSORS;
            if (pattern[2] === 's') return CHOICES.ROCK;
          }
          // If player alternates between two moves, predict the next in sequence
          if (pattern[0] === pattern[2]) {
            if (pattern[2] === 'r') return CHOICES.PAPER;
            if (pattern[2] === 'p') return CHOICES.SCISSORS;
            if (pattern[2] === 's') return CHOICES.ROCK;
          }
        }
        return choices[Math.floor(Math.random() * choices.length)];
      
      default:
        return choices[Math.floor(Math.random() * choices.length)];
    }
  }, [difficulty, userHistory]);

  // Reset handler
  const resetScores = useCallback(() => {
    setUserScore(0);
    setCpuScore(0);
    setTotalGames(0);
    setResult("let's play");
    setUserChoice(CHOICES.ROCK.image);
    setCpuChoice(CHOICES.ROCK.image);
    setUserHistory([]);
  }, []);

  // Choice handler
  const handleChoice = useCallback((choice) => {
    // Get user choice value
    const userValue = Object.values(CHOICES).find(c => c.image === choice)?.value;
    
    // Update user history
    setUserHistory(prev => [...prev, userValue]);
    
    // Get CPU choice based on difficulty
    const cpuChoice = getCPUChoice(userValue);
    
    setUserChoice(choice);
    setCpuChoice(cpuChoice.image);

    const outcomeValue = OUTCOMES[cpuChoice.value + userValue];
    setResult(outcomeValue);

    // Update scores
    setTotalGames(prev => prev + 1);
    if (outcomeValue === "USER Win") {
      setUserScore(prev => prev + 1);
    } else if (outcomeValue === "CPU Win") {
      setCpuScore(prev => prev + 1);
    }
  }, [getCPUChoice]);

  // Result message
  const resultMessage = useMemo(() => {
    switch(result) {
      case "USER Win": return "You Win!";
      case "CPU Win": return "CPU Wins!";
      default: return "It's a Draw!";
    }
  }, [result]);

  return (
    <section className="gamecontain">
      <div className="game-section">
        <DifficultySelector
          currentDifficulty={difficulty}
          onSelect={setDifficulty}
        />
        <div className="play">
          <div className="resultimg">
            <span className="cpu">
              <img src={cpuChoice} alt="cpu choice" />
              <p>CPU</p>
            </span>
            <span className="user">
              <img src={userChoice} alt="user choice" />
              <p>USER</p>
            </span>
          </div>
          <div>
            <p className="result">{result}</p>
          </div>
          <div className="options">
            {Object.entries(CHOICES).map(([key, { image, label }]) => (
              <ChoiceButton
                key={key}
                choice={image}
                onClick={handleChoice}
                label={label}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="scoreboard">
        <h2>Scoreboard</h2>
        <div className="scores">
          <ScoreItem
            label="User Score"
            score={userScore}
            subLabel="Win Rate"
            subValue={`${winRates.user}%`}
          />
          <ScoreItem
            label="CPU Score"
            score={cpuScore}
            subLabel="Win Rate"
            subValue={`${winRates.cpu}%`}
          />
          <ScoreItem
            label="Total Games"
            score={totalGames}
            subLabel="Draws"
            subValue={winRates.draws.toString()}
          />
        </div>
        <button className="reset-button" onClick={resetScores}>
          Reset Scores
        </button>
      </div>
    </section>
  );
};

export default Game;
