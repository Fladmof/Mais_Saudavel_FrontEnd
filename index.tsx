import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => router.push("/home")}>
        <Image source={require('../aa-assets-images/arrowLeft.png')} />
      </Pressable>

      <Text style={styles.headerText}>
        <Image source={require('../aa-assets-images/classification.png')} />
      </Text>
      <View />
    </View>
  )
}

const TopUser = ({userInfo}) => {
    const isTop1 = (userInfo.id == "1");
    return (
        <View style={styles.topUserContainer}>
           <Image source={isTop1 ? require('../aa-assets-images/medalMan.png') : 
            require('../aa-assets-images/man1.png')
           }
            style={!isTop1 && {borderRadius: '50%'}}
           />
           <Text style={styles.topUserName}>{userInfo.name}</Text>
           <Text style={[styles.topUserXp, {backgroundColor: 'white', padding: 4, borderRadius: 14}]}>{userInfo.points} xp</Text>
        </View>
    )
}

const NonTopUsers = ({nonTopUserInfo, position}) => {

  return (
    <View style={[styles.nonTopUserContainer, position < 4 && {display: 'none'}]}>
      <Text style={styles.nonTopPosition}>{position}</Text>
      <Image source={require('../aa-assets-images/woman.png')}/>
      <View style={styles.nonTopUserInfo}>
        <Text style={styles.nonTopUserName}>{nonTopUserInfo.name}</Text>
        <Text style={styles.nonTopUserXp}>{nonTopUserInfo.points} xp</Text>
      </View>
    </View>
  )
}
export default  function Index() {


    const [tab, setTab] = useState('agora'); 
     const [players, setPLayers] = useState([
          {id: '1', name: "Davis curtis", points:2569},
          {id: '2', name: "Alena Donin", points:1469},
          {id: '3', name: "craig house", points:1053},
          {id: '4', name: "madalyn dias", points:590},
          {id: '5', name: "zain vacarro", points:448},
          {id: '6', name: "geidt", points:440},
          {id: '7', name: "skylar", points:430},
          {id: '8', name: "skylar pault", points:40},
          {id: '8', name: "skydt", points:0},
       ]);
    


    return (
      <View style={{flex:1}}>
        <Header />

        <ScrollView style={styles.container}
         contentContainerStyle={{
          alignItems: 'center', paddingTop: 40
         }}
        >
          <Stack.Screen options={{headerShown: false}}></Stack.Screen>
          

            <View style={styles.tabs}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      tab === "agora" && styles.activeTab,
                    ]}
                    onPress={() => setTab("agora")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        tab === "agora" && styles.activeText,
                      ]}
                    >
                      Agora
                    </Text>
                  </TouchableOpacity>
            
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      tab === "hoje" && styles.activeTab,
                    ]}
                    onPress={() => setTab("hoje")}   
                  >
                    <Text
                     style={[
                      styles.tabText,
                      tab === "hoje" && styles.activeText,
                     ]}
                    >
                      Hoje
                    </Text>
            
                  </TouchableOpacity>
                 </View>

                 <View style={styles.message}>
                    <View>
                        <Image source={require('../aa-assets-images/rank.png')}/>
                    </View>

                    <View style={styles.messageText}>
                        <View style={styles.messageDescription}>
                         <Text style={styles.cheerMessage}>Não estás em uma excelente posição. Precisas melhorar muito jacaré</Text>
                        </View>
                    </View>
                 </View>

                 <View style={styles.topPlayers}>
                     <View style={styles.topPlayerDetail}>
                        <TopUser userInfo={players[1]}/>
                        <View style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                            <Image source={require('../aa-assets-images/Rank2.png')}/>
                            <Image style={{position: 'absolute'}} source={require('../aa-assets-images/2.png')} />
                        </View>
                        
                    </View>

                     <View style={styles.topPlayerDetail}>
                        <TopUser userInfo={players[0]}/>
                        <View style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                            <Image source={require('../aa-assets-images/Rank1.png')}/>
                            <Image style={{position: 'absolute'}} source={require('../aa-assets-images/1.png')} />
                        </View>
                        
                    </View>

                      <View style={styles.topPlayerDetail}>
                        <TopUser userInfo={players[2]}/>
                        <View style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
                            <Image source={require('../aa-assets-images/Rank3.png')}/>
                            <Image style={{position: 'absolute'}} source={require('../aa-assets-images/3.png')} />
                        </View>
                        
                    </View>
                 </View>

                 <View 
                 style={{backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap:8}}
                 >
                   {
                    players.map((element,index) => (
                      <NonTopUsers key={index} nonTopUserInfo={players[index]}
                       position={index+1}
                      />
                    ))
                   }
                   
                 </View>


        </ScrollView>
      </View>  
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F0F4FF',
        fontFamily: 'Fredoka'
    },

     tabs: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    marginTop:10,
  },

   tabButton: {
    flex:1,
    paddingVertical:8,
    paddingHorizontal:60,
    alignItems: 'center',
    borderRadius: 14
  },

  activeTab: {
        backgroundColor: '#0597F6',
  },

   activeText: {
    color: '#FFFFFF'
  },

   tabText: {
    color: '#82D1F6',
    fontWeight: '600'
  },

  message: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#FFC800',
    paddingVertical:11,
    paddingHorizontal: 12,
    borderRadius:10,
    maxWidth: '70%',
    marginBottom: 10
  },

  cheerMessage: {
    color: 'white',
    fontSize:15
  },

  messageDescription: {
    flexShrink:1,
  },

  messageText: {
    height: '90%',
    display: 'flex',
    flexShrink: 1
  },

  topPlayers: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: -10,
    },
  
  topPlayerDetail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5
  },
  topUserContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  topUserName: {
    color: '#777777',
    fontWeight: 'bold',
    marginBottom: 8
  },

  topUserXp: {
    color: '#FFC800',
    fontWeight: 'bold'
  },

  nonTopUserContainer: {
     display: 'flex',
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#F0F4FF',
     width: 345,
     paddingHorizontal:20,
     paddingVertical: 8,
     gap:8,
     borderRadius:8,
  },

  nonTopUserInfo: {
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'space-between',
    gap: 10
  },

  nonTopUserName: {
    color: '#4B4B4B',
    fontWeight: 'bold'
  },

  nonTopUserXp: {
    color: '#FFC800',
    fontWeight: 'bold'
  },

  nonTopPosition: {
    color: '#737373',
    fontWeight: 'bold',
    backgroundColor: 'white',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  },

  headerContainer: {
    height: 46,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: '#F0F4FF'
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold"
  }
})

