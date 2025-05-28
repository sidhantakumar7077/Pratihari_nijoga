import { View, Text, StyleSheet, Image, ImageBackground, StatusBar } from 'react-native';
import React from 'react'
import Video from 'react-native-video';

const Index = () => {
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Video
                source={require('../../assets/video/splash_video.mp4')}
                style={styles.video}
                resizeMode="cover"
                // muted={false}
                // repeat={false}
                // controls={false}
                // fullscreen={true}
                // paused={false}
            />
        </View >
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    video: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
})