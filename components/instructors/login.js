/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
let screenWidth = Dimensions.get('window').width;
import Profile from '../instructors/profile';
import SignUp from '../instructors/signup';
import {JSHash, CONSTANTS} from 'react-native-hash';
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
      JSHash(this.state.password, CONSTANTS.HashAlgorithms.keccak).then(
        hash => {
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
        },
      );
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
          ) : this.state.instructors != null ? (
            <View style={styles.container}>
              <Image
                style={styles.background}
                source={require('../student/images/test.jpeg')}
              />
              <TouchableOpacity
                onPress={() => this.setState({signed: 0})}
                style={{bottom: 300, right: 150}}>
                <Image
                  source={require('../student/images/logout.png')}
                  style={styles.logout}
                />
              </TouchableOpacity>
              <Image
                style={styles.logo}
                source={require('../student/images/logo.png')}
              />

              <View style={{bottom: 100}}>
                {this.state.mistake ? (
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    חלק מפרטי ההזדהות שהוקלדו אינם נכונים
                  </Text>
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
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={this.onPress}>
                  <Text style={styles.loginText}>התחברות</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({signed: 2});
                  }}>
                  <Text style={styles.loginText}>הרשמה</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#258c4e',
  },
  logo: {
    width: 280,
    height: 110,
    bottom: 168,
  },
  background: {width: screenWidth, height: 350, top: 12},
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  inputView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    marginBottom: 30,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginText: {
    alignSelf: 'center',
    fontSize: 25,
    color: 'black',
  },
});
