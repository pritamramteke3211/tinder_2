import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {setFid, setLogin, setUserdata} from '../../store/feature/authentication/authentication';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AdIcon from 'react-native-vector-icons/AntDesign';
import Swiper from 'react-native-deck-swiper';
import {firebase} from '../../../firebase';
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import generateId from '../../../lib/generateId';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.authentication.user_data);
  const swipeRef = useRef(null);
  const [profiles, setprofiles] = useState([]);
  const [refresh, setrefresh] = useState(false);

  const todoRef = firebase.firestore().collection('users');

  const [fuser_id, setfuser_id] = useState(null);

  const db = getFirestore();

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

  const getData = async () => {
    // Method 1 to get
    // const snapshot = await todoRef.get();

    // let pdata = []
    // snapshot.forEach(doc => {
    //   pdata.push(doc.data())

    //   if (doc.data().id == userData.uid) {
    //     setfuser_id(doc.id)
    //   }
    // });

    // if (pdata.filter(v => v.id !== userData.uid).length > 0) {
    //   setprofiles(pdata.filter(v => v.id !== userData.uid))
    // }
    // else{
    //   navigation.navigate('Modal')
    // }

    /// Method 2 to get
    // const db = await getFirestore()
    // const userRef = collection(db, 'users')
    // console.log("userRef",userRef);

    // onSnapshot(userRef, (snapshot) => {
    //   let title = []
    //   snapshot.docs.map((doc) => {
    //     console.log("doc.id",doc.id)
    //   })
    // })

    /// Method 3 to get
    let unsub;
    let dats2;
    unsub = await onSnapshot(collection(db, 'users'), snapshot => {
      let data = snapshot.docs.map(doc => ({fid: doc.id, ...doc.data()}));
      dats2 = data.filter(v => v.id === userData.uid)[0].fid;

      setFid(dats2)
      setfuser_id(dats2);
  
      
    });

    // const passes = await getDocs(collection(db,'users',dats2,'passes')).then(snapshot => snapshot.docs.map(doc => doc.id))
    // const passedUserIds = passes.length > 0 ? passes : ['test'];

    // let unsubw;
    // unsubw = onSnapshot(query(collection(db, "users"), where('id', 'not-in', [...passedUserIds])), (snapshot) => {
    //   let data2 = snapshot.docs.map((doc => ({fid: doc.id, ...doc.data()})))
    //   .filter(doc => doc.id !== userData.uid )
    //   setprofiles(data2)
    // })
  };

  const filterPasses = async () => {
    const passes = await getDocs(
      collection(db, 'users', fuser_id, 'passes'),
    ).then(snapshot => snapshot.docs.map(doc => doc.id));

    const swipes = await getDocs(
      collection(db, 'users', fuser_id, 'swipes'),
    ).then(snapshot => snapshot.docs.map(doc => doc.id));

    const passedUserIds = passes.length > 0 ? passes : ['test'];
    const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

    

    let unsubw;
    unsubw = onSnapshot(
      query(
        collection(db, 'users'),
        where('id', 'not-in', [...passedUserIds, ...swipedUserIds]),
      ),
      snapshot => {
        let data2 = snapshot.docs
          .map(doc => ({fid: doc.id, ...doc.data()}))
          .filter(doc => doc.id !== userData.uid);
       
        setprofiles(data2);
      },
    );
  };

  useEffect(() => {
    if (fuser_id) {
      filterPasses();
      
    }
  }, [fuser_id]);

  useLayoutEffect(() => {
    getData();
    const willFocusSubscription = navigation.addListener('focus', () => {
      getData();
    });
    return willFocusSubscription;
  }, []);

  const swipeLeft = async cardIndex => {
    console.log('LEFT');
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    console.log(`You Swiped PASS on ${userSwiped.id} ${userData.uid}`);
    console.log('fuser_id', fuser_id);
    setDoc(doc(db, 'users', fuser_id, 'passes', userSwiped.id), userSwiped);
  };

  const swipeRight = async cardIndex => {
    console.log('Right');
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const loggedInProfile = {...await (
      await getDoc(doc(db, 'users', fuser_id))
    ).data(), fid: fuser_id}

    // Check if the user swiped on you...
    getDoc(doc(db, 'users', userSwiped.fid, 'swipes', userData.uid)).then(
      documentSnapshot => {
        
        if (documentSnapshot.exists()) {
          // user has matched with you before you matched with them...

          console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`);
          console.log('loggedInProfile', loggedInProfile);
          console.log('userSwiped', userSwiped);

          setDoc(
            doc(db, 'users', fuser_id, 'swipes', userSwiped.id),
            userSwiped,
          );
          console.log('generated id', generateId(userData.uid, userSwiped.id));
         
          // CREATE A MATCH
          setDoc(doc(db, 'matches', generateId(userData.uid, userSwiped.id)), {
            users: {
              [userData.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [userData.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          navigation.navigate('Match', {
            loggedInProfile,
            userSwiped,
          });
        } else {
          // User has swiped as first interaction between the two or didn't get swiped on...
          console.log(`You Swiped  on ${userSwiped.displayName}`);
          setDoc(
            doc(db, 'users', fuser_id, 'swipes', userSwiped.id),
            userSwiped,
          );
        }
      },
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          position: 'relative',
        }}>
        <TouchableOpacity style={{}} onPress={signOut}>
          <Image
            source={{uri: userData.photoURL, width: 35, height: 35}}
            borderRadius={25}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image
            style={{width: 60, height: 60}}
            source={require('../../../assets/img/logo.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{}}
          onPress={() => navigation.navigate('Chat' , {fuser_id})}>
          <Ionicons name="chatbubbles-sharp" color={'coral'} size={30} />
        </TouchableOpacity>
      </View>
      {/* End of Header */}

      {/* Cards */}
      <View style={{flex: 1, marginTop: -6}}>
        <Swiper
          ref={swipeRef}
          containerStyle={{backgroundColor: 'transparent'}}
          cards={profiles}
          stackSize={3}
          cardIndex={0}
          animateCardOpacity
          onSwipedLeft={cardIndex => {
            // console.log('Swipe PASS');
            swipeLeft(cardIndex);
            setrefresh(!refresh);
          }}
          onSwipedRight={cardIndex => {
            // console.log('Swipe MATCH');
            swipeRight(cardIndex);
            setrefresh(!refresh);
          }}
          backgroundColor={'#4FD0E9'}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red',
                },
              },
            },
            right: {
              title: 'MATCH',
              style: {
                label: {
                  textAlign: 'left',
                  color: 'green',
                },
              },
            },
          }}
          verticalSwipe={false}
          renderCard={card =>
            card ? (
              <View
                key={card.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  height: 500,
                  position: 'relative',
                }}>
                <Image
                  style={{
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                    borderRadius: 10,
                  }}
                  source={{uri: card.photoURL}}
                />
                <View
                  style={[
                    {
                      position: 'absolute',
                      bottom: 0,
                      backgroundColor: 'white',
                      width: '100%',
                      height: '20%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                    },
                    styles.cardShadow,
                  ]}>
                  <View>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <View>
                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                      {card.age}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  height: 500,
                  // position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontWeight: 'bold', paddingBottom: 20}}>
                  No More Profiles
                </Text>
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 10,
                  }}
                  source={{uri: 'https://links.papareact.com/6gb'}}
                />
              </View>
            )
          }
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 29,
            width: 58,
            aspectRatio: 1,
            backgroundColor: '#ff00007b',
          }}
          onPress={() => swipeRef.current.swipeLeft()}>
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 29,
            width: 58,
            aspectRatio: 1,
            backgroundColor: '#00ff007a',
          }}
          onPress={() => swipeRef.current.swipeRight()}>
          <AdIcon name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

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
