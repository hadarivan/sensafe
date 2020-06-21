/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ProgressBarAndroid,
  ProgressViewIOS,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import Menu from '../student/menu';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
export default class Question extends React.Component {
  constructor() {
    super();

    this.state = {
      level: [],
      wrongAnswers: [],
      isLoaded: false,
      back: false,
      backgroundColor: 'white',
      clickedId: null,
      quizGrade: 0,
      countQuestion: 0,
      clicked: 0,
      progressBarProgress: 0.0,
    };
    this.changeLoad = this.changeLoad.bind(this);
    this.calculateQuizGrade = this.calculateQuizGrade.bind(this);
    this.changeStudentQuizGrade = this.changeStudentQuizGrade.bind(this);
    this.addWrongAnswer = this.addWrongAnswer.bind(this);
  }

  componentDidMount() {
    if (this.props.data.quizLevel === 1) {
      fetch('https://sensafe-quiz.herokuapp.com/student/level1') // questions level 1
        .then(response => response.json())
        .then(json => {
          this.setState({level: json});
        })
        .catch(error => console.error(error));
    }
    if (this.props.data.quizLevel === 2) {
      fetch('https://sensafe-quiz.herokuapp.com/student/level2') // questions level 2
        .then(response => response.json())
        .then(json => {
          this.setState({level: json});
        })
        .catch(error => console.error(error));
    }
    if (this.props.data.quizLevel === 3) {
      fetch('https://sensafe-quiz.herokuapp.com/student/level3') // questions level 3
        .then(response => response.json())
        .then(json => {
          this.setState({level: json});
        })
        .catch(error => console.error(error));
    }
    this.changeLoad();
  }
  changeLoad() {
    this.setState({isLoaded: true});
  }

  calculateQuizGrade(answerRight, question) {
    answerRight
      ? this.setState(prevState => {
          return {quizGrade: prevState.quizGrade + 10};
        })
      : fetch('https://sensafe-student.herokuapp.com/addQuizMistakes', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.props.data.id,
            quizMistake: question,
          }),
        });
  }

  changeStudentQuizGrade() {
    fetch('https://sensafe-student.herokuapp.com/editQuizGrade', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.data.id,
        quizGrade: this.state.quizGrade,
      }),
    });
    if (this.state.quizGrade >= 60) {
      if (this.props.data.quizLevel === 1) {
        fetch('https://sensafe-student.herokuapp.com/editAchievement', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.props.data.id,
            _id: 1,
            isDone: true,
          }),
        });
      }
      if (this.props.data.quizLevel === 2) {
        fetch('https://sensafe-student.herokuapp.com/editAchievement', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.props.data.id,
            _id: 2,
            isDone: true,
          }),
        });
      }
      if (this.props.data.quizLevel < 3) {
        fetch('https://sensafe-student.herokuapp.com/editQuizLevel', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.props.data.id,
            quizLevel: this.props.data.quizLevel + 1,
          }),
        });
      }
    }
    fetch('https://sensafe-student.herokuapp.com/editFailCount', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.data.id,
        failCount: 0,
      }),
    });

    if (this.state.quizGrade === 100) {
      fetch('https://sensafe-student.herokuapp.com/editAchievement', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.props.data.id,
          _id: 3,
          isDone: true,
        }),
      });
    }
  }

  addWrongAnswer(question, answers, choosenAnswer) {
    let item = {
      question: question,
      rightAnswer: null,
    };
    choosenAnswer.isRight
      ? null
      : answers.map(answer => {
          answer.isRight ? (item.rightAnswer = answer.answer) : null;
          answer.answer === choosenAnswer.answer
            ? this.setState({
                wrongAnswers: [...this.state.wrongAnswers, item],
              })
            : null;
        });
  }

  changeProgress = () => {
    this.setState({progressBarProgress: this.state.progressBarProgress + 10});
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoaded ? (
          this.state.countQuestion !== 10 ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              pagingEnabled={true}>
              {this.state.level.map(question => {
                return (
                  <View key={question._id} style={styles.container}>
                    <View style={styles.window}>
                      <Text style={{marginTop: 15}}>
                        {this.state.countQuestion}/10
                      </Text>
                      {Platform.OS === 'android' ? (
                        <ProgressBarAndroid
                          progress={this.state.progressBarProgress}
                          styleAttr="Horizontal"
                          indeterminate={false}
                          style={styles.progress}
                        />
                      ) : (
                        <ProgressViewIOS
                          progress={this.state.progressBarProgress}
                          style={styles.progress}
                        />
                      )}
                      <Text style={styles.question}>{question.question}</Text>
                      {question.image ? (
                        <Image
                          source={{uri: question.image}}
                          style={styles.image}
                        />
                      ) : null}
                      <TouchableOpacity
                        style={
                          this.state.clicked === 1 &&
                          question._id === this.state.clickedId &&
                          question.answers[0].isRight
                            ? styles.styleForCorrectChoice
                            : this.state.clicked === 1 &&
                              question._id === this.state.clickedId &&
                              !question.answers[0].isRight
                            ? styles.styleForWrongChoice
                            : styles.styleForDefaultChoice
                        }
                        onPress={() => {
                          this.addWrongAnswer(
                            question.question,
                            question.answers,
                            question.answers[0],
                          );
                          this.calculateQuizGrade(
                            question.answers[0].isRight,
                            question.question,
                          );
                          this.setState({
                            countQuestion: this.state.countQuestion + 1,
                            clickedId: question._id,
                            clicked: 1,
                            progressBarProgress:
                              this.state.progressBarProgress + 0.1,
                          });
                        }}>
                        {question.answers[0].answer.includes('http') ? (
                          <Image
                            style={styles.imageAnswer}
                            source={{uri: question.answers[0].answer}}
                          />
                        ) : (
                          <Text style={styles.answer}>
                            {question.answers[0].answer}
                          </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          this.state.clicked === 2 &&
                          question._id === this.state.clickedId &&
                          question.answers[1].isRight
                            ? styles.styleForCorrectChoice
                            : this.state.clicked === 2 &&
                              question._id === this.state.clickedId &&
                              !question.answers[1].isRight
                            ? styles.styleForWrongChoice
                            : styles.styleForDefaultChoice
                        }
                        onPress={() => {
                          this.addWrongAnswer(
                            question.question,
                            question.answers,
                            question.answers[1],
                          );
                          this.calculateQuizGrade(
                            question.answers[1].isRight,
                            question.question,
                          );
                          this.setState({
                            countQuestion: this.state.countQuestion + 1,
                            clickedId: question._id,
                            clicked: 2,
                            progressBarProgress:
                              this.state.progressBarProgress + 0.1,
                          });
                        }}>
                        {question.answers[1].answer.includes('http') ? (
                          <Image
                            style={styles.imageAnswer}
                            source={{uri: question.answers[1].answer}}
                          />
                        ) : (
                          <Text style={styles.answer}>
                            {question.answers[1].answer}
                          </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          this.state.clicked === 3 &&
                          question._id === this.state.clickedId &&
                          question.answers[2].isRight
                            ? styles.styleForCorrectChoice
                            : this.state.clicked === 3 &&
                              question._id === this.state.clickedId &&
                              !question.answers[2].isRight
                            ? styles.styleForWrongChoice
                            : styles.styleForDefaultChoice
                        }
                        onPress={() => {
                          this.addWrongAnswer(
                            question.question,
                            question.answers,
                            question.answers[2],
                          );
                          this.calculateQuizGrade(
                            question.answers[2].isRight,
                            question.question,
                          );
                          this.setState({
                            countQuestion: this.state.countQuestion + 1,
                            clickedId: question._id,
                            clicked: 3,
                            progressBarProgress:
                              this.state.progressBarProgress + 0.1,
                          });
                        }}>
                        {question.answers[2].answer.includes('http') ? (
                          <Image
                            style={styles.imageAnswer}
                            source={{uri: question.answers[2].answer}}
                          />
                        ) : (
                          <Text style={styles.answer}>
                            {question.answers[2].answer}
                          </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          this.state.clicked === 4 &&
                          question._id === this.state.clickedId &&
                          question.answers[3].isRight
                            ? styles.styleForCorrectChoice
                            : this.state.clicked === 4 &&
                              question._id === this.state.clickedId &&
                              !question.answers[3].isRight
                            ? styles.styleForWrongChoice
                            : styles.styleForDefaultChoice
                        }
                        onPress={() => {
                          this.addWrongAnswer(
                            question.question,
                            question.answers,
                            question.answers[3],
                          );
                          this.calculateQuizGrade(
                            question.answers[3].isRight,
                            question.question,
                          );
                          this.setState({
                            countQuestion: this.state.countQuestion + 1,
                            clickedId: question._id,
                            clicked: 4,
                            progressBarProgress:
                              this.state.progressBarProgress + 0.1,
                          });
                        }}>
                        {question.answers[3].answer.includes('http') ? (
                          <Image
                            style={styles.imageAnswer}
                            source={{uri: question.answers[3].answer}}
                          />
                        ) : (
                          <Text style={styles.answer}>
                            {question.answers[3].answer}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : this.state.back ? (
            <Menu data={this.props.data} />
          ) : (
            <View>
              <ScrollView>
                <TouchableOpacity onPress={() => this.setState({back: true})}>
                  <Image
                    style={styles.back}
                    source={require('../images/logout.png')}
                  />
                </TouchableOpacity>
                {this.state.quizGrade === 100 ? (
                  <Image
                    style={styles.finalScore}
                    source={require('../images/gold.png')}
                  />
                ) : this.state.quizGrade >= 80 ? (
                  <Image
                    style={styles.finalScore}
                    source={require('../images/silver.png')}
                  />
                ) : this.state.quizGrade >= 60 ? (
                  <Image
                    style={styles.finalScore}
                    source={require('../images/bronze.png')}
                  />
                ) : (
                  <Image
                    style={styles.finalScore}
                    source={require('../images/smileys.png')}
                  />
                )}
                <Text style={styles.score}>
                  הציון שלך בבוחן הוא: {this.state.quizGrade}
                </Text>
                {this.state.wrongAnswers.map(question => {
                  return (
                    <View style={styles.viewRight}>
                      <Text style={styles.rightAnswers}>
                        שאלה:"{question.question}"
                      </Text>
                      <Text style={styles.rightAnswers}>
                        תשובה נכונה:"{question.rightAnswer}"
                      </Text>
                    </View>
                  );
                })}
                {this.changeStudentQuizGrade()}
              </ScrollView>
            </View>
          )
        ) : (
          <View style={styles.container}>
            <AnimatedLoader
              visible={true}
              overlayColor="003f5c"
              animationStyle={styles.lottie}
              speed={1}
              source={require('../images/18535-best-bike-guide-bicycle.json')}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0bbe4',
  },
  window: {
    marginLeft: 5,
    backgroundColor: 'white',
    width: 380,
    minHeight: 400,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.5,
    elevation: 2,
  },
  image: {
    height: 200,
    width: 200,
    margin: 20,
    justifyContent: 'center',
  },
  questions: {
    width: '60%',
    textAlign: 'center',
    marginBottom: 30,
  },
  styleForCorrectChoice: {
    width: 340,
    minHeight: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center',
  },
  styleForWrongChoice: {
    width: 340,
    minHeight: 50,
    backgroundColor: 'red',
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleForDefaultChoice: {
    width: 340,
    minHeight: 50,
    backgroundColor: '#957dad',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center',
  },
  question: {
    fontSize: 30,
    width: 350,
    textAlign: 'center',
    marginBottom: 30,
  },
  answer: {
    alignSelf: 'center',
    width: 340,
    textAlign: 'center',
    color: 'white',
  },
  imageAnswer: {
    height: 100,
    width: 100,
  },
  progress: {
    marginTop: 5,
    marginBottom: 15,
    width: 200,
  },
  finalScore: {
    height: 350,
    width: 350,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 30,
    marginTop: 15,
    textAlign: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
  back: {
    width: 30,
    height: 30,
    marginTop: 30,
    marginLeft: 15,
  },
  rightAnswers: {
    textAlign: 'right',
    fontSize: 20,
  },
  viewRight: {
    marginTop: 20,
  },
});
