import { View, Text, Image } from 'react-native';
import { Tabs } from 'expo-router';


const TabsLayout = () => {
    return (
        <>
            <Tabs
             screenOptions={{
             tabBarShowLabel: false
            }}
            >   
            <Tabs.Screen
                    name="search"
                    options={{
                        title: "Ficha médica",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                               <Image 
                               style={{width:24, height: 24}}
                               tintColor={focused ? 'green' : ''}
                               source={require('../../assets/images/search.png')} />
                                <Text style={[{fontSize: 12}, {color: focused ? 'green' : 'gray'}]} numberOfLines={1}>
                                 Pesquisar
                                </Text>
                            </View>  
                        ),
                    }}
                />
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Início",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                               <Image 
                               style={{width:24, height: 24}}
                               tintColor={focused ? 'green' : 'gray'}
                               source={require('../../assets/images/Home.png')} />
                                <Text style={[{fontSize: 12}, {color: focused ? 'green' : 'gray'}]} numberOfLines={1}>
                                  Início
                                </Text>
                            </View>
                        ),
                    }}
                />
               
                <Tabs.Screen
                    name="logout"
                    options={{
                        title: "sair",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                               <Image 
                               style={{width:24, height: 24}}
                               tintColor={focused ? 'green' : ''}
                               source={require('../../assets/images/logout.png')} />
                                <Text style={[{fontSize: 12}, {color: focused ? 'green' : 'gray'}]} numberOfLines={1}>
                                  Sair
                                </Text>
                            </View>  
                        ),
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout;