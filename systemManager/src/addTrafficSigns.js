import React, { Component } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'
import TrafficSigns from './trafficSigns';

class AddTrafficSign extends Component {

  constructor(props) {
    super(props)
    this.state={
      id:'',
      name:'',
      toDo:'',
      image:'',
      add: false,
      mistake: false
    }
    this.handleChange = this.handleChange.bind(this);
}



handleChange() {
  if(this.state.id.length > 0 && this.state.name.length > 0 && this.state.toDo.length > 0 && this.state.image.length > 0)
  {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = 'https://sensafe-server.herokuapp.com/traffic_sign/add'
    fetch(proxyurl+url, {
      method: 'POST',
      headers: {    
        'Accept': 'application/json',
        'Content-Type': 'application/json',
},
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        toDo: this.state.toDo,
        image: this.state.image
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

  else  if(this.state.id.length > 0 || this.state.name.length > 0 || this.state.toDo.length > 0 || this.state.image.length > 0 )
  {
    this.setState({mistake: true})
  
  }

  else {
    this.setState({add:true})
  }

}

render() {
  return (
    this.state.add ? <TrafficSigns/> :
    <div className="question">
        <form>
          <label>
            <h6>:מספר זיהוי תמרור</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({id:event.target.value})
            }} />
          </label><br/>
          <label>
            <h6>:שם התמרור</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({name:event.target.value})
            }} />
          </label><br/>
          <label>
            <h6>:משמעות התמרור</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({toDo:event.target.value})
            }} />
          </label><br/>
          <label>
            <h6>:קישור תמונה</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({image:event.target.value})
            }} />
          </label><br/>
          {this.state.mistake ? <p>אנא מלא את כל הפרטים</p> : null}
          <Button variant="danger" onClick={this.handleChange}>הוספה</Button> 
      </form>
    </div>
  );
}
}

export default AddTrafficSign;