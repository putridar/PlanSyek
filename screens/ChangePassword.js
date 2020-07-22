import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import firebaseDb from './firebaseDb';
import {CheckBox} from "react-native-elements";

class ChangePassword extends Component {
    state = {
        password: '',
        duplicate: ''
    }

    handlePassword = password => this.setState({password: password})

    handleDuplicate = password => this.setState({duplicate: password})

    changePassword = (newPassword) => {
            const user = firebaseDb.auth().currentUser;
            user.updatePassword(newPassword).then(() => {
                console.log("Password updated!");
            })
                .then(() => alert("Password has been changed. Please login again."))
                .catch(error => {console.log(error)
                                    alert(error)})
                .then(() => this.props.navigation.navigate('Login'))
    }

    render(){
        return (

            <View style = {styles.container}>
                <Text style = {styles.titleText}> New Password </Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="Password"
                    placeholderTextColor = "grey"
                    autoCapitalize = "none"
                    value={this.state.password}
                    onChangeText={this.handlePassword}
                    secureTextEntry={true}
                />
                <Text style = {styles.titleText}> Re-Enter Password </Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="Re-enter Password"
                    placeholderTextColor = "grey"
                    autoCapitalize = "none"
                    value={this.state.duplicate}
                    onChangeText={this.handleDuplicate}
                    secureTextEntry={true}
                />
                <TouchableOpacity
                    style = {styles.cfmButton}
                    onPress={() => {
                        if (this.state.password.length < 6){
                            alert("Password length must be at least 6 characters!")
                        }
                        else if (this.state.password !== this.state.duplicate) {
                            alert("Please reenter the password correctly!")
                        }
                        else {
                            this.changePassword(this.state.password)
                        }
                    }}
                >
                    <Text style = {styles.buttonText}> Confirm </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default ChangePassword

const styles = StyleSheet.create ({
    container: {
        flexDirection: 'column',
        marginTop: 25,
        marginBottom: 60,
        alignItems:'center'
    },
    titleText: {
        fontSize: 20,
        color: 'black',
        marginTop: 10,
        width: 200,
        height: 30
    },
    inputs: {
        height: 40,
        width: 250,
        borderColor: 'black',
        borderWidth: 1,
        paddingHorizontal: 5,
        margin: 10,
        borderRadius: 5
    },
    cfmButton: {
        backgroundColor: '#53D3EF',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 8,
        margin: 50,
        width: 250,
        height: 40,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center'
    },
})
