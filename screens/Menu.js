import React, { Component } from 'react'
import { Button } from 'react-native-elements'
import { View, Text, TouchableOpacity, Switch, StyleSheet, Animated} from 'react-native'

class Menu extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style = {styles.headText}> Menu </Text>
                <View style = {styles.bodyContainer}>
                    <TouchableOpacity
                        style = {styles.menuContainer}
                        onPress={() => this.props.navigation.navigate('Home')}>
                        <Text style = {styles.menuText}>
                            Home
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.menuContainer}
                        onPress={() => this.props.navigation.navigate('Schedule')}>
                        <Text style = {styles.menuText}>
                            Schedule
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.menuContainer}
                        onPress={() => this.props.navigation.navigate('Reminder')}>
                        <Text style = {styles.menuText}>
                            Reminder
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.menuContainer}
                        onPress={() => this.props.navigation.navigate('TravelPlan')}>
                        <Text style = {styles.menuText}>
                            Travel Plan
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.menuContainer}
                        onPress={() => this.props.navigation.navigate('Notification')}>
                        <Text style = {styles.menuText}>
                            Notification
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footContainer}>
                    <TouchableOpacity
                        style = {styles.settingContainer}
                        onPress={() => this.props.navigation.navigate('AccountSetting')}>
                        <Text style = {styles.footerText}>
                            Account Setting
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.settingContainer}
                        onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style = {styles.footerText}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default Menu

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        padding: 18,
        paddingTop: 35,
        backgroundColor: '#ffffff',
        marginTop: 25,
        marginBottom: 25
    },
    headText : {
        marginBottom: 30,
        fontSize: 36
    },
    menuContainer: {
        margin: 10
    },
    menuText: {
      fontSize: 18,
    },
    bodyContainer: {
        marginTop: 30,
        marginBottom: 50
    },
    footContainer: {
        marginTop: 50,
        marginBottom: 20
    },
    settingContainer: {
        margin: 7
    },
    footerText: {
        fontSize: 14,
        color: '#36A5C9'
    }
})
