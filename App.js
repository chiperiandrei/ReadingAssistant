import React from 'react';
import {Alert, Button, SafeAreaView, StatusBar, StyleSheet, Switch, Text, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation';

import Sound from 'react-native-sound';

class App extends React.Component {
  watchID: ?number = null;

  constructor() {
    super();
    Sound.setCategory('Playback', true); // true = mixWithOthers
    this.state = {
      lastPosition: null,
      initialPosition: null,
      sound: {},
      isLoop: false,
    };
  }

  componentDidMount() {

    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });

    const sound = new Sound(require('./music.mp3'), '', error => {
      if (error) {
        Alert.alert('error', error.message);
      }
    });


    this.setState({
      sound,
    });
  }

  _play = () => {
    this.state.sound.play(() => {
      this.state.sound.release();
    });
  };
  _pause = () => {
    this.state.sound.pause();
  };

  _stop = () => {
    this.state.sound.stop();
  };

  _toggleLoop = (value) => {
    console.warn(value);
    if (value) {
      this.state.sound.setNumberOfLoops(-1); // loop infinite
    } else {
      this.state.sound.setNumberOfLoops(0); // no loop
    }

    this.setState({
      isLoop: value,
    });
  };

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content"/>
        <SafeAreaView>
          <Text style={styles.sectionTitle}>TILN PROJECT - READING ASSISTANT</Text>
          <View>
            <Text>
              <Text style={styles.title}>Initial position: </Text>
              {this.state.initialPosition}
            </Text>
            <Text>
              <Text style={styles.title}>Current position: </Text>
              {this.state.lastPosition}
            </Text>
          </View>

        </SafeAreaView>
        <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Button title={'Play'} onPress={this._play}/>
          <Button title={'Pause'} onPress={this._pause}/>
          <Button title={'Stop'} onPress={this._stop}/>
          <Text style={styles.highlight}>Repeat?</Text><Switch onValueChange={(value) => this._toggleLoop(value)}
                                                               value={this.state.isLoop}/>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
