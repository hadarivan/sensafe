/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  AppState,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import Sound from 'react-native-sound';
import Menu from '../student/menu';
const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class Simulation extends Component {
  constructor() {
    super();
    (global.avg = []).length = 8;
    global.avg.fill(0);
    this.state = {
      scanning: false,
      peripherals: new Map(),
      appState: '',
      student: null,
      logout: false,
    };

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.stopScan = this.stopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(
      this,
    );
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(
      this,
    );
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.speak = this.speak.bind(this);
  }
  stopSign = new Sound('stop.mp3');
  giveWay = new Sound('giveway.mp3');
  playSound = () => {
    this.stopSign.play();
  };
  playSound1 = () => {
    this.giveWay.play();
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    BleManager.start({showAlert: false});

    this.handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      this.handleDiscoverPeripheral,
    );
    this.handlerStop = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      this.handleStopScan,
    );
    this.handlerDisconnect = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      this.handleDisconnectedPeripheral,
    );
    this.handlerUpdate = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      this.handleUpdateValueForCharacteristic,
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.requestPermission(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            // eslint-disable-next-line no-shadow
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }
  }

  handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({scanning: false});
  }

  startScan() {
    console.log(this.props.data.simCount)
    fetch('https://sensafe-student.herokuapp.com/editAchievement', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.data.id,
        _id: 4,
        isDone: true,
      }),
    });
    fetch('https://sensafe-student.herokuapp.com/editSimCount', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.data.id,
        simCount: this.props.data.simCount + 1,
        isDone: true,
      }),
    });
    if (!this.state.scanning) {
      console.log('scan');
      BleManager.scan([], 60, true).then(() => {
        // Success code
        console.log('Scan started');
        this.setState({scanning: true});
      });
    }
  }
  stopScan() {
    if (this.state.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.stopScan().then(results => {
        console.log('Stop Scanning...');
        this.setState({scanning: false});
        this.setState({logout: true});
      });
    }
  }

  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
    if (peripheral.name) {
      if (
        peripheral.name.includes('stopSign') ||
        peripheral.name.includes('giveWay')
      ) {
        console.log(peripheral);
        peripherals.set(peripheral.id, peripheral);
        this.setState({peripherals});
      }
    }
    if (!peripheral.name) {
      peripheral.name = null;
    }
  }

  test(peripheral) {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id)
          .then(() => {
            let peripherals = this.state.peripherals;
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              this.setState({peripherals});
            }
            console.log('Connected to ' + peripheral.id);
          })
          .catch(error => {
            console.log('Connection error', error);
          });
      }
    }
  }
  speak(list) {
    console.log(list);
    var flag = false;
    var name;
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        global.avg[i] = (global.avg[i] + list[i].rssi) / 2;
      }
      for (var index = 0; index < list.length; index++) {
        console.log('name' + list[index].name + 'avg' + global.avg[index]);

        if (
          (list[index].name.includes('1') || list[index].name.includes('2')) &&
          global.avg[index] > -70
        ) {
          flag = true;
          name = list[index].name;
        }
        if (
          flag &&
          ((list[index].name.includes('3') || list[index].name.includes('4')) &&
            global.avg[index] < -80)
        ) {
          if (
            list[index].name.includes('stopSign') &&
            name.includes('stopSign')
          ) {
            this.playSound();
            flag = false;
          }
          if (
            list[index].name.includes('giveWay') &&
            name.includes('giveWay')
          ) {
            this.playSound1();
            flag = false;
          }
        }
      }
    }
  }

  render() {
    const list = Array.from(this.state.peripherals.values());
    list.sort((a, b) => (a.name > b.name ? 1 : -1));
    if (list.length != null) {
      return (
        <SafeAreaView style={styles.container}>
          {this.state.logout ? (
            <Menu data={this.props.data} />
          ) : (
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => this.setState({logout: true})}
                style={{top: 20, right: 140}}>
                <Image
                  source={require('../student/images/go-back1.png')}
                  style={styles.logout}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startScan}
                onPress={() => this.startScan()}>
                <Text style={styles.loginText}>התחל סימולציה</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stopScan}
                onPress={() => this.stopScan()}>
                <Text style={styles.loginText}>הפסק סימולציה</Text>
              </TouchableOpacity>
              {this.speak(list)}
            </View>
          )}
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: window.width,
    height: window.height,
  },
  logout: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10,
  },
  startScan: {
    width: 200,
    backgroundColor: 'green',
    borderRadius: 200,
    height: 100,
    top: 150,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 70,
  },
  stopScan: {
    top: 200,
    width: 200,
    backgroundColor: 'red',
    borderRadius: 200,
    height: 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginText: {
    alignSelf: 'center',
    fontSize: 25,
    color: 'white',
  },
});
