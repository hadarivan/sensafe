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
import SignUp from '../student/signup';
import User from '../user';
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      students: [],
      student: null,
      grade: '',
      name: '',
      signed: -1, //0- go back, 1 - singed, 2 - registeration
      mistake: false,
    };
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    fetch('https://sensafe-student.herokuapp.com/admin')
      .then(response => response.json())
      .then(json => {
        this.setState({students: json});
      })
      .catch(error => console.error(error));
  }

  onPress() {
    this.state.students.map(item => {
      if (item.name === this.state.name) {
        if (item.grade === this.state.grade) {
          this.setState({student: item});
          console.log(this.state.grade);
          this.setState({signed: 1});
        } else {
          this.setState({mistake: true});
        }
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.signed === 1 ? (
          <Menu data={this.state.student} />
        ) : this.state.signed === 2 ? (
          <View>
            <SignUp />
          </View>
        ) : this.state.signed === 0 ? (
          <User />
        ) : (
          <View style={styles.container}>
            <Text style={styles.logo}>SenSafe - תלמיד</Text>
            {this.state.mistake ? (
              <Text style={{color: 'white'}}>
                חלק מפרטי ההזדהות שהוקלדו אינם נכונים
              </Text>
            ) : null}
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="שם ושם משפחה"
                placeholderTextColor="#003f5c"
                onChangeText={text => this.setState({name: text})}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="כיתה"
                placeholderTextColor="#003f5c"
                onChangeText={text => this.setState({grade: text})}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
