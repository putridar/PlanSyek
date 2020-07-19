import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements'
import Home from './Home';
import Schedule from './Schedule'
import Login from './Login';
import SignUp from './SignUp';
import Reminder from './Reminder';
import ReminderSet from "./ReminderSet";
import Notification from "./Notification";
import Menu from "./Menu";
import AlarmTest from "./AlarmTest";
import TravelPlan from "./TravelPlan";
import { createDrawerNavigator } from '@react-navigation/drawer';


const Drawer = createDrawerNavigator(
    {
        Home:{ screen: Home},
        Schedule:{ screen: Schedule},
        Reminder:{ screen: Reminder},
        TravelPlan: {screen: TravelPlan},
        Notification: {screen: Notification}

    }
)
const DrawerNavigation = createStackNavigator(
    {
        DrawerStack: { screen: Drawer}
    }, {
        headerMode: 'float',
        navigationOptions: ({navigation}) => ({
            headerLeft: <Button
                icon={{
                    name: "menu",
                    size: 20,
                    color: "black"
                }}
                type= 'clear'
                onPress={() => this.props.navigation.navigate('Menu')}
            />
        })
    })

const AppNavigation = createStackNavigator(
    {
        Login: Login,
        SignUp: SignUp
    }
)
const PrimaryNav = createStackNavigator(
    {
        loginStack: { screen: AppNavigation },
        drawerStack: { screen: DrawerNavigation}
    }, {
        // Default config for all screens
        headerMode: 'none',
        title: 'Main',
        initialRouteName: 'loginStack'
    }
)


export default PrimaryNav
