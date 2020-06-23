import React, { Component } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import AddTrafficSign from './addTrafficSigns';
import del from './images/delete.png'
import Loader from 'react-loader-spinner';


class TrafficSigns extends Component {

  constructor(props) {
    super(props)
    this.state={
      TrafficSigns:[],
      delete:false,
      add: this.props.data
    }
  
    this.eachTrafficSign=this.eachTrafficSign.bind(this)
    this.delete = this.delete.bind(this);
  }

    componentDidMount() {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = 'https://sensafe-server.herokuapp.com/traffic_sign';
      fetch(proxyurl+url)
      .then(res => res.json())
      .then(response => {
        this.setState({TrafficSigns: response})
    })
        .catch(error => console.error(error));
      }

      delete(name) {
        console.log(name);
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = 'https://sensafe-server.herokuapp.com/traffic_sign/delete';
        fetch(proxyurl+url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
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

eachTrafficSign(item, i) {
  return (
    <Card
      key={ `container${item._id}` }
      className="questionCard"
    >
        <img onClick= {() => this.delete(item.name)}style={{width:30, height:30}} src={del}/>
        <h6>מספר זיהוי תמרור: {item.id}</h6>
        <h6>שם התמרור: {item.name}</h6>
        <h6>משמעות התמרור: {item.toDo}</h6>
        <h6>{item.image} :קישור תמונה </h6>
        <br/>
    </Card>
  );
}


render() {
  return (
    <div>
        <div className="body">
            {this.state.add ? 
                    <AddTrafficSign/>
                    : 
                    this.state.TrafficSigns.length === 0 ?
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
                    <h3 style={{textAlign:'center'}}>Traffic Signs</h3>
                    <Button style={{position: 'relative', left: '1020px', top:'20px'}}variant="success" onClick={()=> {
                      this.setState({add:true})
                        }}>הוספת תמרור</Button>
                    <div className="productList">
                    <br/>
                    { this.state.TrafficSigns.map(this.eachTrafficSign) }
                    </div>
                    </div>}
        </div>
    </div>
  );
}
}

export default TrafficSigns;