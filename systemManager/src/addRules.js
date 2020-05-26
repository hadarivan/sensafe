import React, { Component } from 'react';
import './Laws.css';
import Button from 'react-bootstrap/Button'
import Laws from './rules';

class addLaw extends Component {

  constructor(props) {
    super(props)
    this.state={
      law:'',
      subject:'',
      add: false,
      mistake: false,
    }
    this.handleChange = this.handleChange.bind(this);
}


handleChange() {
  if(this.state.law.length > 0)
  {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://sensafe-server.herokuapp.com/traffic_law/add"
    fetch(proxyurl+url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        law: this.state.law,
        subject: this.state.subject,
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
  else  if(this.state.law.length > 0)
{
  this.setState({mistake: true})

}
  else {
    this.setState({add:true})
  }

}

render() {
  return (
    this.state.add ? <Laws/> :
    <div className="law">
        <form>
          <label>
            <h6>:חוק</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({law:event.target.value})
            }} />
          </label><br/>
          <label>
            <h6>:נושא</h6>
            <input className="input" type="text" onChange={event => {
              this.setState({subject:event.target.value})
            }} />
          </label><br/>
        {this.state.mistake ? <p>אנא מלא את כל הפרטים</p> : null}
          <Button variant="danger" onClick={this.handleChange}>הוספה/חזרה אחורה</Button> 
      </form>
    </div>
  );
}
}

export default addLaw;