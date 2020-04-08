/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Menu from '../student/menu';
import Login from '../student/login';
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: '',
      grade: '',
      signed: -1, //0- go back, 1 - singed, 2 - registeration
      student: [],
      exist: false,
    };
    this.SignUp = this.SignUp.bind(this);
  }

  SignUp() {
    fetch('https://sensafe-student.herokuapp.com/admin/addStudent', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        grade: this.state.grade,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (typeof responseJson === 'string') {
          this.setState({exist: true});
        } else {
          this.setState({exist: false});
          this.setState({student: responseJson});
          this.setState({signed: 1});
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.signed === 1 ? (
          <Menu data={this.state.student} />
        ) : this.state.signed === -1 ? (
          <View style={styles.container}>
            <Text style={styles.logo}>הרשמה</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="כינוי"
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
                placeholder="כיתה"
                placeholderTextColor="#003f5c"
                onChangeText={text => {
                  this.setState({grade: text});
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
            {this.state.exist ? (
              <Text style={{color: 'white'}}>* כינוי קיים במערכת</Text>
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
