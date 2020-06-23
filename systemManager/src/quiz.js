/* eslint-disable jsx-a11y/alt-text */

import React, { Component } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import AddQuestion from './addQuestion';
import Loader from 'react-loader-spinner';
import del from './images/delete.png'

class Quiz extends Component {

  constructor(props) {
    super(props)
    this.state={
      questions:[],
      delete:false,
      add: this.props.data
    }
  
    this.eachQuestion=this.eachQuestion.bind(this)
    this.delete = this.delete.bind(this);
  }

    componentDidMount() {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = 'https://sensafe-quiz.herokuapp.com/admin/allQuestions';
      fetch(proxyurl+url)
      .then(res => res.json())
      .then(response => {
        this.setState({questions: response})
    })
        .catch(error => console.error(error));
      }

      delete(question) {
        console.log(question);
        fetch('https://sensafe-quiz.herokuapp.com/admin/deleteQuestion', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: question,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log(responseJson);
            this.componentDidMount()
          })
          .catch(error => {
            console.error(error);
          });
      }

eachQuestion(item, i) {
  return (
    <Card
      key={ `container${item._id}` }
      className="questionCard"
    >
        <img onClick= {() => this.delete(item.question)}style={{width:30, height:30}} src={del}/>
        <h6>שאלה: {item.question}</h6>
        <h6>רמה: {item.level}</h6>
        <h6 style={{color: item.answers[0].isRight ? 'green' : 'red'}}>תשובה: {item.answers[0].answer}</h6>
        <h6 style={{color: item.answers[1].isRight ? 'green' : 'red'}}>תשובה: {item.answers[1].answer}</h6>
        <h6 style={{color: item.answers[2].isRight ? 'green' : 'red'}}>תשובה: {item.answers[2].answer}</h6>
        <h6 style={{color: item.answers[3].isRight ? 'green' : 'red'}}>תשובה: {item.answers[3].answer}</h6>
        <br/>
    </Card>
  );
}


render() {
  return (
    <div>
        <div className="body">
            {this.state.add ? 
                    <AddQuestion/>
                    : 
                    this.state.questions.length === 0 ? 
                    <Loader
                    style={{position: 'relative', left: '600px', top: '200px'}}
                    type="TailSpin"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                 />
                    :
                    <div>
                    <h3 style={{textAlign:'center'}}>Questions</h3>
                    <Button style={{position: 'relative', left: '1020px', top:'20px'}}variant="success" onClick={()=> {
                      this.setState({add:true})
                        }}>הוספת שאלה</Button>
                    <div className="productList">
                    <br/>
                    { this.state.questions.map(this.eachQuestion) }
                </div></div>}

        </div>
    </div>
  );
}
}

export default Quiz;