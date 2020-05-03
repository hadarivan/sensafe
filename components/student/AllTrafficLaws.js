import React, { Component } from 'react';
import AnimatedLoader from 'react-native-animated-loader';
import { FlatList,StyleSheet, View, Text} from 'react-native';


export default class App extends Component {

  constructor() {
    super();
    this.state = { 
        allTrafficLaws: null,
        loading: true,
        gridView: true, 
        HeaderText: 'חוקי תנועה' 
    }
  }

  componentDidMount() {
    fetch('https://sensafe-server.herokuapp.com/traffic_law')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ allTrafficLaws: responseJson, loading: false });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container} >
        {
          (this.state.loading)
            ?
            (<View style={styles.loadingContainer}>
               <AnimatedLoader
                visible={true}
                overlayColor="003f5c"
                animationStyle={styles.lottie}
                speed={1}
                source={require('../student/images/18535-best-bike-guide-bicycle.json')}
              />
            </View>)
            :
            (<View style={{ flex: 1 }}>
              <View style={styles.Header}>
                  <Text style={styles.HeaderText}>{this.state.HeaderText}</Text>
              </View>
            <View style ={styles.lawsHolder}>
              <FlatList keyExtractor={(item) => item.law}
                numColumns={(this.state.gridView) ? 1 : 0}
                data={this.state.allTrafficLaws}
                renderItem={({ item }) =>
                  <View style ={styles.lawTextHolder}>
                    <Text style={styles.lawText}>{item.law} </Text> 
                  </View>
                }/>
            </View>
        </View>)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    container: {
      flex:1,
      backgroundColor:'#d3edea'
    },
    lawsHolder: {
      margin: 5,
      height: 30,
      flex: 1,
      position: 'relative'
      
    },
    lawTextHolder: {
      position: 'relative',
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255,1)',
      paddingHorizontal: 10,
      paddingVertical: 13,
      marginBottom:5,
      borderRadius:5,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 1,
      },
      shadowOpacity: 0.10,
      shadowRadius: 2.5,
  
      elevation: 2,
    },
    lawText: {
      color: 'black'
    },
    lottie: {
      width: 100,
      height: 100
    },
    Header: {
      padding: 15,
      backgroundColor: '#93d1bc'
    },
    HeaderText: {
      color: 'white',
      textAlign: 'center',
      alignSelf: 'stretch'
    }
  });