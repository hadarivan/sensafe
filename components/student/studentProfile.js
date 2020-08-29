import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
import AnimatedLoader from 'react-native-animated-loader';
import EditStudentProfile from './editStudentProfile';
import Menu from './menu';

export default class studentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false, //edit profile state to send the student to the editStudentProfile component
      logout: false, //if the student want to go back
      score: null, //keep the student score to calculate his level
      student: null, //keep the relvant student
      students: [], //keep all the students in array
      rank: null, //represent the student level
    };
  }

  componentDidMount() {
    //get all the students
    fetch('https://sensafe-student.herokuapp.com/admin')
      .then(response => response.json())
      .then(json => {
        this.setState({students: json}, () => this.fetchStudent());
      })
      .catch(error => console.error(error));
  }
  //find the specific student 
  fetchStudent() {
    this.state.students.map(item => {
      if (item.id === this.props.data.id) {
        this.setState({student: item}, () => {
          //calculate the student score according to his achievements and update it in the database
          //(the student gets his points only from achievements)
          var score = 0;
          this.state.student.achievements.map(achiv => {
            if (achiv.isDone) {
              score += achiv.points;
            }
          });
          fetch('https://sensafe-student.herokuapp.com/editScore', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: this.state.student.id,
              score: score,
            }),
          })
        });
        this.checkRank();
      }
    });
  }
  //update the level of the student (if it didnt already changed at is current visit in his profile)
  checkRank() {
    if (this.state.rank === null && !(this.state.score === null)) {
      if (this.state.score >= 0 && this.state.score < 200) {
        this.setState({rank: 'baby'}, () => this.changeRank());
      } else if (this.state.score >= 200 && this.state.score < 400) {
        this.setState({rank: 'young'}, () => this.changeRank());
      } else if (this.state.score >= 400 && this.state.score < 600) {
        this.setState({rank: 'adult'}, () => this.changeRank());
      } else if (this.state.score >= 600 && this.state.score < 800) {
        this.setState({rank: 'knight'}, () => this.changeRank());
      } else {
        this.setState({rank: 'king'}, () => this.changeRank());
      }
    }
  }
  //change the student level in the database if necessary
  changeRank() {
    fetch('https://sensafe-student.herokuapp.com/editLevel', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.student.id,
        level: this.state.rank,
      }),
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return this.state.edit ? (
      <EditStudentProfile data={this.props.data} />
    ) : this.state.logout ? (
      <Menu data={this.props.data} />
    ) : this.state.student === null ? 
    (
      <View style={styles.container}>
        <AnimatedLoader
          visible={true}
          overlayColor="003f5c"
          animationStyle={styles.lottie}
          speed={1}
          source={require('../student/images/18535-best-bike-guide-bicycle.json')}
        />
      </View>
    ) 
    : this.state.score === null ? (
      <View style={styles.container} />
    ) : (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => this.setState({logout: true})}
              style={styles.back}>
              <Image
                source={require('../student/images/go-back.png')}
                style={styles.logout}
              />
            </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                this.setState({edit: true});
              }}>
              <Text style={styles.editProfile}>
                {'  '}
                עריכת פרופיל
              </Text>
              <Image
                style={styles.editImage}
                source={require('../student/images/edit.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <Text style={styles.bodyText}>ניקוד: {this.state.score}</Text>
            <Text style={styles.bodyText}>שלב:</Text>
            <View style={styles.levelList}>
              <Image
                style={
                  this.state.rank === 'baby'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('./images/baby.png')}
              />
              <Image
                style={
                  this.state.rank === 'young'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('./images/young.png')}
              />
              <Image
                style={
                  this.state.rank === 'adult'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('./images/work.png')}
              />
              <Image
                style={
                  this.state.rank === 'knight'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('./images/knight.png')}
              />
              <Image
                style={
                  this.state.rank === 'king'
                    ? styles.iconChoosen
                    : styles.iconDefault
                }
                source={require('./images/king.png')}
              />
            </View>
            <Text style={styles.bodyText}>הישגים:</Text>
            {this.state.student.achievements.map(item => {
              return (
                <View key={item._id} style={styles.bodyAchiv}>
                  <ImageBackground
                    source={require('./images/medal.png')}
                    style={styles.imageAchiv}>
                    <Text style={styles.points}>{item.points}</Text>
                  </ImageBackground>
                  {item.isDone ? (
                    <ImageBackground
                      source={require('./images/check.png')}
                      style={styles.imageAchiv}
                    />
                  ) : null}

                  <Text style={styles.textAchiv}>{item.achievement}</Text>
                </View>
              );
            })}
            <Text style={styles.bodyText}>
              רמת בוחן: {this.state.student.quizLevel}
            </Text>
            <Text style={styles.bodyText}>
              ציון בבוחן:{' '}
              {this.state.student.quizGrade !== null ? (
                this.state.student.quizGrade
              ) : (
                <Text>-</Text>
              )}
            </Text>
            <Text style={styles.bodyText}>
              כמות הפעמים שנכשל בבוחן: {this.state.student.failCount}
            </Text>
            <Text style={styles.bodyText}>טעויות בבוחן:</Text>
            {this.state.student.quizMistakes.map((item, i = 0) => {
              i = i + 1;
              return (
                <View key={item + i} style={styles.bodyAchiv}>
                  <Text style={styles.textAchiv}>{item}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
    backgroundColor: '#b5e2ff',
    paddingBottom: 10,
  },
  lottie: {width: 100, height: 100},
  header: {
    alignSelf: 'center',
    position: 'absolute',
    width: screenWidth,
    height: 250,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: '#769ecb',
  },
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  headerTextName: {
    bottom: 20,
    fontWeight: 'bold',
    fontSize: 35,
    color: 'black',
    textAlign: 'center',
  },
  headerTextClass: {
    bottom: 20,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginBottom: 7,
  },
  textAvatar: {
    fontSize: 60,
    position: 'absolute',
    marginTop: 60,
    alignSelf: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 20,
    alignSelf: 'center',
    opacity: 0.5,
  },
  body: {
    marginTop: 300,
  },
  bodyText: {
    marginTop: 10,
    marginRight: 5,
    textAlign: 'right',
    fontSize: 20,
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
  editButton: {
    shadowColor: 'black',
    elevation: 10, // Android
    flexDirection: 'row',
    bottom: 20,
    alignSelf: 'center',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  back: {
    top: 20, 
    right: 150,
  },
  editProfile: {
    justifyContent: 'center', 
    fontSize: 25,
  },
  editImage: {
    width: 25, 
    height: 25,
  },
  levelList: {
    flexDirection: 'row', 
    justifyContent: 'flex-end',
  },
});
