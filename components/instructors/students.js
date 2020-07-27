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
      checked: null,
      class: this.props.grade,
      students: [],
      name: null,
      student: null,
      studentsClass: [],
      studentChoose: false,
      id: null,
      activeSections: [],
      logout: false,
      empty: false,
    };
    this.divideToClass = this.divideToClass.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.simApprove = this.simApprove.bind(this);
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
        this.setState({empty: false});
        this.setState(prevState => ({
          studentsClass: [...prevState.studentsClass, this.state.students[i]],
        }));
      } else {
        this.state.studentsClass.length === 0
          ? this.setState({empty: true})
          : false;
      }
    }
  }

  simApprove(studentId, approve) {
    fetch('https://sensafe-student.herokuapp.com/editSimApprove', {
      // edit name by id
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: studentId,
        simApprove: approve,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({checked: approve});
        this.setState({name: studentId});
      })
      .catch(error => {
        console.error(error);
      });
    this.forceUpdate();
  }
  renderHeader(studentsClass) {
    return (
      <View style={styles.header}>
        <View style={styles.overlay} />
        <View style={styles.studentName}>
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
        <TouchableOpacity
          style={styles.radioCircle1}
          onPress={() => {
            this.simApprove(studentsClass.id, 'נמוכה');
          }}>
          {this.state.checked === null ? (
            studentsClass.simApprove === 'נמוכה' ? (
              <View style={styles.selectedRb1} />
            ) : null
          ) : null}
          {this.state.checked === 'נמוכה' &&
            this.state.name === studentsClass.id && (
              <View style={styles.selectedRb1} />
            )}
        </TouchableOpacity>
        <Text style={styles.radioText}>רמת מוכנות נמוכה</Text>
        <TouchableOpacity
          style={styles.radioCircle2}
          onPress={() => {
            this.simApprove(studentsClass.id, 'בינונית');
          }}>
          {this.state.checked === null ? (
            studentsClass.simApprove === 'בינונית' ? (
              <View style={styles.selectedRb2} />
            ) : null
          ) : null}
          {this.state.checked === 'בינונית' &&
            this.state.name === studentsClass.id && (
              <View style={styles.selectedRb2} />
            )}
        </TouchableOpacity>
        <Text style={styles.radioText}>רמת מוכנות בינונית</Text>
        <TouchableOpacity
          style={styles.radioCircle3}
          onPress={() => {
            this.simApprove(studentsClass.id, 'גבוהה');
          }}>
          {this.state.checked === null ? (
            studentsClass.simApprove === 'גבוהה' ? (
              <View style={styles.selectedRb3} />
            ) : null
          ) : null}
          {this.state.checked === 'גבוהה' &&
            this.state.name === studentsClass.id && (
              <View style={styles.selectedRb3} />
            )}
        </TouchableOpacity>
        <Text style={styles.radioText}>רמת מוכנות גבוהה</Text>
        <Text style={styles.body}>כיתה - {studentsClass.grade}</Text>
        <Text style={styles.body}>רמת בוחן - {studentsClass.quizLevel}</Text>
        <Text style={styles.body}>
          כמות הנכשלים בבוחן - {studentsClass.failCount}
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
    ) : this.state.empty ? (
      this.state.logout ? (
        <Profile data={this.props.data} />
      ) : (
        <View>
          <TouchableOpacity
            onPress={() => this.setState({logout: true})}
            style={{right: 150, top: 20}}>
            <Image
              source={require('../student/images/go-back.png')}
              style={styles.logout}
            />
          </TouchableOpacity>
          <Text style={{fontSize: 30, top: 200}}>
            {' '}
            אין כרגע תלמידים בכיתה זו
          </Text>
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
  radioText: {
    marginRight: 30,
    bottom: 25,
    fontSize: 20,
  },
  studentName: {
    height: 70,
    width: screenWidth - 80,
    justifyContent: 'center',
    borderBottomWidth: 0.3,
    borderColor: 'black',
  },
  radioCircle1: {
    marginTop: 10,
    height: 30,
    width: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'red',
    alignSelf: 'flex-end',
    left: 10,
  },
  radioCircle2: {
    height: 30,
    width: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'orange',
    alignSelf: 'flex-end',
    left: 10,
  },
  radioCircle3: {
    height: 30,
    width: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'green',
    alignSelf: 'flex-end',
    left: 10,
  },
  selectedRb1: {
    height: 26,
    width: 26,
    borderRadius: 100,
    backgroundColor: 'red',
  },
  selectedRb2: {
    height: 26,
    width: 26,
    borderRadius: 100,
    backgroundColor: 'orange',
  },
  selectedRb3: {
    height: 26,
    width: 26,
    borderRadius: 100,
    backgroundColor: 'green',
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
    height: 300,
    backgroundColor: 'white',
  },
});
