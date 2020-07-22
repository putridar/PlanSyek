import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebaseDb from './firebaseDb';

class AccountSetting extends Component {

    render(){
        return (
            <View style = {styles.container}>
                <View style = {styles.sejajar}>
                    <Text style = {styles.titleText}> Name </Text>
                    <Text onPress={() => this.props.navigation.navigate('Change Name')}
                          style = {styles.editText}>
                        Edit
                    </Text>
                </View>
                <Text style = {styles.dataText}>
                    {firebaseDb.auth().currentUser.displayName}
                </Text>
                <View style = {styles.sejajar}>
                    <Text style = {styles.titleText}> Email </Text>
                    <Text onPress={() => this.props.navigation.navigate('Change Email')}
                          style = {styles.editText}>
                        Edit
                    </Text>
                </View>
                <Text style = {styles.dataText}>
                    {firebaseDb.auth().currentUser.email}
                </Text>
                <Text onPress={() => this.props.navigation.navigate('Change Password')}
                      style = {styles.changeText}>
                    Change Password
                </Text>
            </View>
        )
    }
}

export default AccountSetting

const styles = StyleSheet.create ({
    container: {
        flexWrap : 'wrap',
        flexDirection: 'column',
        flex: 5,
        marginTop: 25,
        marginBottom: 60
    },
    sejajar: {
        flexDirection: 'row'
    },
    titleText: {
        fontSize: 18,
        color: 'black',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 20,
        width: 100,
        height: 30,
        fontWeight: "bold",
        textAlign: 'left'
    },
    editText: {
        color: '#36A5C9',
        fontSize: 16,
        width: 100,
        height: 30,
        marginTop: 10,
        marginLeft: 50
    },
    dataText: {
        color: 'black',
        fontSize: 18,
        width: 200,
        height: 50,
        marginTop: 10,
        marginLeft: 20,
        textAlign: 'left',
        marginBottom: 30
    },
    changeText: {
        color: '#36A5C9',
        fontSize: 16,
        width: 200,
        height: 30,
        marginTop: 70,
        marginLeft: 20,
    }
})
