import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import firebaseDb from './firebaseDb';

const db = firebaseDb.firestore()

class Login extends Component {
    state = {
        email: '',
        password: '',
        isLoading: false,
        users: [],
        currEmail: ''
    }

    handleEmail = (text) => {
        this.setState({email: text})
    }
    handlePassword = (text) => {
        this.setState({password: text})
    }
    loginAndNavigate = () => {
        this.setState({
            name: '',
            email: '',
            password: ''
        })
    }
    handleLogin = () => {
        const { email, password } = this.state
        var success = true;
        db.collection('users').get().then(querySnapshot => {
            const results = []
            querySnapshot.docs.map(documentSnapshot => results.push({
                ...documentSnapshot.data(),
                id: documentSnapshot.id}))
            this.setState({users: results})
        }).catch(error => {console.log(error)
            alert(error)})

        firebaseDb.auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => {console.log(error)
                alert(error)
                success = false;})
            .then(() => {
                if (success){
                    let currId = this.state.users.filter(item =>
                        item.email === this.state.email)
                    this.setState({currEmail: this.state.email})
                    this.setState({
                        name: '',
                        email: '',
                        password: '',
                    });
                    this.props.navigation.push('PlanSyek', {id:currId[0].id,email:this.state.currEmail})
                }
            })
            .catch(error => {console.log(error)})
    }

    render() {

        return (
            <View style={styles.container}>
                <Image
                    source = {require('../Pics/plansyek_logo.png')}
                    style = {styles.image}/>
                <TextInput
                    style={styles.inputs}
                    placeholder="Email"
                    placeholderTextColor = "grey"
                    autoCapitalize = "none"
                    value={this.state.email}
                    onChangeText={this.handleEmail}
                />
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
                    style = {styles.loginbutton}
                    onPress={() => this.handleLogin()}
                >
                    <Text style = {styles.loginText}> LOGIN </Text>
                </TouchableOpacity>
                <Text
                    style={styles.createacc}
                    onPress={() => this.props.navigation.navigate('SignUp')}>
                    Create Account
                </Text>
            </View>
        );
    }
}

export default Login

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
    },
    image: {
        margin: 35,
        width: 181,
        height: 181,
        resizeMode: 'contain'
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
    loginbutton: {
        backgroundColor: '#53D3EF',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 8,
        margin: 50,
        width: 250,
        height: 40,
    },
    createacc: {
        fontSize: 14,
        color: '#36A5C9'
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
    loginText: {
        fontSize: 20,
        textAlign: 'center'
    }
})
