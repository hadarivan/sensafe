import React, { Component } from 'react';
import {Image, StyleSheet, View } from 'react-native';

export default class TrafficSignImage extends Component {

  constructor() {
    super();
  }
  
  render() {
    return (
      <View style={styles.imageHolder}>
        <Image source={{ uri: this.props.imageURI }} style={styles.image} />
      </View>
    );
  }
}

const styles = StyleSheet.create(
{ 
  imageHolder: {
    marginTop: 4,
    marginRight:4,
    marginLeft:4,
    height: 175,
    flex: 1,
    position: 'relative'
  },
  image: {
      height: '100%',
      width: '100%',
      borderTopRightRadius:5,
      borderTopLeftRadius:5
      
    }
});