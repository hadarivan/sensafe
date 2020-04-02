/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

import Swiper from 'react-native-swiper';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
export default class Question extends React.Component {
  constructor() {
    super();

    this.state = {
      level1: [],
      level2: [],
      level3: [],
      isLoaded: false,
      backgroundColor: 'white',
      clickedId: null,
    };
    this.changeLoad = this.changeLoad.bind(this);
    this.changeColor = this.changeColor.bind(this);
  }

  componentDidMount() {
    fetch('https://sensafe-quiz.herokuapp.com/student/level1') // questions level 1
      .then(response => response.json())
      .then(json => {
        this.setState({level1: json});
      })
      .catch(error => console.error(error));

    fetch('https://sensafe-quiz.herokuapp.com/student/level2') // questions level 2
      .then(response => response.json())
      .then(json => {
        this.setState({level2: json});
      })
      .catch(error => console.error(error));

    fetch('https://sensafe-quiz.herokuapp.com/student/level3') // questions level 3
      .then(response => response.json())
      .then(json => {
        this.setState({level3: json});
      })
      .catch(error => console.error(error));
    this.changeLoad();
  }
  changeLoad() {
    this.setState({isLoaded: true});
  }

  changeColor(isCorrect, clickedId) {
    console.log(clickedId);
    isCorrect
      ? (this.setState({backgroundColor: 'green'}),
        this.setState({clickedId: clickedId}))
      : (this.setState({backgroundColor: 'red'}),
        this.setState({clickedId: clickedId}));
    console.log(this.state.clickedId);
  }

  render() {
    //   check what level the student is and show - for now we put level 1.
    var questions = this.state.level1;
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.state.isLoaded ? (
            <ScrollView horizontal={true} pagingEnabled={true}>
              {questions.map(question => {
                return (
                  <View key={question._id} style={styles.container}>
                    <Text style={styles.question}>{question.question}</Text>
                    {question.image ? (
                      <Image
                        source={{uri: question.image}}
                        style={styles.image}
                      />
                    ) : null}
                    <TouchableOpacity
                      style={styles.choice}
                      onPress={() => {
                        question.answers[0].isRight
                          ? (alert('correct'),
                            this.setState({isCorrect0: true}))
                          : this.setState({isCorrect0: false});
                      }}>
                      <Text style={styles.answer}>
                        {question.answers[0].answer}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.choice}
                      onPress={() => {
                        question.answers[1].isRight
                          ? (alert('correct'),
                            this.setState({isCorrect1: true}))
                          : this.setState({isCorrect1: false});
                      }}>
                      <Text style={styles.answer}>
                        {question.answers[1].answer}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.choice}
                      onPress={() => {
                        question.answers[2].isRight
                          ? (alert('correct'),
                            this.setState({isCorrect2: true}))
                          : this.setState({isCorrect2: false});
                      }}>
                      <Text style={styles.answer}>
                        {question.answers[2].answer}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.choice}
                      onPress={() => {
                        question.answers[3].isRight
                          ? (alert('correct'),
                            this.setState({isCorrect3: true}))
                          : this.setState({isCorrect3: false});
                      }}>
                      <Text style={styles.answer}>
                        {question.answers[3].answer}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  image: {
    height: 250,
    width: 250,
    margin: 20,
    justifyContent: 'center',
  },
  questions: {
    width: '60%',
    textAlign: 'center',
    marginBottom: 30,
  },
  choice: {
    width: 300,
    minHeight: 50,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  question: {
    fontSize: 30,
    textAlign: 'center',
  },
  answer: {
    textAlign: 'center',
  },
});

