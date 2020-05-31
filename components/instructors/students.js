/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import AnimatedLoader from 'react-native-animated-loader';
import Profile from '../instructors/profile';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
export default class studentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      class: this.props.grade,
      students: [],
      student: null,
      studentsClass: [],
      studentChoose: false,
      id: null,
      activeSections: [],
      logout: false,
    };
    this.divideToClass = this.divideToClass.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }
  componentDidMount() {
    fetch('https://sensafe-student.herokuapp.com/admin')
      .then(response => response.json())
      .then(data => {
        this.setState({students: data});
        this.state.students.length ? this.divideToClass() : null;
      })
      .catch(error => console.error(error));
  }

  divideToClass() {
    for (let i = 0; i < this.state.students.length; i++) {
      if (this.state.students[i].grade === this.state.class) {
        this.setState(prevState => ({
          studentsClass: [...prevState.studentsClass, this.state.students[i]],
        }));
      }
    }
  }
  renderHeader(studentsClass) {
    return (
      <View style={styles.header}>
        <View style={styles.overlay} />
        <View
          style={{
            height: 70,
            width: screenWidth - 80,
            justifyContent: 'center',
            borderBottomWidth: 0.3,
            borderColor: 'black',
          }}>
          <Text style={styles.headerText}>{studentsClass.name}</Text>
        </View>
        <View // Circle
          style={{
            left: 15,
            top: 5,
            width: 50,
            height: 50,
            borderRadius: 50 / 2,
            backgroundColor: studentsClass.profileColor,
            opacity: 0.4,
          }}
        />
        <Text style={{fontSize: 30, top: 8, right: 18}}>
          {studentsClass.name.charAt(0)}
        </Text>
      </View>
    );
  }

  renderContent(studentsClass) {
    return (
      <View style={styles.content}>
        <Text style={styles.body}>כיתה - {studentsClass.grade}</Text>
        <Text style={styles.body}>רמת בוחן - {studentsClass.quizLevel}</Text>
        <Text style={styles.body}>
          כמות פעמים שנכשל - {studentsClass.failCount}
        </Text>
      </View>
    );
  }

  _updateSections = activeSections => {
    this.setState({activeSections});
  };

  render() {
    return this.state.studentsClass.length > 0 ? (
      this.state.logout ? (
        <Profile data={this.props.data} />
      ) : (
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.headline}>רשימת תלמידים </Text>
            <TouchableOpacity
              onPress={() => this.setState({logout: true})}
              style={{bottom: 40, right: 150}}>
              <Image
                source={require('../student/images/go-back.png')}
                style={styles.logout}
              />
            </TouchableOpacity>
            <Accordion
              duration={400}
              sections={this.state.studentsClass}
              activeSections={this.state.activeSections}
              touchableComponent={TouchableOpacity}
              expandMultiple={true}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
              onChange={this._updateSections}
            />
          </ScrollView>
        </View>
      )
    ) : (
      <AnimatedLoader
        visible={true}
        overlayColor="003f5c"
        animationStyle={styles.lottie}
        speed={1}
        source={require('../student/images/18535-best-bike-guide-bicycle.json')}
      />
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffebef',
    width: screenWidth,
    height: screenHeight,
  },
  lottie: {width: 100, height: 100},
  headline: {
    color: 'black',
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 30,
    top: 25,
  },
  header: {
    width: screenWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  headerText: {
    color: 'black',
    fontSize: 25,
  },
  body: {
    fontSize: 20,
  },
  bodyContent: {
    alignItems: 'center',
    padding: 30,
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  content: {
    paddingRight: 20,
    width: screenWidth - 10,
    height: 150,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
});
