import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import firebaseDb from './firebaseDb';

const db = firebaseDb.firestore()

class Logout extends Component {
    handleLogout = () => {
        firebaseDb.auth()
            .signOut()
            .then(() => this.props.navigation.navigate('Login'))
            .catch(error => console.log(error))
    }
    render () {
        return(
            <View style = {styles.container}>
                <Text style = {styles.confirmText}>
                    Press OK to logout
                </Text>
                <TouchableOpacity
                    style = {styles.confirmButton}
                    onPress={() => this.handleLogout()}
                >
                    <Text> OK </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Logout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        marginTop: 25,
        marginBottom: 25,
        justifyContent: 'center'
    },
    confirmText: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 24,

    },
    confirmButton: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 24,
        backgroundColor: '#53D3EF',
        marginTop: 20
    }
})
