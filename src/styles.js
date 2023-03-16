import { StyleSheet } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        height: '15%',
        width: '100%',
        borderRadius: 75,
        backgroundColor: '',
        padding: 10,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: 'white'
    },
    vItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        margin: 10,
        padding: 10,
        marginVertical: 5
    },
    vInnerItem: {
        padding: 10,
        justifyContent: 'center',
    },
    thumbnail: {
        height: 80,
        width: 80,
        borderRadius: 8
    },
    recordIcon: {
        justifyContent: 'center',
        height: hp('8%'),
        width: hp('8%'),
        borderRadius: 75,
        padding: 8,
    }
});