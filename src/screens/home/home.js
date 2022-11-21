import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { setLogin } from '../../store/feature/authentication/authentication';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-deck-swiper';

const Home = ({navigation}) => {
  
  const dispatch = useDispatch()
  const userData = useSelector(state => state.authentication.user_data)

  const DUMMY_DATA = [
    {
      firstName: "Person1",
      lastName: "Surname1",
      occupation: "Software Developer",
      photoURL: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
      age: 27,
    },
    {
      firstName: "Person2",
      lastName: "Surname2",
      occupation: "Software Developer",
      photoURL: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=600",
      age: 40,
    },
    {
      firstName: "Person3",
      lastName: "Surname3",
      occupation: "Software Developer",
      photoURL: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=600",
      age: 21,
    },
  ]

  // Different to hide screen header
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false
  //   })
  // }, [])

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      dispatch(setLogin(false));

      // Google Account disconnected from your app.
      // Perform clean-up actions, such as deleting data associated with the disconnected account.
    } catch (error) {
      console.error(error);
    }
  };


  

  return (
    <SafeAreaView>
      {/* Header */}
      <View style={{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        justifyContent:'space-between',
       position:'relative'}}>
          <TouchableOpacity style={{}} onPress={signOut}>
            <Image source={{uri: userData.photoURL, width:35, height:35 }} borderRadius={25}/>
          </TouchableOpacity>
          <TouchableOpacity>
        <Image style={{width:60, height:60}} source={require('../../../assets/img/logo.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={{}} onPress={()=> navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" color={"coral"} size={30} />        
      </TouchableOpacity>
      </View>
      {/* End of Header */}
      
      {/* Cards */}
      <Swiper
      cards={DUMMY_DATA}
      renderCard={(card) => {
        <View>
          <Text>{card.firstName}</Text>
        </View>
      }}
      />

    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
