import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Students from '../instructor/students';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grade: null,
    };
  }

  render() {
    return this.state.grade === null ? (
      <View style={styles.container}>
        <View style={styles.header} />
        <Image
          style={styles.avatar}
          source={require('../student/images/teacher.png')}
        />
        <ScrollView>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{this.props.data.name}</Text>
              <Text style={styles.info}>כיתות לימוד</Text>
              {this.props.data.className.map(className => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({grade: className});
                    }}>
                    <Text style={styles.description}>{className}</Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.buttonContainer}>
                <Text>הוספת קבוצה</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text>נתוני תלמידים</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    ) : (
      <Students data={this.state.grade} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 400,
    flex: 1,
  },
  header: {
    backgroundColor: '#00BFFF',
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: 'white',
    fontWeight: '600',
  },
  info: {
    fontSize: 22,
    color: '#00BFFF',
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
});
