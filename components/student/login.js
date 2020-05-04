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
import SignUp from '../student/signup';
import User from '../user';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
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
    var count = 0;
    this.state.students.map(item => {
      if (item.name === this.state.name) {
        if (item.grade === this.state.grade) {
          this.setState({student: item});
          console.log(this.state.grade);
          this.setState({signed: 1});
        } else {
          this.setState({mistake: true});
        }
      } else {
        count = count + 1;
      }
    });
    if (count === this.state.students.length) {
      this.setState({mistake: true});
    }
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
            <Image
              style={{width: screenWidth, height: 350, top: 17}}
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
              style={{
                width: 280,
                height: 110,
                bottom: 163,
              }}
              source={require('./images/logo.png')}
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
                  onChangeText={text => this.setState({grade: text})}
                />
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={this.onPress}>
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
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#258c4e',
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
    marginBottom: 30,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
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
