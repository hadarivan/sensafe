import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView,
} from 'react-native';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
export default class studentProfile extends Component {
  constructor() {
    super();
    this.state = {
      student: null,
      id: null,
      name: null,
      grade: null,
      level: null,
      score: null,
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
        id: '267647364',
      }),
    })
      .then(response => response.json())
      .then(data => {
        this.setState({student: data[0]});
      })
      .catch(error => console.error(error));
  }

  render() {
    return this.state.student ? (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              style={[
                styles.avatar,
                {backgroundColor: this.state.student.profileColor},
              ]}
            />
            <Text style={styles.textAvatar}>
              {this.state.student.name.slice(0, 1)}
            </Text>
            <Text style={styles.headerTextName}>{this.state.student.name}</Text>
            <Text style={styles.headerTextClass}>
              {this.state.student.grade}
            </Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              ניקוד: {this.state.student.score}
            </Text>
            <Text style={styles.bodyText}>שלב:</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Image
                style={
                  this.state.student.level === 'baby'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('../images/baby.png')}
              />
              <Image
                style={
                  this.state.student.level === 'young'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('../images/young.png')}
              />
              <Image
                style={
                  this.state.student.level === 'adult'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('../images/work.png')}
              />
              <Image
                style={
                  this.state.student.level === 'knight'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('../images/knight.png')}
              />
              <Image
                style={
                  this.state.student.level === 'king'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('../images/king.png')}
              />
            </View>
            <Text style={styles.bodyText}>הישגים:</Text>
            {this.state.student.achievements.map(item => {
              return (
                <View key={item._id} style={styles.bodyAchiv}>
                  <ImageBackground
                    source={require('../images/medal.png')}
                    style={styles.imageAchiv}>
                    <Text style={styles.points}>{item.points}</Text>
                  </ImageBackground>
                  <Text style={styles.textAchiv}>{item.achievement}</Text>
                </View>
              );
            })}
            <Text style={styles.bodyText}>בוחן:</Text>
            <Text style={styles.bodyText}>
              רמת בוחן: {this.state.student.quizLevel} {'\n'} ציון בבוחן:{' '}
              {this.state.student.quizGrade ? (
                this.state.student.quizGrade
              ) : (
                <Text>-</Text>
              )}{' '}
              {'\n'} כמות הפעמים שנכשל בבוחן: {this.state.student.failCount}
              {'\n'} טעויות בבוחן:{' '}
              {this.state.student.quizMistakes.map(item => {
                return (
                  <View key={item._id}>
                    <Text style={styles.bodyAchiv}>{item.achievement}</Text>
                  </View>
                );
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
    ) : null; //loading
  }
}
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: screenWidth,
    backgroundColor: '#b5e2ff',
  },
  header: {
    alignSelf: 'center',
    position: 'absolute',
    width: screenWidth,
    height: 250,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: '#769ecb',
  },
  headerTextName: {
    textAlign: 'center',
    marginBottom: 7,
    fontSize: 25,
    color: 'white',
  },
  headerTextClass: {
    fontSize: 15,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 7,
  },
  textAvatar: {
    fontSize: 60,
    position: 'absolute',
    marginTop: 55,
    alignSelf: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 20,
    alignSelf: 'center',
    opacity: 0.5,
    marginTop: 20,
  },
  body: {
    marginTop: 300,
  },
  bodyText: {
    marginTop: 10,
    marginRight: 5,
    textAlign: 'right',
  },
  imageAchiv: {
    marginTop: 3,
    height: 45,
    width: 45,
  },
  textAchiv: {
    textAlign: 'right',
    marginLeft: 'auto',
    marginRight: 10,
    marginTop: 15,
  },
  bodyAchiv: {
    flexDirection: 'row',
    width: screenWidth,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    marginTop: 5,
  },
  iconDefault: {
    width: 30,
    height: 30,
    marginRight: 15,
    opacity: 0.5,
  },
  iconChoosen: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  points: {
    marginLeft: 12,
    marginTop: 10,
    fontSize: 12,
  },
});
