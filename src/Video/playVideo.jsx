import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import VideoPlayer from 'react-native-video-controls';

export default function PlayVideo(props) {
    return (
        <VideoPlayer
            source={{ uri: props.route.params.uri }}
            onBack={()=>props.navigation.goBack()}
        />
    );
}