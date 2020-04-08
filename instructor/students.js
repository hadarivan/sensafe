import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
export default class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 0, // 0 - home, 1 - student, 2-instructor
    };
  }

  render() {
    return (
      <View>
        <Text>{this.props.data}</Text>
      </View>
    );
  }
}
