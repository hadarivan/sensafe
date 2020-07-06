/* eslint-disable jsx-a11y/alt-text */

import React, { Component } from 'react';
import './Laws.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import AddLaw from './addRules';
import del from './images/delete.png'

class Laws extends Component {

  constructor(props) {
    super(props)
    this.state={
        allTrafficLaws:[],
        law:null,
        delete:false,
        add: this.props.data
    }
  
    this.eachLaw=this.eachLaw.bind(this)
    this.delete = this.delete.bind(this);
  }

    componentDidMount() {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = "https://sensafe-server.herokuapp.com/traffic_law"
      fetch(proxyurl+url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({ allTrafficLaws: responseJson});
      })
      .catch((error) => {
        console.error(error);
      });
    }

    delete(law) {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = "https://sensafe-server.herokuapp.com/traffic_law/delete"
      fetch(proxyurl+url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            law: law,
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

eachLaw(item, i) {
  return (
    <Card
      key={ `container${item._id}` }
      className="RulesCard"
    >
        <img onClick= {() => this.delete(item.law)}style={{width:30, height:30}} src={del}/>
        <h6>חוק: {item.law}</h6>
        <h6>נושא: {item.subject}</h6>
    </Card>
  );
}


render() {
  return (
    <div>
      <div className="body">
        {this.state.add ? 
          <AddLaw/>
          : 
          <div>
            <h3 style={{textAlign:'center'}}>Laws</h3>
            <Button style={{float:'right', marginRight: '80px', marginTop:'20px'}}variant="success" onClick={()=> {
              this.setState({add:true})
                }}>הוספת חוק</Button>
            <div className="productList">
            <br/>
            { this.state.allTrafficLaws.map(this.eachLaw) }
            </div>
          </div>}
      </div>
    </div>
  );
}
}

export default Laws;
