/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Login from '../student/login';
import Quiz from '../student/quiz';
import Simulation from '../student/Simulation';
export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
      screen: 0, // 0 - menu , 1-traffic signs , 2 - traffic laws , 3 - quiz , 4 - simulation
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.screen === 0 ? (
          this.state.logout ? (
            <Login />
          ) : (
            <View>
              <Text style={styles.logo}>sensafe</Text>
              <Text style={styles.logo}>שלום {this.props.data.name}</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => {
                    this.setState({screen: 1});
                  }}>
                  <Text style={styles.loginText}>תמרורים</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => {
                    this.setState({screen: 2});
                  }}>
                  <Text style={styles.loginText}>חוקים</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => {
                    this.setState({screen: 3});
                  }}>
                  <Text style={styles.loginText}>בוחן</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => {
                    this.setState({screen: 4});
                  }}>
                  <Text style={styles.loginText}>סימולציה</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: 200}}
                  onPress={() => {
                    this.setState({logout: true});
                  }}>
                  <Text style={styles.loginText}>התנתק</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        ) : this.state.screen === 1 ? null : this.state.screen ===
          2 ? null : this.state.screen === 3 ? (
          <Quiz data={this.props.data} />
        ) : (
          <Simulation />
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
  loginBtn: {
    width: 150,
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 10,
  },
  loginText: {
    color: 'white',
  },
});
