/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
    Alert,
} from 'react-native';
import { Header, Button, Avatar } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import { RETEROM_KEY } from 'react-native-dotenv';

export default class App extends Component<{}> {
    watchId = null;

    state = {
        loading: false,
        updatesEnabled: false,
        location: {},
        sound: null,
        playable: false,
        textApi: null,
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
                    console.log(position);
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
    // componentDidMount() {
    //     // const intro = 'Aceasta este o aplicație făcută pentru proiectul Riding Asistănt din cadrul cursului de Tehnici de prelucrare a limbajului natural! Haide să explorăm lumea!';
    //     // fetch('http://romaniantts.com/scripts/api-rotts16.php', {
    //     //     body: `voice=sam16&inputText=${encodeURI(intro)}&vocoder=world&key=${RETEROM_KEY}`,
    //     //     method: 'POST',
    //     //     headers: {
    //     //         'Content-type': 'application/x-www-form-urlencoded',
    //     //     },
    //     // })
    //     //     .then(res => res.text())
    //     //     .then(tts => {

    //     //     })
    //     //     .catch(err => console.log(err));
    //     RNFS.downloadFile({
    //         fromUrl: 'http://romaniantts.com/scripts/mp3/812a27a3_1383_1588601825.mp3',
    //         toFile: `${RNFS.DocumentDirectoryPath}/intro.mp3`,
    //     }).promise.then((response) => {
    //         console.log(response);
    //     });
    //     const introsound = new Sound(`${RNFS.DocumentDirectoryPath}/intro.mp3`, Sound.MAIN_BUNDLE, (error) => {
    //         if (error) {
    //             console.log('failed to load the sound', error);
    //         } else {
    //             introsound.play();
    //         }
    //     });
    // }


    // function
    encodeFormData = (data) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            .join('&');
    }
    getLocationUpdates = async () => {
        const hasLocationPermission = await this.hasLocationPermission();

        if (!hasLocationPermission) { return; }

        this.setState({ updatesEnabled: true }, () => {
            this.watchId = Geolocation.watchPosition(
                position => {
                    this.setState({ location: position });
                    console.log(position);
                    const textInput = 'Acesta este un test al doilea';

                    fetch('https://reactnative.dev/movies.json')
                        .then(response => response.json())
                        .then(json => {
                            if (json.title) {
                                const body = {
                                    voice: 'sam16',
                                    inputText: 'Salutari fratilor',
                                    vocoder: 'world',
                                    key: RETEROM_KEY,
                                };
                                const request = this.encodeFormData(body);
                                console.log(request);
                                console.log(body);
                                fetch('http://romaniantts.com/scripts/api-rotts16.php', {
                                    body: `voice=sam16&inputText=${encodeURI(textInput)}&vocoder=world&key=${RETEROM_KEY}`,
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/x-www-form-urlencoded',
                                    },
                                })
                                    .then(res => res.text())
                                    .then(tts => {
                                        console.log(tts);
                                        this.setState({ textApi: tts });
                                    })
                                    .catch(err => console.log(err));
                            }
                        })
                        .catch(error => console.error(error));
                    RNFS.downloadFile({
                        fromUrl: `${this.state.textApi}`,
                        toFile: `${RNFS.DocumentDirectoryPath}/temp.mp3`,
                    }).promise.then((response) => {
                        console.log(response);
                    });
                    const soundObj = new Sound(
                        `${RNFS.DocumentDirectoryPath}/temp.mp3`, '',
                        error => {
                            if (error) {
                                Alert.alert('error', error.message);
                            }
                        },
                    );
                    this.setState({ sound: soundObj }, () => {
                        this.setState({ playable: true });
                    });
                },
                error => {
                    this.setState({ location: error });
                    console.log(error);
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 50,
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
                        <Button
                            icon={<Icon raised name="play" type="font-awesome" />}
                            title="Play Sound"
                            onPress={this.play}
                        />
                        <Button
                            icon={<Icon raised name="pause" type="font-awesome" />}
                            title="Pause Sound"
                            onPress={this.pause}
                        />
                        <Button
                            icon={<Icon raised name="stop" type="font-awesome" />}
                            title="Stop Sound"
                            onPress={this.stop}
                        />
                    </View>

                    <View style={styles.result}>
                        <Text>{JSON.stringify(location, null, 4)}</Text>
                        <Text>{this.state.textApi}</Text>
                    </View>
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
});
