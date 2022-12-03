import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect,useState } from 'react'
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';


const ChatList = () => {

    const [matches, setmatches] = useState([])
    const userData = useSelector(state => state.authentication.user_data);
    const db = getFirestore();

    useEffect(() => {

      onSnapshot(query(collection(db, 'matches'), where('usersMatched','array-contains', userData.uid)), 
      snapshot =>
        snapshot.docs.map(doc => 
            (
           { 
            fid: doc.id,
            ...doc.data(),
        }
)            )
       )
    }, [])
    

  return (
    <View style={{}}>
      <Text>ChatList...</Text>
    </View>
  )
}

export default ChatList

const styles = StyleSheet.create({})