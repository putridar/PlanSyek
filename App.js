import React, {Component, createContext} from 'react';
import { NavigationContainer,  useNavigation, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { Button } from 'react-native-elements'
import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Reminder from './screens/Reminder';
import Notification from "./screens/Notification";
import TravelPlan2 from "./screens/TravelPlan2";
import ExpandCalendar from "./screens/ExpandCalendar";
import AddModule from "./screens/AddModule";
import AccountSetting from "./screens/AccountSetting";
import ChangePassword from "./screens/ChangePassword";
import ChangeName from "./screens/ChangeName";
import ChangeEmail from "./screens/ChangeEmail";
import Logout from "./screens/Logout";
import {DrawerContent} from "./DrawerContent";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import firebaseDb from './screens/firebaseDb';

const db = firebaseDb.firestore()
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack2 = createStackNavigator();
const DEFAULT_CONTEXT = {
    id: '',
    email: ''
};

const FollowingTabNavigatorContext = createContext(DEFAULT_CONTEXT);

function CalendarScreen({route}) {
    const { id } = route.params;
    const { email } = route.params;
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="ExpandCalendar" component={ExpandCalendar} initialParams ={{modules: '',id:id,email:email}}/>
            <Stack.Screen name="Add Module" component={AddModule} initialParams={{id:id,email:email}}/>
        </Stack.Navigator>
    )
}

function AccSetting({route}) {
    const { id } = route.params;
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Account Setting" component={AccountSetting} initialParams={{id:id}}/>
            <Stack.Screen name="Change Name" component={ChangeName} initialParams={{id:id}}/>
            <Stack.Screen name="Change Email" component={ChangeEmail} initialParams={{id:id}}/>
            <Stack.Screen name="Change Password" component={ChangePassword} initialParams={{id:id}}/>
        </Stack.Navigator>
    )
}


function DrawerStack({route}) {
    const { id } = route.params;
    const { email } = route.params;
    return(
        <Drawer.Navigator initialRouteName="Primary" drawerContent={props=><DrawerContent {...props}/>}>
            <Drawer.Screen name="Home" component ={Primary} initialParams={{id:id, email:email}} />
            <Drawer.Screen name="Account Setting" component ={AccSetting} initialParams={{id:id}}/>
            <Drawer.Screen name="Logout" component={Logout} />
        </Drawer.Navigator>
    )
}

const NavigationDrawerStructure = ()=> {
    const navigation = useNavigation();
    const toggleDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer())
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <Button
                icon={{
                    name: "menu",
                    size: 20,
                    color: "black"
                }}
                type= 'clear'
                onPress={()=> toggleDrawer()}/>
        </View>
    );
}

function Primary({route}) {
    const { id } = route.params;
    const { email } = route.params;
    return (
        <FollowingTabNavigatorContext.Provider value={{ id,email }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused
                                ? 'ios-home'
                                : 'ios-home';
                        } else if (route.name === 'Schedule') {
                            iconName = focused ? 'ios-calendar' : 'ios-calendar';
                        } else if (route.name === 'Reminder') {
                            iconName = focused ? 'ios-time' : 'ios-time';
                        } else if (route.name === 'Notification') {
                            iconName = focused ? 'ios-notifications' : 'ios-notifications-outline';
                        } else if (route.name === 'TravelPlan') {
                            iconName = focused ? 'ios-navigate' : 'ios-navigate';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: '#53D3EF',
                    inactiveTintColor: 'gray',
                    //showLabel: false
                }}
            >
            <Tab.Screen name="Home" component={Home} initialParams={{notif:'', id:id, email:email}}/>
            <Tab.Screen name="Schedule" component={CalendarScreen} initialParams ={{modules: '',test:'',id:id, email:email}}/>
            <Tab.Screen name="Reminder" component={Reminder} initialParams ={{title: "", date:'', time: '', count:'0', id:id, email:email}}/>
            <Tab.Screen name="Notification" component={Notification} initialParams={{id:id, email:email}}/>
            <Tab.Screen name="TravelPlan" component={TravelPlan2} initialParams={{id:id,email:email}}/>
        </Tab.Navigator>
        </FollowingTabNavigatorContext.Provider>
    );
}

function App({navigation}) {
    return (
        <NavigationContainer>
            <Stack2.Navigator initialRouteName="Login">
                <Stack2.Screen name="Login" component={Login} />
                <Stack2.Screen name="SignUp" component={SignUp} />
                <Stack2.Screen name="PlanSyek" component={DrawerStack}
                              options={{
                                  headerLeft: () => (
                                      <NavigationDrawerStructure navigationProps={navigation} />
                                      )
                              }} initialParams={{modules:'',test:''}}/>
            </Stack2.Navigator>
        </NavigationContainer>
    );
}

export default App;

const styles = StyleSheet.create({
    header:{
        width:"100%",
        height:60,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:20
    }
})
