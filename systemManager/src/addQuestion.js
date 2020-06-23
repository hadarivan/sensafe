
import React, { Component } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'
import Quiz from '../src/quiz';

class editQuestion extends Component {

  constructor(props) {
    super(props)
    this.state={
      question:'',
      answers:[
        {
          answer:'',
          isRight:false,
        },
        {
          answer:'',
          isRight:false,
        },
        {
          answer:'',
          isRight:false,
        },
        {
          answer:'',
          isRight:false,
        },
      ],
      level:'',
      image:'',
      correct: '',
      add: false,
      mistake: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
    this.handleCorrect = this.handleCorrect.bind(this)
}


handleRadio(number) {
  console.log(number);
  if(number === '1' && document.getElementById('tb1').value.length > 0)
  {
    this.setState({correct: document.getElementById('tb1').value}, ()=>  this.handleCorrect())
  }

  if(number === '2' && document.getElementById('tb2').value.length > 0)
  {
    this.setState({correct: document.getElementById('tb2').value}, ()=>  this.handleCorrect())
  }

  if(number === '3' && document.getElementById('tb3').value.length > 0)
  {
    this.setState({correct: document.getElementById('tb3').value}, ()=>  this.handleCorrect())
  }

  if(number === '4' && document.getElementById('tb4').value.length > 0)
  {
    this.setState({correct: document.getElementById('tb4').value}, ()=>  this.handleCorrect())
  }
};

handleCorrect() {
  var answers = {...this.state.answers}
  console.log(this.state.correct)
  if(this.state.correct === this.state.answers[0].answer){
    answers[0].isRight = true
    this.setState({answers})
  }
  if(this.state.correct === this.state.answers[1].answer){
    answers[1].isRight = true
    this.setState({answers})
  }
  if(this.state.correct === this.state.answers[2].answer){
    answers[2].isRight = true
    this.setState({answers})
  }
  if(this.state.correct === this.state.answers[3].answer){
    answers[3].isRight = true
    this.setState({answers})
  }
}

handleChange() {
  if(this.state.level.length > 0 && this.state.question.length > 0 && this.state.image.length > 0 && this.state.answers[0].answer.length > 0 && this.state.answers[1].answer.length > 0 && this.state.answers[2].answer.length > 0 && this.state.answers[3].answer.length > 0)
  {
    console.log("test")
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl + 'https://sensafe-quiz.herokuapp.com/admin/addQuestion', {
      method: 'POST',
      headers: {    
        'Accept': 'application/json',
        'Content-Type': 'application/json',
},
      body: JSON.stringify({
        level: this.state.level,
        question: this.state.question,
        image: this.state.image,
        answers: Object.values(this.state.answers),
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({add: true})
      })
      .catch(error => {
        console.error(error);
      });
  }
  else  if(this.state.level.length > 0 || this.state.question.length > 0 || this.state.image.length > 0 || this.state.answers[0].answer.length > 0 || this.state.answers[1].answer.length > 0 || this.state.answers[2].answer.length > 0 || this.state.answers[3].answer.length > 0)
{
  this.setState({mistake: true})

}
  else {
    this.setState({add:true})
  }

}

render() {
  return (
    this.state.add ? <Quiz/> :
    <div className="question">
        <form>
          <label>
            <h6>:שאלה</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({question:event.target.value})
            }} />
          </label><br/>
          <label>
            <h6>:רמה</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({level:event.target.value})
            }} />
          </label><br/>
          <label>
            <h6>:קישור תמונה</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({image:event.target.value})
            }} />
          </label><br/>
          <fieldset>
            <h6>:תשובה</h6>
            <div id="div1"><input type="text" id="tb1" onChange={event => {
              var answers = {...this.state.answers}
              answers[0].answer = event.target.value;
              this.setState({answers})
            }} /><input className="rd" onChange={() => {this.handleRadio("1")}} type="radio" name="radio-set" id="radio-1"/></div>
             <h6>:תשובה</h6>
            <div id="div2"><input type="text" id="tb2" onChange={event => {
              var answers = {...this.state.answers}
              answers[1].answer = event.target.value;
              this.setState({answers})
            }} /><input className="rd" onChange={() => {this.handleRadio("2")}} type="radio" name="radio-set" id="radio-2" /></div>
             <h6>:תשובה</h6>
            <div id="div3"><input type="text" id="tb3" onChange={event => {
              var answers = {...this.state.answers}
              answers[2].answer = event.target.value;
              this.setState({answers})            
              }} /><input className="rd" onChange={() => {this.handleRadio("3")}} type="radio" name="radio-set" id="radio-2"/></div>
               <h6>:תשובה</h6>
            <div id="div4"><input type="text" id="tb4" onChange={event => {
              var answers = {...this.state.answers}
              answers[3].answer = event.target.value;
              this.setState({answers})            
              }} /><input className="rd" onChange={() => {this.handleRadio("4")}} type="radio" name="radio-set" id="radio-2"/></div>
        </fieldset>
        <p>אנא סמן את התשובה הנכונה*</p>
        {this.state.mistake ? <p>אנא מלא את כל הפרטים</p> : null}
          <Button variant="danger" onClick={this.handleChange}>הוספה/חזרה אחורה</Button> 
      </form>
    </div>
  );
}
}

export default editQuestion;