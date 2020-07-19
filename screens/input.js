import React, { Component } from 'react'
import { View, Image, Text, TouchableHighlight, TextInput, StyleSheet} from 'react-native'

class Inputs extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        signUpSuccess: false
    }

    handleName = (text) => {
        this.setState({name: text})
    }
    handleEmail = (text) => {
        this.setState({email: text})
    }
    handlePassword = (text) => {
        this.setState({ password: text })
    }
    login = (name, email, password) => {
        if (name !== '' && email !== '' && password !== '') {
            this.setState({signUpSuccess: true})
        } else {
            this.setState({signUpSuccess: false})
        }
        this.setState({name:'',password:'',email:''})
    }

    render() {
        return (
            <View style = {styles.container}>
                <Image source = {{uri:'http://www.nus.edu.sg/images/default-source/base/logo.png'}}
                       style = {{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 32 }}
                />

                <TextInput ref = {input => {this.nameInput = input}}
                    style = {styles.input}
                           underlineColorAndroid = "transparent"
                           placeholder = "Name"
                           placeholderTextColor = "#000000"
                           autoCapitalize = "none"
                           onChangeText = {this.handleName}
                clearButtonMode = 'always'/>

        <TextInput ref = {input => {this.emailInput = input}}
            style = {styles.input}
        underlineColorAndroid = "transparent"
        placeholder = "Email"
        placeholderTextColor = "#000000"
        autoCapitalize = "none"
        onChangeText = {this.handleEmail}
        clearButtonMode = 'always'/>

        <TextInput ref = {input => {this.passInput = input}}
            style = {styles.input}
        underlineColorAndroid = "transparent"
        placeholder = "Password"
        placeholderTextColor = "#000000"
        autoCapitalize = "none"
        onChangeText = {this.handlePassword}
                   clearButtonMode = 'always'/>

        <TouchableHighlight
        style = {styles.submitButton}
        onPress = {
        () => {
            this.login(this.state.name, this.state.email, this.state.password)
            this.nameInput.clear()
            this.emailInput.clear()
            this.passInput.clear()
        }
    }>
    <Text style = {styles.submitButtonText}> Sign Up </Text>
            </TouchableHighlight>
                <Text style = {styles.signSuccess}> {this.state.signUpSuccess ? 'Sign Up Successful':null}</Text>
            </View>
    )
    }
}
export default Inputs

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        height: 30,
        width: 200,
        alignSelf: 'center'
    },
    input: {
        margin: 8,
        height: 30,
        padding: 8,
        width: 200,
        fontSize: 12,
        //borderColor: '#7a42f4',
        borderWidth: 1
    },
    submitButton: {
        backgroundColor: '#003D7C',
        paddingVertical: 8,
        marginTop: 50,
        borderRadius: 5,
        height: 40,
        alignContent: 'center',
        marginBottom: 40,
        paddingHorizontal: 5,
        marginLeft: 40,
        marginRight: 40
    },
    submitButtonText:{
        color: 'white',
        fontSize: 12,
        alignSelf: 'center'
    },
    signSuccess: {
        color:'green',
        alignSelf: 'center',
        fontSize: 20
    },
    successContainer: {
        margin: 50
    }
})