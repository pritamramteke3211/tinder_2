import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Chat from '../../screens/chat/chat';
import Home from '../../screens/home/home';
import Login from '../../screens/login/login';

const Stack = createNativeStackNavigator();

export default StackNav = () => {
  const user = false;
  return (
    <Stack.Navigator 
    screenOptions={{
      headerShown: false
    }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Chat" component={Chat} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};
