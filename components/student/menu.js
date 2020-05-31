/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Login from '../student/login';
import Quiz from '../student/quiz';
import Simulation from '../student/Simulation';
import AllTrafficSigns from '../student/allTrafficSigns';
import AllTrafficLaws from '../student/allTrafficLaws';
import StudentProfile from '../student/studentProfile';
import {Root, Popup} from 'popup-ui';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
      quizGrade: 0,
      student: null,
      screen: 0, // 0 - menu , 1-traffic signs , 2 - traffic laws , 3 - quiz , 4 - simulation, 5 - profile
    };
  }

  componentDidMount() {
    fetch('https://sensafe-student.herokuapp.com/admin/getStudentId', {
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
        console.log(responseJson[0].simCount);
        this.setState({student: responseJson});
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <Root>
        <View style={styles.container}>
          {this.state.screen === 0 ? (
            this.state.logout ? (
              <Login />
            ) : this.state.student !== null ? (
              <View>
                <View
                  style={[
                    styles.header,
                    {
                      backgroundColor: this.props.data.profileColor,
                      opacity: 0.7,
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({screen: 5});
                  }}
                  style={[
                    styles.avatar,
                    {backgroundColor: this.props.data.profileColor},
                  ]}>
                  <Text style={{fontSize: 60, alignSelf: 'center', top: 20}}>
                    {this.props.data.name.charAt(0)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({logout: true})}
                  style={{bottom: 185, right: 150}}>
                  <Image
                    source={require('../student/images/logout.png')}
                    style={styles.logout}
                  />
                </TouchableOpacity>
                <Image
                  source={require('./images/logo.png')}
                  style={{
                    bottom: 250,
                    marginRight: 5,
                    alignSelf: 'flex-end',
                    width: 105,
                    height: 105,
                    resizeMode: 'contain',
                  }}
                />
                <Text style={styles.logo}>שלום {this.props.data.name}</Text>
                <View
                  style={{
                    flex: 1,
                    bottom: 160,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: screenWidth,
                  }}>
                  <TouchableOpacity
                    style={styles.menuBtn}
                    onPress={() => {
                      this.setState({screen: 1});
                    }}>
                    <Image
                      style={{width: 100, height: 100}}
                      source={require('./images/stop.png')}
                    />
                    <Text style={styles.menuText}>תמרורים</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuBtn}
                    onPress={() => {
                      this.setState({screen: 2});
                    }}>
                    <Image
                      style={{width: 100, height: 100}}
                      source={require('./images/education.png')}
                    />
                    <Text style={styles.menuText}>חוקים</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuBtn}
                    onPress={() => {
                      this.setState({screen: 3});
                    }}>
                    <Image
                      style={{width: 100, height: 100}}
                      source={require('./images/tablet.png')}
                    />
                    <Text style={styles.menuText}>בוחן</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={
                      this.state.student[0].simCount === 3
                        ? true
                        : this.state.student[0].quizGrade === null
                        ? this.state.quizGrade >= 60
                          ? false
                          : true
                        : this.state.student[0].quizGrade >= 60
                        ? false
                        : true
                    }
                    style={{
                      width: screenWidth / 2 - 5,
                      backgroundColor:
                        this.state.student[0].simCount === 3
                          ? '#fb5b5a'
                          : this.state.student[0].quizGrade === null
                          ? this.state.quizGrade >= 60
                            ? 'green'
                            : '#fb5b5a'
                          : this.state.student[0].quizGrade >= 60
                          ? 'green'
                          : '#fb5b5a',
                      height: screenWidth / 2 - 5,
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      margin: 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      this.setState({screen: 4});
                    }}>
                    <Image
                      style={{width: 100, height: 100}}
                      source={require('./images/transport.png')}
                    />
                    <Text style={styles.menuText}>סימולציה</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Popup.show({
                      type: 'Warning',
                      title: 'שים לב !',
                      textBody:
                        'מעבר לשלב הסימולציה יתאפשר בציון 60 ומעלה בבוחן',
                      buttontext: 'Ok',
                      callback: () => {
                        Popup.hide();
                      },
                    });
                  }}
                  style={[styles.mark, {backgroundColor: 'white'}]}>
                  <Text style={{fontSize: 30, alignSelf: 'center', top: 10}}>
                    ?
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          ) : this.state.screen === 1 ? (
            <AllTrafficSigns data={this.props.data} />
          ) : this.state.screen === 2 ? (
            <AllTrafficLaws data={this.props.data} />
          ) : this.state.screen === 3 ? (
            <Quiz data={this.props.data} />
          ) : this.state.screen === 4 ? (
            <Simulation data={this.state.student[0]} />
          ) : (
            <StudentProfile data={this.props.data} />
          )}
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    width: screenWidth,
    height: screenHeight,
  },
  avatar: {
    bottom: 60,
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    alignSelf: 'center',
  },
  mark: {
    elevation: 10,
    shadowColor: 'black',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: 'center',
    bottom: 230,
  },
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  header: {
    height: 80,
    width: screenWidth,
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  logo: {
    bottom: 180,
    fontWeight: 'bold',
    fontSize: 35,
    color: 'black',
    textAlign: 'center',
  },
  menuBtn: {
    borderRadius: 10,
    width: screenWidth / 2 - 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    height: screenWidth / 2 - 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  menuText: {
    color: 'black',
    fontSize: 20,
  },
});
