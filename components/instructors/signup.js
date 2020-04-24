import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Profile from '../instructors/profile';
import Login from '../instructors/login';
import RnHash, {CONSTANTS} from 'react-native-hash';
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: '',
      className: [],
      password: '',
      signed: -1, //0- go back, 1 - singed, 2 - registeration
      instructor: [],
      mistake: 0, // 0 - correct, 1 - id already exists, 2 - didn't fill the entire form
    };
    this.SignUp = this.SignUp.bind(this);
    this.fetchInstructor = this.fetchInstructor.bind(this);
  }

  SignUp() {
    fetch('https://sensafe-instructor.herokuapp.com/instructor/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        className: this.state.className,
        id: this.state.id,
        name: this.state.name,
        password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (typeof responseJson === 'string') {
          if (
            this.state.id === null ||
            this.state.name === '' ||
            this.state.className.length === 0 ||
            this.state.password === ''
          ) {
            this.setState({mistake: 2});
          } else {
            this.setState({mistake: 1});
            console.log(responseJson);
          }
        } else {
          this.setState({mistake: 0});
          this.fetchInstructor();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  fetchInstructor() {
    fetch('https://sensafe-instructor.herokuapp.com/oneInstructor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({instructor: responseJson});
      })
      .catch(error => {
        console.error(error);
      });
    this.setState({signed: 1});
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.signed === 1 ? (
          this.state.instructor.length > 0 ? (
            <Profile data={this.state.instructor[0]} />
          ) : null
        ) : this.state.signed === -1 ? (
          <View style={styles.container}>
            <Text style={styles.logo}>הרשמה</Text>
            <View style={styles.inputView}>
              <TextInput
                keyboardType="numeric"
                style={styles.inputText}
                placeholder="תעודת זהות"
                placeholderTextColor="#003f5c"
                onChangeText={text => this.setState({id: text})}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="שם פרטי ומשפחה"
                placeholderTextColor="#003f5c"
                onChangeText={text => this.setState({name: text})}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="כיתות לימוד"
                placeholderTextColor="#003f5c"
                onChangeText={text => {
                  var res = text.split(', ');
                  this.setState({className: res});
                }}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                secureTextEntry
                style={styles.inputText}
                placeholder="סיסמא"
                placeholderTextColor="#003f5c"
                onChangeText={text => {
                  RnHash.hashString(text, CONSTANTS.HashAlgorithms.md5)
                    .then(hash => {
                      this.setState({password: hash});
                    })
                    .catch(e => console.log(e));
                }}
              />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={this.SignUp}>
              <Text style={styles.loginText}>הרשמה</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({signed: 0});
              }}>
              <Text style={styles.loginText}>go back</Text>
            </TouchableOpacity>
            {this.state.mistake === 1 ? (
              <Text style={{color: 'white'}}>* תעודת זהות קיימת במערכת</Text>
            ) : this.state.mistake === 2 ? (
              <Text style={{color: 'white'}}>* נא למלא את כל הפרטים</Text>
            ) : null}
          </View>
        ) : (
          <Login />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
