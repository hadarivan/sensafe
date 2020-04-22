import React, { Component } from 'react';
import { AppRegistry, TouchableOpacity, Image, FlatList, ActivityIndicator, StyleSheet, View, Platform, Text } from 'react-native';

export default class TrafficSignImage extends Component {

  constructor() {
    super();
  }
  
  render() {
    return (
      <View style={styles.imageHolder}>
        <Image source={{ uri: this.props.imageURI }} style={styles.image} />
        <View style={styles.textViewHolder}>
          <Text numberOfLines={1} style={styles.textOnImage}>
            {this.props.name}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create(
{ 
  imageHolder: {
    margin: 4,
    marginBottom:42,
    height: 175,
    flex: 1,
    position: 'relative'
  },
  image: {
      height: '100%',
      width: '100%',
      resizeMode: 'cover'
  },
  textViewHolder: {
    position: 'relative',
    left: 0,
    top:0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(26,178,255,1)',
    paddingHorizontal: 10,
    paddingVertical: 9,
    alignItems: 'center'
  },
  textOnImage: {
    color: 'white'
  },
});