import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import firebaseDb from './screens/firebaseDb';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

export function DrawerContent(props) {
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={{marginTop: 15}}>
                    <Image source = {require('./Pics/plansyek_logo.png')} style={styles.image}
                    />
                    <View style={styles.name}>
                        <Text style={styles.nameText}>{firebaseDb.auth().currentUser.displayName}</Text>
                        <Text style={styles.emailText}>{firebaseDb.auth().currentUser.email}</Text>
                    </View>
                </View>
                <Drawer.Section>
                    <DrawerItem
                        label="Home"
                        onPress={() => {props.navigation.navigate('Home')}}
                    />
                    <DrawerItem
                        label="Account Setting"
                        onPress={() => {props.navigation.navigate('Account Setting')}}
                    />
                    <DrawerItem
                        label="Logout"
                        onPress={() => {props.navigation.navigate('Logout')}}
                    />
                </Drawer.Section>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        alignSelf:'center',
        width: 181,
        height: 181,
        resizeMode: 'contain'
    },
    name:{
        justifyContent:'center',
        marginBottom: 10
    },
    nameText:{
        fontSize:20,
        textAlign:'center',
        fontWeight:'bold'
    },
    emailText:{
        fontSize:16,
        textAlign:'center'
    }
})
