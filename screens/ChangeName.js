import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import firebaseDb from './firebaseDb';

class ChangeName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            id : this.props.route.params.id

        }
    }

    handleName = name => this.setState({name})

    handleChangeName = () => {
        const { name } = this.state
        firebaseDb.auth()
            .currentUser.updateProfile({displayName: name})
            .then(() => firebaseDb.firestore().collection('users').doc(this.state.id).update({name: name}))
            .then(() => alert("Name has been changed. Please login again."))
            .catch(error => {console.log(error)
                alert(error)})
            .then(() => this.props.navigation.navigate('Login'))
    }

    render(){
        return (
            <View style = {styles.container}>
                <Text style = {styles.titleText}> New Name </Text>
                <TextInput
                    style={styles.inputs}
                    placeholder="Name"
                    placeholderTextColor = "grey"
                    autoCapitalize = "none"
                    value={this.state.name}
                    onChangeText={this.handleName}
                />
                <TouchableOpacity
                    style = {styles.cfmButton}
                    onPress={() => {
                        if (this.state.name.length){
                            this.handleChangeName()
                        }
                    }}
                >
                    <Text style = {styles.buttonText}> Confirm </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default ChangeName

const styles = StyleSheet.create ({
    container: {
        flexWrap : 'wrap',
        flexDirection: 'column',
        flex: 5,
        marginTop: 25,
        marginBottom: 60
    },
    titleText: {
        fontFamily: 'Roboto',
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
        fontFamily: 'Roboto',
        textAlign: 'center'
    }
})
