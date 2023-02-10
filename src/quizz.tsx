import React,{Component} from 'react';
import axios from 'axios';


interface Question{
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizState{
  questions:Question[];
  correctAnswer: string;
  currentPoints: number;
  allPossibleAnswers: string[];
  loading: boolean;
  currentQuestion:number;
  userAnswer:string | null ;
  finish:boolean;
}

class Quiz extends Component<{},QuizState>{
  constructor(props:{}){
    super(props);
    this.state={
      questions:[],
      correctAnswer: '',
      currentPoints: 0,
      allPossibleAnswers: [],
      loading: false,
      currentQuestion:0,
      userAnswer:null,
      finish:false,
    }
  };

  componentDidMount() {
    this.getData();
  }

  combineAllAnswers= async (incorrect_answers:string[], correct_answer:string):Promise<string[]> =>{
    if (this.state.currentQuestion === undefined) {
      return [];
    }
  
    const allPossibleAnswers = [...incorrect_answers, correct_answer];
    this.setState({ allPossibleAnswers });
    return allPossibleAnswers;
  }

  async getData() {
    this.setState({ loading: true });
    const res = await axios.get("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple");
    this.setState({
      questions: res.data.results,
      
    });
    const incorrect_answers = res.data.results[this.state.currentQuestion].incorrect_answers;
    const correct_answer = res.data.results[this.state.currentQuestion].correct_answer;
    this.combineAllAnswers(incorrect_answers, correct_answer);
    this.setState({ loading: false,correctAnswer:correct_answer });
  }

  removeCharacters(question:string){
    return question.replace(/(&quot\;)/g,"")
          .replace(/(&rsquo\;)/g, '"')
          .replace(/(&#039\;)/g, '\'')
          .replace(/(&amp\;)/g, '"');
  }

  verifyAnswer(selectedAnswer:string){
    this.setState({userAnswer:selectedAnswer});
    if(selectedAnswer === this.state.correctAnswer){
      this.getData();
      this.setState({currentPoints:
      this.state.currentPoints+1});
      console.log("correct answer"+selectedAnswer)
      
    }
    else{
      this.setState({currentPoints:this.state.currentPoints+0});
      console.log("incorrect"+selectedAnswer+" correct is"+this.state.correctAnswer);
    }
    if(this.state.currentQuestion+1===this.state.questions.length){
      this.setState({finish:true});
    }
    
    
  }

  getNextQuestion=()=>{
    
    this.setState(prevState =>({
      currentQuestion : prevState.currentQuestion+1,
      correctAnswer : this.state.questions[prevState.currentQuestion+1].correct_answer
    }));
    const incorrect_answers = this.state.questions[this.state.currentQuestion+1].incorrect_answers;
    const correct_answer = this.state.questions[this.state.currentQuestion+1].correct_answer;
    this.combineAllAnswers(incorrect_answers, correct_answer);
  };

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          {this.state.loading ? (
            'Question loading'
          ) : (this.state.finish?
              (<div>
                <h5>Quiz finished. Your score is {this.state.currentPoints}/{this.state.questions.length}</h5>
              </div>):(
            <>
              
              {this.state.questions.map((question, index) =>
                index === this.state.currentQuestion ? (
                  <div key={index}>
                    <div>
                      {this.removeCharacters(question.question)}
                    </div>
                    <br />
                    <div>
                      {this.state.allPossibleAnswers.map((ans, index) => (
                        <div key={index}>
                          <input
                            type="radio"
                            key={index}
                            name="answer"
                            value={ans}
                            onChange={() => this.verifyAnswer(ans)}
                            checked={this.state.userAnswer === ans}
                          />
                          {this.removeCharacters(ans)}
                        </div>
                      ))}
                    </div>
                    <div>
                      {this.state.currentQuestion < this.state.questions.length && (
                        <button onClick={this.getNextQuestion}>Next</button>
                      )}
                    </div>
                  </div>
                ) : null
              )}
              {this.state.currentQuestion === this.state.questions.length && (
                <div>
                  Final Score: {this.state.currentPoints}
                </div>
              )}
            </>
          ))}
              </header>

              

      </div>
    )
  }


}

export default Quiz;