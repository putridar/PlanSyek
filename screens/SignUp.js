import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, ActivityIndicator, Button} from 'react-native';
import firebaseDb from './firebaseDb';

class SignUp extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        signUpSuccess: true
    }


    handleName = name => this.setState({name})

    handleEmail = email => this.setState({email})

    handlePassword = password => this.setState({password})

    handleSignUp = () => {
        const { email, password } = this.state
        var success = true;
        firebaseDb.auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(error => {
                success = false;
                console.log(error)
                alert(error)})
            .then(() => {
                firebaseDb.auth().currentUser.updateProfile({displayName: this.state.name})
                this.props.navigation.navigate('Login')
                if (success){
                    firebaseDb.firestore().collection('users').add({
                        name: this.state.name,
                        email: this.state.email,
                        notif: [],
                        alarm: [],
                        modules: [],
                        schedule: []
                    })
                        .then((res) => this.setState({
                            name: '',
                            email: '',
                            password: '',
                        })).catch(err => console.error(err)).catch(error => {console.log(error)
                        alert(error)})
                }
            })
            .catch(error => {
                success = false;
                console.log(error)})
    }

    render() {
        const { name, email, password, signUpSuccess } = this.state;

        return (
            <View style={styles.container}>
                <Text style = {styles.title}>
                    Create Account
                </Text>
                <Text style = {styles.miniTitle}>
                    Name
                </Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="Name"
                    placeholderTextColor = "grey"
                    autoCapitalize = "none"
                    value={this.state.name}
                    onChangeText={this.handleName}
                />
                <Text style = {styles.miniTitle}>
                    Email
                </Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="Email"
                    placeholderTextColor = "grey"
                    autoCapitalize = "none"
                    value={this.state.email}
                    onChangeText={this.handleEmail}
                />
                <Text style = {styles.miniTitle}>
                    Password
                </Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="Password"
                    placeholderTextColor = "grey"
                    autoCapitalize = "none"
                    value={this.state.password}
                    onChangeText={this.handlePassword}
                    maxLength={15}
                    secureTextEntry={true}
                />
                <TouchableOpacity
                    style = {styles.signupbutton}
                    onPress={() => {
                        if (name.length && email.length && password.length) {
                            this.handleSignUp()
                        }
                    }}
                >
                    <Text style = {styles.signUpText}> SIGN UP </Text>
                </TouchableOpacity>
                <Text
                    style={styles.alreadyText}
                    onPress={() => this.props.navigation.navigate('Login')}>
                    Already Registered? Click here to login
                </Text>
            </View>
        );
    }
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
    },
    title: {
        fontSize: 38,
        marginBottom: 30
    },
    miniTitle: {
        fontSize: 14,
        margin: 10
    },
    inputs: {
        height: 30,
        width: 250,
        borderColor: 'black',
        borderWidth: 1,
        paddingHorizontal: 5,
        margin: 10,
        borderRadius: 5
    },
    signupbutton: {
        backgroundColor: '#53D3EF',
        textAlign: 'center',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 8,
        margin: 20,
        width: 120,
        height: 40
    },
    alreadyText: {
        color: '#3740FE',
        marginTop: 25,
        textAlign: 'center'
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    signUpText: {
        fontSize: 14,
        textAlign: 'center'
    }
})
