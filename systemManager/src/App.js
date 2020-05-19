/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import './App.css';
import Quiz from './quiz';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button'
import logo from './images/logo.png'


class App extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      screen: 3, // 0 - menu , 1-traffic signs , 2 - traffic laws , 3 - quiz , 4 - simulation
    };
  }

  render() {  
    return (
    <div className="App">
      <img src={logo}></img>
      <div className="myHeader">
        <Button variant="success" onClick={()=> {
          this.setState({screen:3})
        }}>בוחן</Button>
        <Button variant="warning" onClick={()=> {
          this.setState({screen:2})
        }}>תמרורים</Button> 
        <Button variant="danger" onClick={()=> {
          this.setState({screen:1})
        }}>חוקים</Button> 
      </div>
      <div className="body">
        {this.state.screen === 3 ? 
        <Quiz data={false} /> 
        :
        this.state.screen === 2 ? 
        /* <TrafficSigns /> */ null
        :
        this.state.screen === 1 ? 
        /*<TrafficLaws />*/ null
        :
        null
      }
      </div>
    </div>
  );}
}

export default App;
