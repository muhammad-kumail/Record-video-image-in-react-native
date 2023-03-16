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
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal'
import AutoHeightImage from 'react-native-auto-height-image';

import * as ImagePicker from 'react-native-image-picker'
import { Icon } from 'react-native-elements';
import { styles } from '../styles';
import ExternalPath from '../constants'

var RNFS = require('react-native-fs');
const moment = require('moment');

const vLogo = 'https://png.pngtree.com/png-clipart/20200224/original/pngtree-video-icon-in-flat-style-png-image_5244725.jpg';

export default function Photos({ navigation }) {
    const [list, setList] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [simage, setSimage] = React.useState('');
    const [refresh, setRefresh] = React.useState(false);
    React.useEffect(() => {
        RNFS.readDir(`${ExternalPath}/MyApp/Photos`)
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
            RNFS.mkdir(ExternalPath + '/MyApp/Photos')
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

    const clickPhoto = () => {
        ImagePicker.launchCamera({}, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Error while clicking image:', response.error);
            } else {
                console.log('Clicked image URI:', response);
                savePhoto(response.assets[0].uri);
            }
        });
    }

    savePhoto = async filePath => {
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
            const newPhotoName = `IMG_${moment().format('DDMMYY_HHmmSSS')}.jpg`;
            const newFilepath = `/MyApp/Photos/${newPhotoName}`;
            // move and save image to new filepath
            const photoMoved = await moveAttachment(filePath, newFilepath);
            console.log('Photo moved', photoMoved);
            setRefresh(true);
        } catch (error) {
            console.log(error);
        }
    };

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

    const renderItem = ({ item, index }) => {

        return (
            <Button style={styles.vItem} activeOpacity={0.4} onPress={() => {
                setSimage(item.path);
                setShowModal(true);
            }}>
                <Modal
                    isVisible={showModal}
                    onBackButtonPress={() => setShowModal(false)}
                    onBackdropPress={() => setShowModal(false)}
                    onDismiss={() => setShowModal(false)}
                    style={{  height: '100%', width: '90%' }}
                >
                    <AutoHeightImage source={{ uri: simage?`file://${simage}`:null }} style={{borderWidth: 1}} width={wp('90%')}/>
                </Modal>
                <Image source={{ uri: `file://${item.path}` }} style={styles.thumbnail} />
                <View style={styles.vInnerItem}>
                    <Text style={{ color: 'black' }}>{item.name}</Text>
                    <Text style={{ color: 'gray' }}>{formatBytes(item.size)}</Text>
                </View>
            </Button>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
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
            <Button onPress={clickPhoto} style={{
                position: 'absolute',
                bottom: 15,
                right: 15,
            }} activeOpacity={0.4}>
                <Icon
                    type='material'
                    name='add-photo-alternate'
                    color={'white'}
                    backgroundColor={'purple'}
                    style={styles.recordIcon}
                    size={40}
                />
            </Button>
        </SafeAreaView>
    );
}