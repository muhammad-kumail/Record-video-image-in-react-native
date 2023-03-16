import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Videos from './src/Video/videos';
import PlayVideo from './src/Video/playVideo';
import Photos from './src/Photo/photos';
import Main from './src/Main';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: 'purple' },
        headerTitleStyle: { color: 'white' },
        headerTintColor: 'white'
      }} initialRouteName='Choose'>
        <Stack.Screen name="Choose" component={Main} />
        <Stack.Screen name="Videos" component={Videos} />
        <Stack.Screen name="Photos" component={Photos} />
        <Stack.Screen name="Play" component={PlayVideo} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}