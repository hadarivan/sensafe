/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LoginInstructor from './instructors/login';
import LoginStudent from './student/login';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 0, // 0 - home, 1 - student, 2-instructor
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.user === 0 ? (
          <View style={styles.container}>
            <Image
              style={{width: screenWidth, height: 350, bottom: 25}}
              source={require('../components/student/images/test.jpeg')}
            />
            <Image
              style={{
                width: 280,
                height: 110,
                bottom: 175,
              }}
              source={require('../components/student/images/logo.png')}
            />
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => {
                this.setState({user: 1});
              }}>
              <Text style={styles.loginText}>כניסה כתלמיד</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => {
                this.setState({user: 2});
              }}>
              <Text style={styles.loginText}>כניסה כמדריך</Text>
            </TouchableOpacity>
          </View>
        ) : this.state.user === 1 ? (
          <LoginStudent />
        ) : (
          <LoginInstructor />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#258c4e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    shadowColor: 'black',
    elevation: 10, // Android
    bottom: 60,
    width: 250,
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  loginText: {
    fontSize: 30,
    color: 'black',
  },
});
