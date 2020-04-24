/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Students from '../instructors/students';
import EditProfile from '../instructors/editProfile';
import Login from '../instructors/login';
import StudentData from './studentData';
import * as Animatable from 'react-native-animatable';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grade: null,
      edit: false,
      instructor: null,
      photo:
        'https://cdn0.iconfinder.com/data/icons/occupation-002/64/teacher-teach-occupation-avatar-512.png',
      logout: false,
      studentData: false,
    };
  }
  componentDidMount() {
    console.log(this.props.data);
    fetch('https://sensafe-instructor.herokuapp.com/oneInstructor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.data.id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        this.setState({instructor: responseJson});
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <Animatable.View
        style={styles.container}
        useNativeDriver
        duration={3000}
        animation="fadeIn">
        <View style={styles.container}>
          {this.state.logout ? (
            <Login />
          ) : this.state.studentData ? (
            <StudentData data={this.state.instructor[0]} />
          ) : this.state.grade === null ? (
            this.state.edit ? (
              <EditProfile data={this.state.instructor[0]} />
            ) : this.state.instructor ? (
              <View>
                <View style={{height: 280}}>
                  <View style={styles.header} />
                  <TouchableOpacity
                    onPress={() => this.setState({logout: true})}
                    style={{bottom: 280, right: 150}}>
                    <Image
                      source={require('../student/images/logout.png')}
                      style={styles.logout}
                    />
                  </TouchableOpacity>
                  <Image
                    source={{uri: this.state.instructor[0].image}}
                    style={styles.avatar}
                  />
                  <Text style={styles.name}>
                    {this.state.instructor[0].name}
                  </Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      this.setState({edit: true});
                    }}>
                    <Text style={{justifyContent: 'center', fontSize: 18}}>
                      {'  '}
                      עריכת פרופיל
                    </Text>
                    <Image
                      style={{width: 25, height: 25}}
                      source={require('../student/images/edit.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.body}>
                  <ScrollView style={{flex: 1}}>
                    <View style={styles.bodyContent}>
                      <Text style={styles.info}>כיתות לימוד</Text>
                      {this.state.instructor[0].className.map(className => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({grade: className});
                            }}>
                            <Text style={styles.classes}>{className}</Text>
                          </TouchableOpacity>
                        );
                      })}
                      <TouchableOpacity
                        onPress={() => this.setState({studentData: true})}
                        style={styles.buttonContainer}>
                        <Text>נתוני תלמידים</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </View>
            ) : null
          ) : (
            <Students data={this.state.grade} />
          )}
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
    width: 400,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#00BFFF',
    height: 300,
    width: 400,
  },
  lottie: {width: 100, height: 100},
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 30,
  },
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  body: {
    height: 300,
    top: 30,
  },
  bodyContent: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
  },
  name: {
    textAlign: 'center',
    bottom: 150,
    fontSize: 28,
    color: 'white',
    fontWeight: '600',
  },
  info: {
    fontSize: 22,
    color: '#00BFFF',
    marginTop: 10,
  },
  classes: {
    fontSize: 20,
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  editButton: {
    flexDirection: 'row',
    left: 100,
    bottom: 130,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
