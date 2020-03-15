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
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import Tts from 'react-native-tts';

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class Simulation extends Component {
  constructor() {
    super();
    global.avg = 0;
    this.state = {
      scanning: false,
      peripherals: new Map(),
      appState: '',
      signs: [],
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
    this.calculateDistance = this.calculateDistance.bind(this);
    this.speak = this.speak.bind(this);
  }

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
    if (!this.state.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 30, true).then(results => {
        console.log('Scanning...');
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
      });
    }
  }

  handleDiscoverPeripheral(peripheral) {
    console.log('hello');
    var peripherals = this.state.peripherals;
    if (peripheral.name) {
      console.log(peripheral);
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    if (!peripheral.name) {
      peripheral.name = null;
    }
  }

  calculateDistance(rssi) {
    var measuredPower = -59; //hard coded power value. Usually ranges between -59 to -65

    if (rssi == 0) {
      return -1.0;
    }
    var temp = ((measuredPower - rssi) / 10) * 2;
    var distance = Math.pow(10, temp);
    return distance;
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

  renderItem(item) {
    return (
      <View style={[styles.row]}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 12,
            textAlign: 'center',
            color: '#333333',
            padding: 10,
          }}>
          {item.name}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 10,
            textAlign: 'center',
            color: '#333333',
            padding: 2,
          }}>
          RSSI: {item.rssi}
        </Text>
        <Text
          style={{
            fontSize: 8,
            textAlign: 'center',
            color: '#333333',
            padding: 2,
            paddingBottom: 20,
          }}>
          {item.id}
        </Text>
      </View>
    );
  }
  speak(list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === 'StopSign1') {
        global.avg = (global.avg * 2 + list[i].rssi * 1) / 3;
        console.log(global.avg)
        if (global.avg > -60) {
          Tts.stop();
          Tts.speak('shahar');
        }
      }
    }
  }

  render() {
    const list = Array.from(this.state.peripherals.values());
    const btnScanTitle =
      'Start Simulation (' + (this.state.scanning ? 'on' : 'off') + ')';
    const btnStopScanTitle = 'Stop Simulation';
    if (list.length > 1) {
      // global.avg3 = (global.avg3*2 + list[2].rssi*1) / 3;
      console.log('AVG IS ' + list[0].id + global.avg1);
      console.log('AVG IS ' + list[1].id + global.avg2);
      // console.log('AVG IS ' + list[2].id + global.avg3);
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <View style={{margin: 10}}>
              <Button title={btnScanTitle} onPress={() => this.startScan()} />
            </View>
            <View style={{margin: 10}}>
              <Button
                title={btnStopScanTitle}
                onPress={() => this.stopScan()}
              />
            </View>
            {list.length === 0 && (
              <View>
                <Text>No Devices</Text>
              </View>
            )}
            <FlatList
              data={list}
              renderItem={({item}) =>
                item.name ? this.renderItem(item) : null
              }
              keyExtractor={item => item.id}
            />
            {this.speak(list)}
            <Text>
              AVG is {list[0].name + ' ' + global.avg1 + '\n'}
              AVG is {list[1].name + ' ' + global.avg2 + '\n'}
              {/* AVG is {list[2].id + " " + global.avg3}  */}
            </Text>
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <View style={{margin: 10}}>
              <Button title={btnScanTitle} onPress={() => this.startScan()} />
            </View>
            <View style={{margin: 10}}>
              <Button
                title={btnStopScanTitle}
                onPress={() => this.stopScan()}
              />
            </View>
            {list.length == 0 && (
              <View style={{flex: 1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            )}
            <FlatList
              data={list}
              renderItem={({item}) =>
                item.name ? this.renderItem(item) : null
              }
              keyExtractor={item => item.id}
            />
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: window.width,
    height: window.height,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10,
  },
});
