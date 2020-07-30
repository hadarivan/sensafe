/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import StudentProfile from '../student/studentProfile';
import * as Animatable from 'react-native-animatable';
import {Root, Toast} from 'popup-ui';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.data.name,
      id: this.props.data.id,
      grade: this.props.data.grade,
      edit: false,
    };
  }
  edit() {
    fetch('https://sensafe-student.herokuapp.com/admin/editID', {
      // edit name by id
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.data.id,
        name: this.state.name,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({edit: true});
      })
      .catch(error => {
        console.error(error);
      });
    fetch('https://sensafe-student.herokuapp.com/admin/editName', {
      // edit name by id
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.props.data.name,
        id: this.state.id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({edit: true});
      })
      .catch(error => {
        console.error(error);
      });
    fetch('https://sensafe-student.herokuapp.com/editGrade', {
      // edit name by id
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.data.id,
        grade: this.state.grade,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({edit: true});
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <Root>
        <Animatable.View useNativeDriver duration={3000} animation="fadeIn">
          <View style={styles.container}>
            {this.state.edit ? (
              <StudentProfile data={this.state} />
            ) : (
              <ScrollView>
                <View style={{marginBottom: 50}}>
                  <Image
                    style={[
                      styles.avatar,
                      {backgroundColor: this.props.data.profileColor},
                    ]}
                  />
                  <Text style={styles.textAvatar}>
                    {this.props.data.name.slice(0, 1)}
                  </Text>
                  <Text style={styles.info}>עריכת פרופיל</Text>
                  <Text style={styles.name}>כינוי</Text>
                  <TextInput
                    onChangeText={text => this.setState({id: text})}
                    style={styles.input}>
                    {this.props.data.id}
                  </TextInput>
                  <Text style={styles.name}>שם פרטי ומשפחה</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => this.setState({name: text})}>
                    {this.props.data.name}
                  </TextInput>
                  <Text style={styles.name}>כיתה</Text>
                  <TextInput
                    onChangeText={text => this.setState({grade: text})}
                    style={styles.input}>
                    {this.props.data.grade}
                  </TextInput>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => {
                      Toast.show({
                        title: 'הפרופיל עודכן',
                        text:
                          'הפרופיל שלך עודכן, עכשיו תוכל/י לראות את הפרטים החדשים',
                        color: '#f39c12',
                        timing: 2000,
                        icon: (
                          <Image
                            source={require('../student/images/warning.png')}
                            style={{width: 25, height: 25}}
                            resizeMode="contain"
                          />
                        ),
                      });

                      this.edit();
                    }}>
                    <Text style={{justifyContent: 'center', fontSize: 18}}>
                      {'  '}
                      שמור שינויים
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </Animatable.View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#EAEBFF',
  },
  input: {
    borderWidth: 0.2,
    height: 50,
    alignSelf: 'center',
    borderRadius: 50,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    fontSize: 20,
    width: '60%',
    color: 'black',
  },
  textAvatar: {
    fontSize: 60,
    position: 'absolute',
    marginTop: 35,
    alignSelf: 'center',
  },
  name: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    width: '100%',
    color: 'black',
  },
  info: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#769ECB',
    margin: 15,
  },
  classes: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    alignSelf: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    top: 20,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  add: {
    borderWidth: 0.2,
    height: 50,
    alignSelf: 'center',
    borderRadius: 50,
    borderColor: 'rgba(242, 242, 242, 0.5)',
    textAlign: 'center',
    fontSize: 20,
    width: '60%',
    color: 'white',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    margin: 10,
    alignSelf: 'center',
  },
});
