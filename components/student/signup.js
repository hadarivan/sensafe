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
import Menu from '../student/menu';
import Login from '../student/login';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: '',
      grade: '',
      signed: -1, //0- go back, 1 - singed, 2 - registeration
      student: [],
      mistake: 0, // 0 - correct, 1 - id already exists, 2 - didn't fill the entire form
    };
    this.SignUp = this.SignUp.bind(this);
  }

  SignUp() {
    if (
      this.state.id === null ||
      this.state.name === '' ||
      this.state.grade === ''
    ) {
      this.setState({mistake: 2});
    } else {
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
            this.setState({mistake: 1});
            console.log(responseJson);
          } else {
            this.setState({mistake: 0});
            this.setState({student: responseJson});
            this.setState({signed: 1});
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.signed === 1 ? (
          <Menu data={this.state.student} />
        ) : this.state.signed === -1 ? (
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => this.setState({signed: 0})}
              style={{bottom: 100, right: 150}}>
              <Image
                source={require('../student/images/logout.png')}
                style={styles.logout}
              />
            </TouchableOpacity>
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
            {this.state.mistake === 1 ? (
              <Text style={{color: 'white'}}>* כינוי קיים במערכת</Text>
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
    backgroundColor: '#258c4e',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenHeight,
  },
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 35,
    color: 'white',
    marginBottom: 40,
  },
  inputView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'black',
  },
});
