import React, { Component } from 'react';
import { AppRegistry, Alert, TouchableHighlight,Image, Modal, FlatList, ActivityIndicator, StyleSheet, View, Platform, Text } from 'react-native';
import TrafficSignImage from './TrafficSignImage'


export default class AllTrafficSigns extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      allTrafficSigns: null,
      loading: true,
      gridView: true,
      HeaderText: 'תמרורים',
      isVisible:false,
      selectedId:false
    }
  }

  componentDidMount() {
    fetch('https://sensafe-server.herokuapp.com/traffic_sign')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ allTrafficSigns: responseJson, loading: false });
      })
      .catch((error) => {
        console.error(error);
      });
  }
   // hide show modal
   displayModal(show,id){
    this.setState({isVisible: show,selectedId:id})
  }
  render() {
   
    var trafficSigns = this.state.allTrafficSigns;
    var selectedObject=this.state.selectedId?trafficSigns.find(item=>item.id==this.state.selectedId):false
    console.log(selectedObject)
    return (
      <View style={styles.container} >
        {
          (this.state.loading)
            ?
            (<View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Please Wait...</Text>
            </View>)
            :
            (<View style={{ flex: 1}}>
                <View style={styles.Header}>
                <Text style={styles.HeaderText}>{this.state.HeaderText}</Text>
                </View>
             <Modal 
                animationType = {"slide"}
                transparent={false}
                visible={this.state.isVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has now been closed.');
                }}>
               
              <View style={{flex:1}}>
                  <TrafficSignImage imageURI={selectedObject.image} name={selectedObject.name}/>
                  <Text style={styles.toDo}>{selectedObject.toDo}</Text>                        
              </View>

              <Text 
                style={styles.closeText}
                onPress={() => {
                  this.displayModal(!this.state.isVisible);}}>סגור</Text>
              </Modal>
              
              <FlatList keyExtractor={(item) => item.id}
                  numColumns={this.state.gridView ? 2 : 1}
                  data={trafficSigns}
                  renderItem={({ item }) =>
                    <TouchableHighlight onPress={() => {
                      this.displayModal(true,item.id);
                      }} style={{flex:1}}>
                      <TrafficSignImage imageURI={item.image} name={item.name}/>
                    </TouchableHighlight> 
                  }/>
            </View>)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {  
    container: {
    flex: 1,
    backgroundColor:'#006699'
  },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    loadingText: {
      paddingTop: 10,
      fontSize: 18,
      color: 'white'
    },
    Header: {
      padding: 15,
      backgroundColor: '#1ab2ff'
    },
    HeaderText: {
      color: 'white',
      textAlign: 'center',
      alignSelf: 'stretch'
    },
    toDo: {
      fontSize: 20,
      padding: 25
    },
    closeText: {
      fontSize: 24,
      color: '#00479e',
      textAlign: 'center',
    }
  });
 