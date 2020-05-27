import React, { Component } from 'react';
import AnimatedLoader from 'react-native-animated-loader';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';


export default class App extends Component {

  constructor() {
    super();
    this.state = {
      allTrafficLaws: null,
      loading: true,
      gridView: true,
      HeaderText: 'חוקי תנועה',
      subjectsList: null,
      allTrafficLawsFiltered: false,
      back: false
    }
  }

  componentDidMount() {
    fetch('https://sensafe-server.herokuapp.com/traffic_law')
      .then((response) => response.json())
      .then((responseJson) => {

        // this extract unique subjects
        let subjectsArray = [...responseJson]
        // console.log(subjectsArray)
        let uniqueSubjectsArray = subjectsArray.filter(function (elem, index, self) {
          return index === self.findIndex(elm => elm.subject == elem.subject);
        })

        this.setState({ subjectsList: [...uniqueSubjectsArray], allTrafficLaws: [...responseJson], loading: false });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handleSubjectClick = (subject) => {
    if (typeof subject != 'undefined') {
      let allTrafficLawsFiltered = []
      this.state.allTrafficLaws.forEach(element => {
        if (element.subject == subject) {
          allTrafficLawsFiltered.push(element)
        }
      })
      this.setState({
        allTrafficLawsFiltered: [...allTrafficLawsFiltered]
      })
    }
  }

  render() {
    return (
      <View style={styles.container} >
        {
          (this.state.loading)
            ?
            (<View style={styles.loadingContainer}>
              <AnimatedLoader
                visible={true}
                overlayColor="003f5c"
                animationStyle={styles.lottie}
                speed={1}
                source={require('../student/images/18535-best-bike-guide-bicycle.json')}
              />
            </View>)
            :
            (<View style={{ flex: 1 }}>
              <View style={styles.Header}>
                <Text style={styles.HeaderText}>{this.state.HeaderText}</Text>
              </View>
              <View style={styles.lawsHolder}>
                {this.state.allTrafficLawsFiltered ?
                  <FlatList keyExtractor={(item) => item.law}
                    key={(this.state.gridView) ? 1 : 0}
                    data={this.state.allTrafficLawsFiltered}
                    renderItem={({ item }) =>
                      <View style={styles.lawTextHolder}>
                        <Text style={styles.lawText}>{item.law} </Text>
                      </View>
                } />
                  :
                  <FlatList keyExtractor={(item) => item.subject}
                    numColumns={(this.state.gridView) ? 2 : 1}
                    data={this.state.subjectsList}
                    renderItem={({ item }) =>
                      <TouchableOpacity
                        onPress={this.handleSubjectClick.bind(this, item.subject)}>
                        <View style={styles.SubjectTextHolder}>
                          <Text style={styles.SubjectText}>{item.subject} </Text>
                        </View>
                      </TouchableOpacity>
                    } 
                  />
                }
              </View>
            </View>)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: '#d3edea'
    },
    lawsHolder: {
      margin: 5,
      height: 30,
      flex: 1,
      position: 'relative'

    },
    lawTextHolder: {
      position: 'relative',
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255,1)',
      paddingHorizontal: 10,
      paddingVertical: 13,
      marginBottom: 5,
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.10,
      shadowRadius: 2.5,

      elevation: 2,
    },
    SubjectTextHolder: {
      position: 'relative',
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255,1)',
      marginHorizontal: 3,
      height:165,
      width:170,
      paddingVertical: 13,
      marginBottom: 5,
      borderRadius: 5,
      backgroundColor: '#93d1bc',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.10,
      shadowRadius: 2.5,

      elevation: 2,
    },

    lawText: {
      color: 'black'
    },
    SubjectText: {
      color: 'white',
      fontWeight:"bold",
      textAlign:"center",
      marginTop:62
    },
    lottie: {
      width: 100,
      height: 100
    },
    Header: {
      padding: 15,
      backgroundColor: '#93d1bc'
    },
    HeaderText: {
      color: 'white',
      textAlign: 'center',
      alignSelf: 'stretch'
    },
    back: {
      width: 30,
      height: 30,
      position: 'absolute',
      bottom: 100,
    }
  });