import { View, Text, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';

/*
const TabIcon = ({icon, color, name, focused}) => {
   return (
       <View>
           <Image source={require('../../assets/images/heart.png')}
           resizeMode="contain" 
           tintColor={color}
           style={{width:6, height:6}}
           />
           <Text style={{ }}>
               {name}
           </Text>
       </View>
   )
}
*/

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
                    name="ficha-medica"
                    options={{
                        title: "Ficha médica",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                               <Image 
                               style={{width:24, height: 24}}
                               tintColor={focused ? 'green' : 'gray'}
                               source={require('../../assets/images/heart.png')} />
                                <Text style={[{fontSize: 12}, {color: focused ? 'green' : 'gray'}]} numberOfLines={1}>
                                  Ficha médica
                                </Text>
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="medication"
                    options={{
                        title: "medication",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                               <Image 
                               style={{width:24, height: 24}}
                               tintColor={focused ? 'green' : ''}
                               source={require('../../assets/images/pill.png')} />
                                <Text style={[{fontSize: 12}, {color: focused ? 'green' : 'gray'}]} numberOfLines={1}>
                                  Medicação
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