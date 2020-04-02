/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import { Header, Button, Avatar } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation';

import Icon from 'react-native-vector-icons/FontAwesome';

import Sound from 'react-native-sound';

import Tts from 'react-native-tts';

const image = {
  uri:
    'https://i.pinimg.com/236x/15/f9/00/15f9007cc00d7f54dec4ba5ab8dd5816.jpg',
};

class App extends React.Component {
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
        this.setState({ initialPosition });
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });
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
  _playTTS = () => {
    Tts.setDefaultLanguage('ro-RO');
    Tts.speak(
      'Vasile Alecsandri (n. 21 iulie S.N. 2 august 1821, undeva în ținutul Bacăului, Moldova — d. 22 august S.N. 3 septembrie 1890, Mircești, județul Roman, România) a fost un poet, dramaturg, folclorist, om politic, ministru, diplomat, membru fondator al Academiei Române, creator al teatrului românesc și al literaturii dramatice în România, personalitate marcantă a Moldovei și apoi a României de-a lungul întregului secol al XIX-lea.',
    );
  };
  _stopTTS = () => {
    Tts.stop();
  };

  _toggleLoop = value => {
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
        <ImageBackground source={require('./assets/img/background.jpg')} style={styles.image}>

          <Header
            leftComponent={<Avatar
              size="medium"
              rounded
              icon={{ name: 'directions-walk', type: 'material' }}

            />}
            centerComponent={{ text: 'READING ASSISTANT', style: { color: '#fff', fontSize: 23, fontWeight: 'bold' } }}
            rightComponent={
              <Avatar
                size="medium"
                rounded
                icon={{ name: 'book', type: 'font-awesome' }}
              />}
          />
          <View>
            <Text style={styles.textWhite}>Initial position: </Text>
            <Text style={styles.textWhite}>{this.state.initialPosition}</Text>
            <Text style={styles.textWhite}>Current position: </Text>
            <Text style={styles.textWhite}>{this.state.lastPosition}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              icon={
                <Icon
                  raised
                  name='play'
                  type='font-awesome' />
              }
              title="Play Sound"

              onPress={this._play} />
            <Button
              icon={
                <Icon
                  raised
                  name='pause'
                  type='font-awesome' />
              }
              title="Pause Sound"

              onPress={this._pause} />
            <Button
              icon={
                <Icon
                  raised
                  name='stop'
                  type='font-awesome' />
              }
              title="Pause Sound"

              onPress={this._stop} />

            <Button
              icon={
                <Icon
                  raised
                  name='microphone'
                  type='font-awesome' />
              }
              title="Play TTS"

              onPress={this._playTTS} />
            <Button
              icon={
                <Icon
                  raised
                  name='microphone-slash'
                  type='font-awesome' />
              }
              title="Stop TTS"

              onPress={this._stopTTS} />
            <Text style={styles.highlight}>Repeat?</Text>
            <Switch
              onValueChange={value => this._toggleLoop(value)}
              value={this.state.isLoop}
            />
          </View>
        </ImageBackground>
      </>
    );
  }
}

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 0,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  textWhite: {
    color: Colors.white,
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
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default App;
