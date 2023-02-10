import React, { Component } from 'react';
import questions from './questions.json';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizState {
  questions: Question[];
  currentQuestion: number;
  userAnswer: string | null;
  score: number;
}

class Quiz extends Component<{}, QuizState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      questions: [],
      currentQuestion: 0,
      userAnswer: null,
      score: 0
    };
  }

  componentDidMount() {
    // Fetch the questions data from a JSON file
    fetch('questions.json')
      .then(res => res.json())
      .then(questions => {
        this.setState({ questions });
      });
  }

  handleAnswer = (answer: string) => {
    const { questions, currentQuestion, score } = this.state;
    this.setState({ userAnswer: answer });
    if (questions[currentQuestion].answer === answer) {
      this.setState({ score: score + 1 });
    }
  };

  nextQuestion = () => {
    this.setState(prevState => ({
      currentQuestion: prevState.currentQuestion + 1,
      userAnswer: null
    }));
  };

  render() {
    const { questions, currentQuestion, userAnswer, score } = this.state;
    if (questions.length === 0) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h2>{questions[currentQuestion].question}</h2>
        {questions[currentQuestion].options.map(option => (
          <button
            key={option}
            onClick={() => this.handleAnswer(option)}
            disabled={userAnswer !== null}
          >
            {option}
          </button>
        ))}
        {userAnswer !== null && (
          <div>
            {userAnswer === questions[currentQuestion].answer ? (
              <div>Correct!</div>
            ) : (
              <div>Incorrect</div>
            )}
            <button onClick={this.nextQuestion}>Next Question</button>
          </div>
        )}
        <div>
          Score: {score} / {questions.length}
        </div>
      </div>
    );
  }
}

export default Quiz;