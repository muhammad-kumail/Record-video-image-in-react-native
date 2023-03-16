import * as React from 'react';
import { FlatList } from 'react-native';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity as Button,
    PermissionsAndroid,
    Image,
    RefreshControl
} from 'react-native';
import RNThumbnail from 'react-native-thumbnail';
import {styles} from '../styles';
import ExternalPath from '../constants'

import * as ImagePicker from 'react-native-image-picker'
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
var RNFS = require('react-native-fs');
const moment = require('moment');

const vLogo = 'https://png.pngtree.com/png-clipart/20200224/original/pngtree-video-icon-in-flat-style-png-image_5244725.jpg';

function VideoItem({ name, path, size }) {
    const [thumbnail, setThumbnail] = React.useState(null);
    const navigation = useNavigation();
    React.useEffect(() => {
        const fetchThumbnail = async () => {
            const thumbnailPath = await getThumbnail();
            setThumbnail(thumbnailPath);
        };
        fetchThumbnail();
    }, []);

    const formatBytes = (bytes) => {
        if (bytes < 1024) {
            return bytes + "B";
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(2) + "KB";
        } else if (bytes < 1073741824) {
            return (bytes / 1048576).toFixed(2) + "MB";
        } else {
            return (bytes / 1073741824).toFixed(2) + "GB";
        }
    }
    function getFileName(p) {
        const pathArray = p.split('/');
        const fileNameWithExtension = pathArray[pathArray.length - 1];
        const fileNameArray = fileNameWithExtension.split('.');
        fileNameArray.pop();
        const fileName = fileNameArray.join('.');
        return fileName;
    }

    const getThumbnail = () => {
        return new Promise((resolve, reject) => {
            RNThumbnail.get(`file://${path}`).then((result) => {
                const newpath = `${ExternalPath}/MyApp/.thumbs/${getFileName(path)}.jpeg`
                RNFS.mkdir(ExternalPath + '/MyApp/.thumbs')
                    .then(() => {
                        RNFS.moveFile(result.path, newpath)
                            .then(() => {
                                console.log(newpath);
                                resolve(`file://${newpath}`);
                            })
                            .catch(error => {
                                console.log('moveThumb error', error);
                                console.log(result.path)
                                resolve(result.path);
                            });
                    })
                    .catch(err => {
                        console.log('mkdir error', err);
                        console.log(result.path)
                        resolve(result.path);
                    });
            }).catch((err) => {
                console.log(err);
                resolve(vLogo);
            })
        });
    };

    return (
        <Button style={styles.vItem} activeOpacity={0.4} onPress={() => navigation.navigate('Play', { uri: path })}>
            <Image source={{ uri: thumbnail ? thumbnail : vLogo }} style={styles.thumbnail} />
            <View style={styles.vInnerItem}>
                <Text style={{ color: 'black' }}>{name}</Text>
                <Text style={{ color: 'gray' }}>{formatBytes(size)}</Text>
            </View>
        </Button>
    );
}

export default function Videos({ navigation }) {
    const [list, setList] = React.useState([]);
    const [refresh, setRefresh] = React.useState(true);
    const options = {
        mediaType: 'video',
        videoQuality: 'high',
        maxDuration: 300,
    };
    React.useEffect(() => {
        RNFS.readDir(`${ExternalPath}/MyApp/Videos`)
            .then((result) => {
                console.log('GOT RESULT', result);
                setList(result);
                setRefresh(false)
            })
            .catch((err) => {
                console.log(err.message, err.code);
                setRefresh(false);
            });
    }, [refresh === true])

    const moveAttachment = async (filePath, newFilepath) => {
        return new Promise((resolve, reject) => {
            newFilepath = ExternalPath + newFilepath
            RNFS.mkdir(ExternalPath + '/MyApp/Videos')
                .then(() => {
                    RNFS.moveFile(filePath, newFilepath)
                        .then(() => {
                            console.log('FILE MOVED', filePath, newFilepath);
                            resolve(true);
                        })
                        .catch(error => {
                            console.log('moveFile error', error);
                            reject(error);
                        });
                })
                .catch(err => {
                    console.log('mkdir error', err);
                    reject(err);
                });
        });
    };

    const recordVideo = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled video recording');
            } else if (response.error) {
                console.log('Error while recording video:', response.error);
            } else {
                // Response contains the URI of the recorded video
                console.log('Recorded video URI:', response);
                saveVideo(response.assets[0].uri);
            }
        });
    }

    saveVideo = async filePath => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ]);
        } catch (err) {
            console.warn(err);
        }
        const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (!readGranted || !writeGranted) {
            console.log('Read and write permissions have not been granted');
            return;
        }
        try {
            // set new image name and filepath
            const newVideoName = `VID_${moment().format('DDMMYY_HHmmSSS')}.mp4`;
            const newFilepath = `/MyApp/Videos/${newVideoName}`;
            // move and save image to new filepath
            const videoMoved = await moveAttachment(filePath, newFilepath);
            console.log('Video moved', videoMoved);
            setRefresh(true);
        } catch (error) {
            console.log(error);
        }
    };

    const renderItem = ({ item, index }) => {

        return <VideoItem name={item.name} path={item.path} size={item.size} />
    };
    return (
        <SafeAreaView style={{flex: 1}}>
            <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(true);
                            setInterval(() => {
                                setRefresh(false);
                            }, 1000);
                        }}
                    />
                }
            />
            <Button onPress={recordVideo} style={{
                position: 'absolute',
                bottom: 15,
                right: 15,
            }} activeOpacity={0.4}>
                <Icon
                    type='ionicons'
                    name='videocam'
                    color={'white'}
                    backgroundColor={'purple'}
                    style={styles.recordIcon}
                    size={40}
                />
            </Button>
        </SafeAreaView>
    );
}
