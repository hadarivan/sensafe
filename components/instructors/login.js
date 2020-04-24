/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Profile from '../instructors/profile';
import SignUp from '../instructors/signup';
import RnHash, {CONSTANTS} from 'react-native-hash';
import * as Animatable from 'react-native-animatable';
import User from '../user';
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      password: '',
      instructors: [],
      instructor: null,
      signed: -1, // 0 - singed, 1 - login, 2 - registeration
      mistake: false,
      count: 0,
    };
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    fetch('https://sensafe-instructor.herokuapp.com/instructor')
      .then(response => response.json())
      .then(json => {
        this.setState({instructors: json});
      })
      .catch(error => console.error(error));
  }

  onPress() {
    this.state.instructors.map(item => {
      RnHash.hashString(this.state.password, CONSTANTS.HashAlgorithms.md5)
        .then(hash => {
          this.setState({count: this.state.count + 1});
          if (item.id === parseInt(this.state.id)) {
            if (item.password === hash) {
              this.setState({instructor: item});
              this.setState({signed: 1});
            }
          }
          if (this.state.count === this.state.instructors.length) {
            this.setState({mistake: true});
          }
        })
        .catch(e => console.log(e));
    });
  }

  render() {
    return (
      <Animatable.View useNativeDriver duration={1500} animation="fadeIn">
        <View style={styles.container}>
          {this.state.signed === 1 ? (
            <Profile data={this.state.instructor} />
          ) : this.state.signed === 2 ? (
            <View>
              <SignUp />
            </View>
          ) : this.state.signed === 0 ? (
            <User />
          ) : (
            <View style={styles.container}>
              <Text style={styles.logo}>SenSafe - מדריך</Text>
              {this.state.instructor === null ? (
                this.state.mistake ? (
                  <Text style={{color: 'white'}}>
                    חלק מפרטי ההזדהות שהוקלדו אינם נכונים
                  </Text>
                ) : null
              ) : null}
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="תעודת זהות..."
                  placeholderTextColor="#003f5c"
                  onChangeText={text => this.setState({id: text})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  secureTextEntry
                  style={styles.inputText}
                  placeholder="סיסמא..."
                  placeholderTextColor="#003f5c"
                  onChangeText={text => this.setState({password: text})}
                />
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={this.onPress}>
                <Text style={styles.loginText}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({signed: 2});
                }}>
                <Text style={styles.loginText}>Signup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({signed: 0});
                }}>
                <Text style={styles.loginText}>go back</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 35,
    color: 'white',
    marginBottom: 40,
  },
  inputView: {
    width: 300,
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: 200,
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
});
