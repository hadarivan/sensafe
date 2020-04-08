/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Login from '../instructor/login';
import Profile from '../instructor/profile';
import {Avatar} from 'react-native-elements';
export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
      screen: 0, // 0 - menu , 1 - students group , 2 - students data , 3 - profile
    };
  }

  render() {
    return (
      <View>
        {this.state.logout ? (
          <Login />
        ) : this.state.screen === 3 ? (
          <Profile data={this.props.data} />
        ) : (
          <View>
            <View>
              <Text
                style={{
                  top: 30,
                  color: 'white',
                  fontSize: 20,
                  marginRight: 80,
                }}>
                שלום {this.props.data.name}
              </Text>
              <TouchableOpacity
                style={{marginLeft: 270, bottom: 15}}
                onPress={() => this.setState({screen: 3})}>
                <Avatar
                  size={70}
                  rounded
                  source={require('../student/images/teacher.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <Text style={styles.logo}>sensafe</Text>
              <TouchableOpacity style={styles.loginBtn} onPress={this.onPress}>
                <Text style={styles.loginText}>רשימת קבוצות</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginBtn} onPress={this.onPress}>
                <Text style={styles.loginText}>נתוני תלמידים</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                  this.setState({logout: true});
                }}>
                <Text style={styles.loginText}>התנתק</Text>
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
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 35,
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
