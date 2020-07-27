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
  KeyboardAvoidingView,
} from 'react-native';
import Profile from '../instructors/profile';
import * as Animatable from 'react-native-animatable';
import {Root, Popup, Toast} from 'popup-ui';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
import ImagePicker from 'react-native-image-picker';

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.data.name,
      id: this.props.data.id,
      grade: this.props.data.className,
      className: null,
      edit: false,
      delete: false,
      add: false,
      photo: this.props.data.image,
    };
  }
  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, image => {
      if (image.uri) {
        this.setState({photo: image.uri});
        fetch('https://sensafe-instructor.herokuapp.com/instructor/editImage', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.props.data.id,
            image: image.uri,
          }),
        })
          .then(response => response.json())
          .catch(error => {
            console.error(error);
          });
      }
    });
  };
  delete(className) {
    fetch(
      'https://sensafe-instructor.herokuapp.com/instructor/deleteClassName',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.props.data.id,
          className: className,
        }),
      },
    )
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
  }
  edit() {
    if (this.state.className === null) {
      fetch('https://sensafe-instructor.herokuapp.com/instructor/editAll', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.props.data.id,
          changeId: this.state.id,
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
    } else {
      fetch(
        'https://sensafe-instructor.herokuapp.com/instructor/addClassName',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.props.data.id,
            className: this.state.className,
          }),
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({edit: true});
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  render() {
    return (
      <Root>
        <Animatable.View useNativeDriver duration={3000} animation="fadeIn">
          <View style={styles.container}>
            {this.state.edit ? (
              <Profile data={this.state} />
            ) : (
              <ScrollView>
                <View style={{paddingBottom: 50}}>
                  <Text style={styles.info}>עריכת פרופיל</Text>
                  <Image
                    source={{uri: this.state.photo}}
                    style={styles.avatar}
                  />
                  <TouchableOpacity onPress={this.handleChoosePhoto}>
                    <Text style={styles.info}>עדכון תמונת פרופיל</Text>
                  </TouchableOpacity>
                  <Text style={styles.name}>תעודת זהות</Text>
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
                  <Text style={styles.info}>כיתות לימוד</Text>
                  <KeyboardAvoidingView behavior={'height'}>
                    {this.props.data.className.map(className => {
                      return (
                        <View key={className} style={styles.contain}>
                          <Text style={styles.classes}>{className}</Text>
                          <TouchableOpacity
                            style={styles.delete}
                            onPress={() => {
                              Popup.show({
                                type: 'Danger',
                                title: 'מחיקת כיתת ' + className,
                                textBody:
                                  'כיתה זו נמחקה.\n' +
                                  'בלחיצה על שמור הנתונים יעודכנו.',
                                buttontext: 'Ok',
                                callback: () => {
                                  Popup.hide();
                                  this.delete(className);
                                },
                              });
                            }}>
                            <Image
                              source={require('../student/images/delete.png')}
                              style={{width: 20, height: 20}}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                    {this.state.add ? (
                      <View>
                        <TextInput
                          placeholder="הכנס שם כיתה"
                          placeholderTextColor="black"
                          onChangeText={text => {
                            this.setState({className: text});
                          }}
                          style={styles.input}
                        />
                      </View>
                    ) : (
                      <View>
                        <TouchableOpacity
                          style={styles.buttonContainer}
                          onPress={() => {
                            this.setState({add: true});
                          }}>
                          <Text
                            style={{justifyContent: 'center', fontSize: 18}}>
                            {'  '}
                            הוספת כיתה
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </KeyboardAvoidingView>

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
  contain: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
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
    marginBottom: 10,
    alignSelf: 'center',
  },
  delete: {
    alignSelf: 'center',
    marginLeft: 5,
    marginTop: 10,
  },
});
