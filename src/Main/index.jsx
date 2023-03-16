import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity as Button } from 'react-native';
import { StatusBar } from 'react-native';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from '../styles';

export default function Main(props) {
   return (
      <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
         <StatusBar backgroundColor={'purple'} barStyle={'light-content'}/>
         <Button onPress={() => props.navigation.navigate('Photos')}>
            <Icon
               type='material'
               name='add-photo-alternate'
               color={'white'}
               backgroundColor={'purple'}
               style={styles.recordIcon}
               size={40}
            />
         </Button>
         <Button onPress={() => props.navigation.navigate('Videos')}>
            <Icon
               type='ionicons'
               name='videocam'
               color={'white'}
               backgroundColor={'purple'}
               style={styles.recordIcon}
               size={40}
            />
         </Button>
      </View>
   );
}