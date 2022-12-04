import { View, Text,TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react';
import { useEffect } from 'react';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { useSelector } from 'react-redux';

const ChatRow = ({matchDetails,fuser_id}) => {
    const navigation = useNavigation();
    const userData = useSelector(state => state.authentication.user_data);
    const f_id = useSelector(state =>  state.authentication.f_id)

    const [matchedUserInfo, setmatchedUserInfo] = useState(null)

    useEffect(() => {
      setmatchedUserInfo(getMatchedUserInfo(matchDetails.users, userData.uid))
    }, [matchDetails,userData])
    

  return (
    <TouchableOpacity style={[{flexDirection:'row', alignItems:'center',
    borderRadius:10,
    marginHorizontal: 10, 
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor:'white'},styles.cardShadow]}>
      <Image
      style={{height: 50, aspectRatio:1,borderRadius:5, marginRight:10}}
      source={{uri: matchedUserInfo?.photoURL}}
      />

      <View>
        <Text style={{fontSize:20,fontWeight:'500'}}>
            {matchedUserInfo?.displayName}
        </Text>
        <Text>{"Say Hi!"}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChatRow;


const styles = StyleSheet.create({
    cardShadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
  });

