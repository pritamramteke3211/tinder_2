// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import Chat from '../../screens/chat/chat';
import Home from '../../screens/home/home';
import Login from '../../screens/login/login';
import Match from '../../screens/match/Match';
import MessageScreen from '../../screens/messageScreen.js/MessageScreen';
import Modal from '../../screens/modal/modal';

const Stack = createStackNavigator();

export default StackNav = () => {
  const logined = useSelector(state => state.authentication.login);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {logined ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Message" component={MessageScreen} />
          </Stack.Group>
          <Stack.Group
            screenOptions={{presentation: 'modal', gestureEnabled: true}}>
            <Stack.Screen name="Modal" component={Modal} />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
            <Stack.Screen name="Match" component={Match} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};
