import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { setLogin } from '../../store/feature/authentication/authentication';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AdIcon from 'react-native-vector-icons/AntDesign';
import Swiper from 'react-native-deck-swiper';

const Home = ({navigation}) => {
  
  const dispatch = useDispatch()
  const userData = useSelector(state => state.authentication.user_data)
  const swipeRef = useRef(null);

  const DUMMY_DATA = [
    {
      firstName: "Person1",
      lastName: "Surname1",
      job: "Software Developer",
      photoURL: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
      age: 27,
      id: 1,
    },
    {
      firstName: "Person2",
      lastName: "Surname2",
      job: "Software Developer",
      photoURL: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=600",
      age: 40,
      id: 2,
    },
    {
      firstName: "Person3",
      lastName: "Surname3",
      job: "Software Developer",
      photoURL: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=600",
      age: 21,
      id: 3,
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
    <SafeAreaView style={{flex:1}}>
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

          <TouchableOpacity onPress={()=> navigation.navigate('Modal')}>
        <Image style={{width:60, height:60}} source={require('../../../assets/img/logo.png')} />
      </TouchableOpacity>

      <TouchableOpacity style={{}} onPress={()=> navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" color={"coral"} size={30} />        
      </TouchableOpacity>
      </View>
      {/* End of Header */}
      
      {/* Cards */}
      <View style={{flex:1, marginTop:-6}}>
      <Swiper
      ref={swipeRef}
      containerStyle={{backgroundColor:'transparent'}}
      cards={DUMMY_DATA}
      stackSize={3}
      cardIndex={0}
      animateCardOpacity
      onSwipedLeft={()=> {
        console.log('Swipe PASS')
      }}
      onSwipedRight={()=>{
        console.log('Swipe MATCH')
      }}
      backgroundColor={"#4FD0E9"}
      overlayLabels={{
        left: {
          title: "NOPE",
          style: {
            label:{
              textAlign: "right",
              color: "red"
            }
          }
        },
        right: {
          title: "MATCH",
          style: {
            label:{
              textAlign: "left",
              color: "green"
            }
          }
        }
      }}
      verticalSwipe={false}
      renderCard={(card) =>( 
        <View key={card.id} style={{backgroundColor:"white", borderRadius: 10, height:500,position:'relative'}}>
          <Image
          style={{position:'absolute',top:0,height:'100%', width:'100%', borderRadius: 10}}
          source={{uri: card.photoURL}}
          />
          <View style={[{position:'absolute',bottom:0,backgroundColor:'white',width:'100%', height:'20%',flexDirection:'row',alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingVertical:5}, styles.cardShadow]}>
            <View>
              <Text style={{fontSize:16, fontWeight:'bold'}}>
                {card.firstName} {card.lastName}
              </Text>
              <Text>
                {card.job}
              </Text>
            </View>
            <View>
              <Text style={{fontSize:24, fontWeight:'bold'}}>
              {card.age}
              </Text>
            </View>
          </View>
        </View>
  )}
      />
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center' }}>
          <TouchableOpacity style={{alignItems:'center',justifyContent:'center', borderRadius:29, width:58,aspectRatio:1, backgroundColor:'#ff00007b'}}
          onPress={()=> swipeRef.current.swipeLeft()}
          >
            <Entypo name="cross" size={24} color="red"/>
          </TouchableOpacity>

          <TouchableOpacity style={{alignItems:'center',justifyContent:'center', borderRadius:29, width:58,aspectRatio:1, backgroundColor:'#00ff007a'}}
          onPress={()=> swipeRef.current.swipeRight()}
          >
            <AdIcon name="heart" size={24} color="green"/>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  cardShadow:{
    shadowColor: "#000",
    shadowOffset:{
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  }
});
