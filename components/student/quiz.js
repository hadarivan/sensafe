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
      level: [],//to get all the questions from the student's level of quiz
      wrongAnswers: [],//put in all the wrong answers the student has to show in the end of the quiz
      isLoaded: false,//to show the loading animation until the quiz uploaded
      back: false,//for when he press back he will return to the menu
      clickedId: null,//to make the answers disabled after the student pick one and to check what question the student answer.
      quizGrade: 0,//to enter his final grade to his database
      countQuestion: 0,//check how many questions the student answer- after 10 questions the student get his grade
      clicked: 0,//to check what answer out of the 4 options the student pick to color the answer in the right color.
      progressBarProgress: 0.0,//to know how much questions the student already answer
    };
    this.changeLoad = this.changeLoad.bind(this);
    this.calculateQuizGrade = this.calculateQuizGrade.bind(this);
    this.changeStudentQuizGrade = this.changeStudentQuizGrade.bind(this);
    this.addWrongAnswer = this.addWrongAnswer.bind(this);
  }

  componentDidMount() {
    //check what the student level is and according to his level save all the question from this level
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
//every question it is calculate the grade and add 10 points on right answer 
//or add the mistake to the student database if he picked the wrong answer
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
//add the final grade to the student database
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
    //if the student passed the quiz with grade of 60 or more he proceed 
    //to the next level and his achievement updated in his profile
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
      //if he get over 60 the fail count resets
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
    }
    
    //if the student get 100 in the quiz it changes the achievement in 
    //the database to accomplish
    else if (this.state.quizGrade === 100) {
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
    else{
      //if the student fail it add 1 to the fail count 
      fetch('https://sensafe-student.herokuapp.com/editFailCount', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.props.data.id,
          failCount: this.props.data.failCount+1,
        }),
      });
    }
  }
  
  //add the wrong answer if the student made mistake the the wrongAnswer array
  addWrongAnswer(question, answers, choosenAnswer) {
    let item = {
      question: question,
      rightAnswer: null,
    };
    choosenAnswer.isRight
      ? null
      : answers.map(answer => {
        /*check what is the right answer from the list of the answers of the 
        question and save it to show it after in the end of the quiz, 
        so the student know the right anwer*/ 
          answer.isRight ? (item.rightAnswer = answer.answer) : null;
          /*check what answer the student answer to enter the question to the 
          wrong answers array */
          answer.answer === choosenAnswer.answer
            ? this.setState({
                wrongAnswers: [...this.state.wrongAnswers, item],
              })
            : null;
        });
  }
  //add 1 to the progress bar every time the student answer question
  changeProgress = () => {
    this.setState({progressBarProgress: this.state.progressBarProgress + 10});
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoaded ? (
          //after 10 question the student get his grade
          this.state.countQuestion !== 10 ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              pagingEnabled={true}>
              {this.state.level.map(question => {
                return (
                  <View key={question._id} style={styles.container}>
                    <View style={styles.window}>
                      <Text style={styles.progressBar}>
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
                        disabled={
                          question._id === this.state.clickedId ? true : false
                        }
                        /*the style of the answer button that the student pick 
                        changes according to the answer- if it is right or wrong*/
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
                      //if the student pick answer, all the answers of this question
                      //became disable so he couldnt chanfe his answer
                        disabled={
                          question._id === this.state.clickedId ? true : false
                        }
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
                        disabled={
                          question._id === this.state.clickedId ? true : false
                        }
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
                        disabled={
                          question._id === this.state.clickedId ? true : false
                        }
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
                    source={require('./images/logout.png')}
                  />
                </TouchableOpacity>
                {this.state.quizGrade === 100 ? (
                  //according to the student grade he get gesture
                  <Image
                    style={styles.finalScore}
                    source={require('./images/gold.png')}
                  />
                ) : this.state.quizGrade >= 80 ? (
                  <Image
                    style={styles.finalScore}
                    source={require('./images/silver.png')}
                  />
                ) : this.state.quizGrade >= 60 ? (
                  <Image
                    style={styles.finalScore}
                    source={require('./images/bronze.png')}
                  />
                ) : (
                  <Image
                    style={styles.finalScore}
                    source={require('./images/smileys.png')}
                  />
                )}
                <Text style={styles.score}>
                  הציון שלך בבוחן הוא: {this.state.quizGrade}
                </Text>
                {this.state.wrongAnswers.map(question => {
                  //The student gets all the questions he was wrong about and their right answer
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
        ) : null}
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
  progressBar: {
    marginTop: 15,
  },
});
