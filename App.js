/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Alert, SafeAreaView, StatusBar, StyleSheet, Text, View,} from 'react-native';

import {Colors,} from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation';

class App extends React.Component {
  watchID: ?number = null;

  constructor() {
    super();
    this.state = {
      lastPosition: null,
      initialPosition: null,
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
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
        <>
          <StatusBar barStyle="dark-content"/>
          <SafeAreaView>
            <Text>Salut</Text>
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
