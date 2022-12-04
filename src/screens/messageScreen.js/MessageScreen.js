import { Button, KeyboardAvoidingView, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, FlatList } from 'react-native'
import React from 'react'
import Header from '../../../components/Header'
import { useRoute } from '@react-navigation/native'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import getMatchedUserInfo from '../../../lib/getMatchedUserInfo'
import { useState } from 'react'
import SenderMessage from '../../../components/SenderMessage'
import ReceiverMessage from '../../../components/ReceiverMessage'
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'

const MessageScreen = () => {
    const db = getFirestore()
    const {params:{matchDetails}} = useRoute()
    const userData = useSelector(state => state.authentication.user_data);
    const f_id = useSelector(state => state.authentication.f_id);
    const [input, setinput] = useState("")
    const [messages, setmessages] = useState([])

    useEffect(() => {
        onSnapshot(
            query(
              collection(db, "matches", matchDetails.fid, "messages"),
              orderBy("timestamp", "desc")
            ),
            (snapshot) =>
              setmessages(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
              )
          )
    }, [matchDetails, db])
    
   
    const sendMessage = async() => {

        save = await addDoc(collection(db, 'matches', matchDetails.fid, 'messages'), {
            timestamp : serverTimestamp(),
            userId: userData?.uid,
            displayName: userData?.displayName,
            message: input,
            photoURL: matchDetails?.users[userData?.uid]?.photoURL,
        })
        setinput("")
        Keyboard.dismiss()
    }
    
  return (
    <SafeAreaView 
    style={{flex:1}}
    >
    <Header title={getMatchedUserInfo(matchDetails.users, userData.uid).displayName} callEnabled/>
      
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios"? "padding" : "height"}
      style={{flex:1}}
      keyboardVerticalOffset={50}
      >
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <FlatList
            inverted={-1}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({item: message})=>
            message.userId === userData.uid ? (
                <SenderMessage key={message.id} message={message} />
            ):
            (
                <ReceiverMessage key={message.id} message={message} />
            )
        }
            />
          
        </TouchableWithoutFeedback> 
   
         
         <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderColor:'gray',borderWidth:1, paddingHorizontal:5, paddingVertical:2}}>
        <TextInput
        style={{height:50, fontSize:20}}
        placeholder="Send Message..."
        onChangeText={setinput}
        value={input}
        onSubmitEditing={()=> input && sendMessage()}
        />
        <Button onPress={()=> input && sendMessage()} title="Send" color="#FF5864"/>

      </View>
   

          </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MessageScreen

const styles = StyleSheet.create({})