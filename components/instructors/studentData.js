/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Pie from 'react-native-pie';
import AnimatedLoader from 'react-native-animated-loader';
import * as Animatable from 'react-native-animatable';
import Profile from '../instructors/profile';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
export default class StudentData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      mistakes: [],
      count: 0,
      avgScore: 0,
      level: 0,
      logout: false,
      fail: [
        {
          name: 'עוברים בפעם הראשונה',
          amount: 0,
        },
        {
          name: 'נכשלים בפעם הראשונה',
          amount: 0,
        },
        {
          name: 'נכשלים בפעם השנייה',
          amount: 0,
        },
        {
          name: 'נכשלים בפעם השלישית',
          amount: 0,
        },
      ],
    };
    this.mostCommonMistake = this.mostCommonMistake.bind(this);
    this.avgScore = this.avgScore.bind(this);
    this.mapStudent = this.mapStudent.bind(this);
  }
  componentDidMount() {
    fetch('https://sensafe-student.herokuapp.com/admin')
      .then(response => response.json())
      .then(json => {
        this.setState({students: json});
        this.mapStudent();
      })
      .catch(error => console.error(error));
  }
  mapStudent() {
    this.state.students.map(student => {
      this.mostCommonMistake(student);
      this.avgScore(student);
      this.avgLevel(student);
      this.failCount(student);
    });
  }
  failCount(student) {
    if (student.failCount === 0) {
      this.setState(prevState => ({
        fail: prevState.fail.map(obj =>
          obj.name === 'עוברים בפעם הראשונה'
            ? Object.assign(obj, {amount: obj.amount + 1})
            : obj,
        ),
      }));
    }
    if (student.failCount === 1) {
      this.setState(prevState => ({
        fail: prevState.fail.map(obj =>
          obj.name === 'נכשלים בפעם הראשונה'
            ? Object.assign(obj, {amount: obj.amount + 1})
            : obj,
        ),
      }));
    }
    if (student.failCount === 2) {
      this.setState(prevState => ({
        fail: prevState.fail.map(obj =>
          obj.name === 'נכשלים בפעם השנייה'
            ? Object.assign(obj, {amount: obj.amount + 1})
            : obj,
        ),
      }));
    }
    if (student.failCount === 3) {
      this.setState(prevState => ({
        fail: prevState.fail.map(obj =>
          obj.name === 'נכשלים בפעם השלישית'
            ? Object.assign(obj, {amount: obj.amount + 1})
            : obj,
        ),
      }));
    }
  }
  avgScore(student) {
    if (student.quizGrade === null) {
      this.setState({count: this.state.count + 1});
    } else {
      this.setState({
        avgScore: parseInt(student.quizGrade) + this.state.avgScore,
      });
    }
  }
  avgLevel(student) {
    this.setState({
      level: parseInt(student.quizLevel) + this.state.level,
    });
  }
  mostCommonMistake(student) {
    if (student.quizMistakes.length > 0) {
      student.quizMistakes.map(mistake => {
        this.setState({mistakes: [...this.state.mistakes, mistake]});
        this.setState({
          mistakes: this.state.mistakes.sort(
            (a, b) =>
              this.state.mistakes.filter(v => v === a).length -
              this.state.mistakes.filter(v => v === b).length,
          ),
        });
      });
    }
  }
  render() {
    return (
      <Animatable.View useNativeDriver duration={3000} animation="fadeIn">
        <View style={styles.container}>
          {this.state.logout ? (
            <Profile data={this.props.data} />
          ) : this.state.students.length > 0 ? (
            <View>
              <ScrollView>
                <Text style={styles.info}>נתוני תלמידים כללים:</Text>
                <TouchableOpacity
                  onPress={() => this.setState({logout: true})}
                  style={{bottom: 55, right: 150}}>
                  <Image
                    source={require('../student/images/go-back.png')}
                    style={styles.logout}
                  />
                </TouchableOpacity>
                <View style={styles.generalData}>
                  <Text style={styles.data}>
                    הטעות הנפוצה ביותר בבוחן: {'\n'}
                    {this.state.mistakes[this.state.mistakes.length - 1]}
                  </Text>
                  <Text style={styles.data}>
                    הציון הממוצע בבוחן:{'\n'}
                    {parseInt(
                      this.state.avgScore /
                        (this.state.students.length - this.state.count),
                    )}
                  </Text>
                  <Text style={styles.data}>
                    הרמה הממוצעת בבוחן:{'\n'}
                    {parseInt(this.state.level / this.state.students.length)}
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.pies}>
                    <View style={styles.pie}>
                      <Text style={styles.pieData}>
                        עוברים בבוחן בפעם הראשונה:{'\n'}
                      </Text>
                      <Pie
                        radius={40}
                        innerRadius={25}
                        sections={[
                          {
                            percentage:
                              (this.state.fail[0].amount /
                                this.state.students.length) *
                              100,
                            color: '#f00',
                          },
                        ]}
                        backgroundColor="#ddd"
                      />
                      <View style={styles.gauge}>
                        <Text style={styles.gaugeText}>
                          {parseInt(
                            (this.state.fail[0].amount /
                              this.state.students.length) *
                              100,
                          )}
                          %
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pie}>
                      <Text style={styles.pieData}>
                        נכשלים בבוחן בפעם הראשונה:{'\n'}
                      </Text>
                      <Pie
                        radius={40}
                        innerRadius={25}
                        sections={[
                          {
                            percentage:
                              (this.state.fail[1].amount /
                                this.state.students.length) *
                              100,
                            color: '#f00',
                          },
                        ]}
                        backgroundColor="#ddd"
                      />
                      <View style={styles.gauge}>
                        <Text style={styles.gaugeText}>
                          {parseInt(
                            (this.state.fail[1].amount /
                              this.state.students.length) *
                              100,
                          )}
                          %
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pie}>
                      <Text style={styles.pieData}>
                        נכשלים בבוחן בפעם השנייה:{'\n'}
                      </Text>
                      <Pie
                        radius={40}
                        innerRadius={25}
                        sections={[
                          {
                            percentage:
                              (this.state.fail[2].amount /
                                this.state.students.length) *
                              100,
                            color: '#f00',
                          },
                        ]}
                        backgroundColor="#ddd"
                      />
                      <View style={styles.gauge}>
                        <Text style={styles.gaugeText}>
                          {parseInt(
                            (this.state.fail[2].amount /
                              this.state.students.length) *
                              100,
                          )}
                          %
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pie}>
                      <Text style={styles.pieData}>
                        נכשלים בבוחן בפעם השלישית:{'\n'}
                      </Text>
                      <Pie
                        radius={40}
                        innerRadius={25}
                        sections={[
                          {
                            percentage:
                              (this.state.fail[3].amount /
                                this.state.students.length) *
                              100,
                            color: '#f00',
                          },
                        ]}
                        backgroundColor="#ddd"
                      />
                      <View style={styles.gauge}>
                        <Text style={styles.gaugeText}>
                          {parseInt(
                            (this.state.fail[3].amount /
                              this.state.students.length) *
                              100,
                          )}
                          %
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.container}>
              <AnimatedLoader
                visible={true}
                overlayColor="003f5c"
                animationStyle={styles.lottie}
                speed={1}
                source={require('../student/images/18535-best-bike-guide-bicycle.json')}
              />
            </View>
          )}
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#D4CDFF',
  },
  info: {
    fontSize: 30,
    color: 'black',
    margin: 20,
    alignSelf: 'center',
  },
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  data: {
    fontSize: 20,
    color: 'black',
    margin: 10,
    textAlign: 'right',
  },
  pieData: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  pies: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  generalData: {
    alignSelf: 'center',
    width: screenWidth - 20,
    height: '50%',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 20,
    margin: 20,
  },
  pie: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 170,
    height: 250,
    backgroundColor: 'white',
    color: 'black',
    marginLeft: 12,
  },
  gauge: {
    position: 'absolute',
    top: 80,
    width: 100,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {width: 100, height: 100},
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 20,
  },
});
