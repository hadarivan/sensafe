import React, { Component } from 'react';
import { AppRegistry, TouchableHighlight, Modal, FlatList, ActivityIndicator, StyleSheet, View, Platform, Text, Alert } from 'react-native';


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

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  }

  render() {
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
            (<View style={{ flex: 1 }}>
               <View style={styles.Header}>
                  <Text style={styles.HeaderText}>{this.state.HeaderText}</Text>
                </View>
            <View style ={styles.lawsHolder}>
              <FlatList keyExtractor={(item) => item.law}
                key={(this.state.gridView) ? 1 : 0}
                data={this.state.allTrafficLaws}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
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
      backgroundColor:'#006699',

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
      backgroundColor: 'rgba(0,0,0,0.2)',
      paddingHorizontal: 10,
      paddingVertical: 13,
    },
    lawText: {
      color: 'white'
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
    }
  });