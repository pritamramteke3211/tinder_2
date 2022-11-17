import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React,{useEffect,useState} from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';


const Login = ({navigation}) => {

  const [userData, setuserData] = useState({})
  const [signIn, setsignIn] = useState(false)

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1019972796430-kkrpau84pn8agoescfg2u36hckiinetu.apps.googleusercontent.com',
    });
  }, [])

  const googleSign= async()=> {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
  
  
  const signOut = async () => { 
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      setsignIn(false)
      // Google Account disconnected from your app.
      // Perform clean-up actions, such as deleting data associated with the disconnected account.
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      <ImageBackground
      resizeMode='cover'
      style={{flex: 1}}
      source={{ uri: "https://tinder.com/static/tinder.png"}}>
        <TouchableOpacity style={styles.btn}>
        <Text style={{textAlign:'center',fontWeight:'bold'}} 
        onPress={()=> googleSign().then(res => {
  console.log(res.user)
  setuserData(res.user)
  setsignIn(true)
  navigation.navigate('Home')
})}
>Signin in & get swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  btn:{
    position:'absolute',
    // height: 10,
    bottom:120, 
    width:"50%",
    marginHorizontal:'25%',
    padding: 20,
    borderRadius:20,
    backgroundColor:'#fff'
  }
});
