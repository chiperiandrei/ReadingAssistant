import React, { Component } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Image
} from 'react-native';
import { Header, Button, Avatar } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Sound from 'react-native-sound';
import { RETEROM_KEY, RETEROM_API_URL, GET_LOCATION_NAME, GET_DESCRIPTION_FOR_PLACE } from 'react-native-dotenv';
import MapView,{ PROVIDER_GOOGLE,Marker } from 'react-native-maps';

export default class App extends Component<{}> {
  watchId = null;

  state = {
    loading: false,
    updatesEnabled: false,
    location: {},
    sound: null,
    playable: false,
    textApi: null,
    place: '',
    city: '',
  };
  play = () => {
    this.state.sound.play(() => {
      this.state.sound.release();
    });
  };
  pause = () => {
    this.state.sound.pause();
  };
  stop = () => {
    this.state.sound.stop();
  };

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) { return true; }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) { return true; }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) { return; }

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({ location: position, loading: false });
        },
        error => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };
  componentDidMount() {

    const introsound = new Sound('intro.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else {
        introsound.play();
      }
    });
  }


  // function
  encodeFormData = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }
  getLocationUpdates = async () => {
    console.log(GET_DESCRIPTION_FOR_PLACE)
    console.log(GET_LOCATION_NAME)
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) { return; }

    this.setState({ updatesEnabled: true }, () => {
      this.watchId = Geolocation.watchPosition(
        position => {
          console.log(position)
          this.setState({ location: position });

          fetch(`${GET_LOCATION_NAME}?lat=${position.coords.latitude}&long=${position.coords.longitude}`)
            .then(response => response.text())
            .then(res => {
              if (res !== "") {
                this.setState({ place: res })
                const getCity = () => {
                  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyDQDFqXEtbFwpeFkiBMcyhVUknEWzvW9x0`)
                    .then(response => response.json())
                    .then(json => this.setState({ city: json.results[0].address_components[2].long_name }))
                    .catch(err => console.log('aocio'))
                }
                // const city = getCity()
                // console.log(city)
                // var y = res.split(' ').slice(0, 2).join(' ') + this.state.city;
                // console.log(y)


                fetch(`${GET_DESCRIPTION_FOR_PLACE}?for_search=${res}`, {
                  method: 'GET',
                })
                  .then(desc => desc.json())
                  .then(json => {
                    let textInput = json.query.pages[Object.keys(json.query.pages)[0]].extract;
                    if (textInput === undefined || textInput === 'undefined')
                      textInput = 'Nu am putut găsi informații relevante despre această locație'
                    const filtrat = textInput.replace(/[\])}[{(]/g, '')
                    console.warn(filtrat)
                    fetch(`${RETEROM_API_URL}`, {
                      body: `voice=sam16&inputText=${encodeURI(filtrat)}&vocoder=world&key=${RETEROM_KEY}`,
                      method: 'POST',
                      headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                      },
                    })
                      .then(res => res.text())
                      .then(tts => {
                        console.log(tts);
                        this.setState({ textApi: tts });
                        const introsound = new Sound(tts, Sound.MAIN_BUNDLE, (error) => {
                          if (error) {
                            console.log('failed to load the sound', error);
                          } else {
                            introsound.play();
                          }
                        });
                      })
                      .catch(err => {
                        const sunet_error_reterom = new Sound('reterom_eroare.mp3', Sound.MAIN_BUNDLE, (error) => {
                          if (error) {
                            console.log(error)
                          }
                          else {
                            sunet_error_reterom.play();
                          }
                        })
                      });

                  })
                  .catch(err_desc => {
                    const sunet_error_wikipedia = new Sound('wikipedia_get_error.mp3', Sound.MAIN_BUNDLE, (error) => {
                      if (error) {
                        console.log(error)
                      }
                      else {
                        sunet_error_wikipedia.play();
                      }
                    })
                  }); //@TODO: sunet pentru eroare wikipedia



              }
              else {
                fetch(`${RETEROM_API_URL}`, {
                  body: `voice=sam16&inputText=${encodeURI('Nu am găsit nicio locație în baza de date.')}&vocoder=world&key=${RETEROM_KEY}`,
                  method: 'POST',
                  headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                  },
                })
                  .then(res => res.text())
                  .then(tts => {
                    const introsound = new Sound(tts, Sound.MAIN_BUNDLE, (error) => {
                      if (error) {
                        console.log('failed to load the sound', error);
                      } else {
                        introsound.play();
                      }
                    });
                  })
                  .catch(err => console.log("aiuci la reterom"));
              }
            })
            .catch(err_desc => {
              const sunet_error_locatie_din_text = new Sound('get_locations_error.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                  console.log(error)
                }
                else {
                  sunet_error_locatie_din_text.play();
                }
              })
            }) //@TODO sunet pentru eroare getLocatie



        },
        error => {
          this.setState({ location: error });
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 100,
          interval: 5000,
          fastestInterval: 2000,
        },
      );
    });
  };

  removeLocationUpdates = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.setState({ updatesEnabled: false });
    }
  };

  render() {
    const { loading, location, updatesEnabled } = this.state;
    if (this.state.playable === true) {
      this.play();
    }
    return (
      <>
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
        <View style={styles.container}>
          <Spinner
            visible={false}
            textContent={'Getting your location...'}
            color={'cyan'}
            size={'large'}
          />
          <Button
            title="Get Location"
            onPress={this.getLocation}
            disabled={loading || updatesEnabled}
          />
          <View style={styles.buttons}>
            <Button
              title="Start walking"
              onPress={this.getLocationUpdates}
              disabled={updatesEnabled}
            />
            <Button
              title="Stop walking"
              onPress={this.removeLocationUpdates}
              disabled={!updatesEnabled}
            />
          </View>

          {this.state.place !== '' ? <Text>Te afli {this.state.place}</Text> : null}
          {this.state.location !== {} && this.state.location.coords ? console.log(this.state.location.coords.latitude) : null}

          <MapView
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: this.state.location !== {} && this.state.location.coords ? this.state.location.coords.latitude : 47.1739724,
              longitude: this.state.location !== {} && this.state.location.coords ? this.state.location.coords.longitude : 27.5749111,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001
            }}
            style={styles.map}>
            <Marker
              coordinate={{
                latitude:this.state.location !== {} && this.state.location.coords ? this.state.location.coords.latitude : 47.1739724,
                longitude:this.state.location !== {} && this.state.location.coords ? this.state.location.coords.longitude : 27.5749111,
              }}
              title={'Salut'}
              description={'descriere'}
              
            >
              <Image source={require('./ceva.gif')} style={styles.marker}/>
            </Marker>

          </MapView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    paddingHorizontal: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
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
  map: {
    height: '60%',
    width: '100%'
  },
  marker:{
    height:20,
    width:40
  }
});
