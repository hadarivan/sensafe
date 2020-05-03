import React, { Component } from 'react';
import AnimatedLoader from 'react-native-animated-loader';
import {  Alert, Modal, FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
            (<View style={styles.lottie}>
              <AnimatedLoader
                visible={true}
                overlayColor="003f5c"
                animationStyle={styles.lottie}
                speed={1}
                source={require('../student/images/18535-best-bike-guide-bicycle.json')}
              />
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
                <View style = {styles.textViewHolderOnPress}>
                  <Text style={styles.textOnImageOnPress}>{selectedObject.name}</Text>
                </View>
                <View style={styles.imageHolderOnPress}>
                  <TrafficSignImage imageURI={selectedObject.image} style={styles.imageOnPress} />
                  <View style={styles.toDoContainer}>
                    <Text style={styles.meaning}>משמעות התמרור</Text>
                    <Text style={styles.toDo}>{selectedObject.toDo}</Text> 
                  </View> 
                </View>
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
                    <TouchableOpacity onPress={() => {
                      this.displayModal(true,item.id);
                      }} style={{flex:1}}>
                      <TrafficSignImage imageURI={item.image}/>
                      <View style={styles.textViewHolder}>
                        <Text numberOfLines={1} style={styles.textOnImage}>{item.name}</Text>
                      </View>
                    </TouchableOpacity> 
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
    backgroundColor:'#b5e2ff'

  },
  lottie: {
    width: 100, 
    height: 100
  },
    Header: {
      padding: 15,
      backgroundColor: 'rgba(77,170,238,0.75)'
    },
    HeaderText: {
      color: 'white',
      textAlign: 'center',
      alignSelf: 'stretch'
    },
    textViewHolderOnPress: {
      position: 'relative',
      left: 0,
      top:0,
      bottom: 0,
      right: 0,
      height:50,
      backgroundColor: 'rgba(77,170,238,0.75)',
      paddingHorizontal: 10,
      paddingVertical: 9,
      alignItems: 'center',
    },
    textOnImageOnPress: {
      color: 'white',
      padding: 5,
      fontSize: 15
    },
    imageHolderOnPress: {
      margin: 5,
      marginBottom:35,
      flex: 1,
      position: 'relative',
      justifyContent: 'center'
    },
    imageOnPress: {
        padding:25,
        alignItems: 'center'
    },
    toDoContainer:{
        paddingTop:25
        
    },
    meaning:{
      paddingRight:15,
      fontSize:18,
      fontWeight:'bold',
      color:'#000000'
    },
    toDo: {
      fontSize: 18,
      paddingLeft:15,
      paddingRight:15,
      paddingBottom:30
    },
    closeText: {
      fontSize: 26,
      color: '#00479e',
      textAlign: 'center',
    },
    textViewHolder: {
      position: 'relative',
      left: 0,
      top:0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(77,170,238,0.75)',
      marginHorizontal: 4,
      paddingVertical: 9,
      borderBottomLeftRadius:5,
      borderBottomRightRadius:5,
      alignItems: 'center',
      marginBottom:5
    },
    textOnImage: {
      color: 'white'
    }
  });
 