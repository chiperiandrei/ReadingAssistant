import React, { useState, useEffect } from 'react';
import {
  Alert,
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
// import Tts from 'react-native-tts';
import Spinner from 'react-native-loading-spinner-overlay';
import Axios from "axios";

const soundStyle = {
  display: 'flex',
  flexDirection: 'column',
};
const App = props => {
  const [lastPosition, setLastPosition] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [sound, setSound] = useState({});
  const [isLoop, setIsLoop] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [dataExists,setDataExists]=useState(false);

  const play = () => {
    sound.play(() => {
      sound.release();
    });
  };
  const pause = () => {
    sound.pause();
  };
  const stop = () => {
    sound.stop();
  };

  // const _playTTS = () => {
  //   Tts.setDefaultLanguage('ro-RO');
  //   Tts.speak(
  //     'Vasile Alecsandri (n. 21 iulie S.N. 2 august 1821, undeva în ținutul Bacăului, Moldova — d. 22 august S.N. 3 septembrie 1890, Mircești, județul Roman, România) a fost un poet, dramaturg, folclorist, om politic, ministru, diplomat, membru fondator al Academiei Române, creator al teatrului românesc și al literaturii dramatice în România, personalitate marcantă a Moldovei și apoi a României de-a lungul întregului secol al XIX-lea.',
  //   );
  // };
  // const _stopTTS = () => {
  //   Tts.stop();
  // };

  const _toggleLoop = value => {
    if (value) {
      sound.setNumberOfLoops(-1); // loop infinite
    } else {
      sound.setNumberOfLoops(0); // no loop
    }
    setIsLoop(value);
  };

  useEffect(() => {
    const watchID = Geolocation.getCurrentPosition(
      position => {
        const initPosition = JSON.stringify(position);
        setInitialPosition(initPosition);
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000  },
    );
    Geolocation.watchPosition(position => {
      const lastPos = JSON.stringify(position);
      setLastPosition(lastPos);
    });
    const soundObj = new Sound('http://romaniantts.com/scripts/mp3/812a27a3_7535_1588516626.mp3', '', error => {
      if (error) {
        Alert.alert('error', error.message);
      }
    });
    setSound(soundObj);
    if (initialPosition!==null) {
      Axios.get('')
    }
    
    return function cleanup() {
      Geolocation.clearWatch(watchID)
    }
    
  }, []);

  if (lastPosition===null) {
    return (
      <>
        <ImageBackground
          source={require('./assets/img/background.jpg')}
          style={styles.image}>
          <View>
            <Spinner
              visible={spinner}
              textContent={'Getting your location...'}
              textStyle={styles.spinnerTextStyle}
              color={'cyan'}
              size={'large'}
            />
          </View>
        </ImageBackground>
      </>
    );
  } else {
    return (
      <>
        <ImageBackground
          source={require('./assets/img/background.jpg')}
          style={styles.image}>
          <Header
            leftComponent={
              <Avatar
                size="medium"
                rounded
                icon={{ name: 'directions-walk', type: 'material' }}
              />
            }
            centerComponent={{
              text: 'READING ASSISTANT',
              style: { color: '#fff', fontSize: 23, fontWeight: 'bold' },
            }}
            rightComponent={
              <Avatar
                size="medium"
                rounded
                icon={{ name: 'book', type: 'font-awesome' }}
              />
            }
          />
          <View>
            <Text style={styles.textWhite}>Current position: </Text>
            <Text style={styles.textWhite}>{initialPosition}</Text>
            <Text style={styles.textWhite}>Initial position: </Text>
            <Text style={styles.textWhite}>{lastPosition}</Text>
          </View>
          <View style={soundStyle}>
            <Button
              icon={<Icon raised name="play" type="font-awesome" />}
              title="Play Sound"
              onPress={play}
            />
            <Button
              icon={<Icon raised name="pause" type="font-awesome" />}
              title="Pause Sound"
              onPress={pause}
            />
            <Button
              icon={<Icon raised name="stop" type="font-awesome" />}
              title="Stop Sound"
              onPress={stop}
            />

            {/* <Button
              icon={<Icon raised name="microphone" type="font-awesome" />}
              title="Play TTS"
              onPress={_playTTS}
            />
            <Button
              icon={<Icon raised name="microphone-slash" type="font-awesome" />}
              title="Stop TTS"
              onPress={_stopTTS}
            /> */}
            <Text style={styles.highlight}>Repeat?</Text>
            <Switch
              onValueChange={value => _toggleLoop(value)}
              value={isLoop}
            />
          </View>
        </ImageBackground>
      </>
    );
  }
};

export default App;
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
