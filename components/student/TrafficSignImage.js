/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { Image, StyleSheet, View } from 'react-native'

export default class TrafficSignImage extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor () {
    super()
  }

  // traffic sign image declaration for grid view
  render () {
    return (
      <View style={styles.imageHolder}>
        <Image source={{ uri: this.props.imageURI }} style={styles.image} />
      </View>
    )
  }
}

const styles = StyleSheet.create(
  {
    imageHolder: {
      marginTop: 4,
      marginRight: 4,
      marginLeft: 4,
      height: 175,
      flex: 1,
      position: 'relative'
    },
    image: {
      height: '100%',
      width: '100%',
      borderTopRightRadius: 5,
      borderTopLeftRadius: 5

    }
  })
