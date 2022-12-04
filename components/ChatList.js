import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect,useState } from 'react'
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import ChatRow from './ChatRow';


const ChatList = ({fuser_id}) => {

    const [matches, setmatches] = useState([])
    const userData = useSelector(state => state.authentication.user_data);
    const db = getFirestore();


    useEffect(() => {

      onSnapshot(query(collection(db, 'matches'), where('usersMatched','array-contains', userData.uid)), 
      snapshot =>
      setmatches(
        snapshot.docs.map(doc => 
            ({ 
            fid: doc.id,
            ...doc.data(),
        }) ))
       )
    }, [userData])
    
 

  return matches.length > 0 ? (
   <FlatList
   style={{height:'100%'}}
   data={matches}
   keyExtractor={item => item.fid}
   renderItem={({item}) => <ChatRow matchDetails={item}  />}
   />
  ) :
  (
    <View style={{padding:50}}>
      <Text style={{textAlign:'center', fontSize:40}}>No Matches at the moment😢 </Text>
    </View>
  )
}

export default ChatList

const styles = StyleSheet.create({})