import React, { Component, useEffect  } from 'react'
import { Button, CheckBox } from 'react-native-elements'
import {View, Text, TouchableOpacity, Switch, StyleSheet, Animated, FlatList, Modal, TextInput, Alert} from 'react-native'
import moment from "moment";
import Expo, { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import firebaseDb from './firebaseDb';
import NotificationPopup from 'react-native-push-notification-popup';

const db = firebaseDb.firestore()

export default class Notification extends Component {
    constructor(props) {
        super(props)

        this.state = {
            notifications: [],
            currNotif: '',
            chosenModule: [],
            navigation: this.props.navigation,
            route: this.props.route,
            id: this.props.route.params.id,
            email: this.props.route.params.email,
            user: '',
            inputTitle: '',
            inputTime: '',
            disableLecture: false,
            disableTut: false,
            disableLab: false,
            disableRec: false,
            lecTime: 0,
            tutTime: 0,
            labTime: 0,
            recTime: 0,
            editedItem: 0,
            isModalVisible: false,
            isSettingVisible: false,
            modules: [{
                name: 'CS1010S',
                lecture: 'Lecture 1', tutName: 'T37', recName: 'REC 1',
                lecTime: 0, tutTime: 0, labTime: 0, recTime: 0,
                lec: true, tut: true, rec: true, lab: true
            },
                {
                    name: 'MA1101R',
                    lecture: 'Lecture 1', tutName: 'T05', labName: 'C03',
                    lecTime: 0, tutTime: 0, labTime: 0, recTime: 0,
                    lec: true, tut: true, rec: true, lab: true
                }]
        }
    }

    //dummy schedule (instead of after lecture, schedule from current time
    onSubmit = (editedItem) => {
        let scheduleLec = 0
        let scheduleTut = 0
        let scheduleRec = 0
        let scheduleLab = 0
        let disableLecture= false
        let disableTut= false
        let disableLab= false
        let disableRec= false
        let date = new Date().getTime()
        console.log(date)
        for(let x = 0; x<this.state.chosenModule.length; x++) {
            let item = this.state.chosenModule[x]
            if (x === editedItem ) {
                scheduleLec = {
                    time:  date + Number(item.lecTime)*60000,
                    repeat: 'week'
                };
                scheduleTut = {
                    time: date + Number(item.tutTime)*60000,
                    repeat: 'week'
                };
                scheduleRec = {
                    time: date + Number(item.recTime)*60000,
                    repeat: 'week'
                };
                scheduleLab = {
                    time: date + Number(item.labTime)*60000,
                    repeat: 'week'
                };
                disableLecture = item.lec
                disableTut = item.tut
                disableLab = item.lab
                disableRec = item.rec
                console.log(item.lecTime)
                if (item.lec) {
                    Notifications.scheduleLocalNotificationAsync(
                        {
                            title: item.name +' Lecture',
                            body: 'Do not forget to watch webcast',
                            data: { test: item.name +' Lecture', body: 'Do not forget to watch webcast' },
                            vibrate: true,
                            sound:true,
                            android: {
                                sound: true,
                                vibrate: [0, 250, 250, 250]
                            },
                            ios: {
                                sound: true,
                                vibrate: [0, 250, 250, 250]
                            },
                            priority:'max',
                        },
                        scheduleLec,
                    );
                }
                if (item.tut) {
                    Notifications.scheduleLocalNotificationAsync(
                        {
                            title: item.name +' Tutorial',
                            body: 'Open Luminus to see tutorial ans!',
                            data: { test: item.name +' Tutorial', body: 'Open Luminus to see tutorial ans!' },
                            vibrate: true,
                            sound:true,
                            android: {
                                sound: true,
                                vibrate: [0, 250, 250, 250]
                            },
                            ios: {
                                sound: true,
                                vibrate: [0, 250, 250, 250]
                            },
                            priority:'max',
                        },
                        scheduleTut,
                    );
                }
                if (item.lab) {
                    Notifications.scheduleLocalNotificationAsync(
                        {
                            title: item.name + ' Lab',
                            body: 'Open Luminus to see lab ans!',
                            data: { test: item.name + ' Lab', body: 'Open Luminus to see lab ans!'},
                            vibrate: true,
                            sound:true,
                            android: {
                                sound: true,
                                vibrate: [0, 250, 250, 250]
                            },
                            ios: {
                                sound: true,
                                vibrate: [0, 250, 250, 250]
                            },
                            priority:'max',
                        },
                        scheduleLab,
                    );
                }
                if (item.rec) {
                    Notifications.scheduleLocalNotificationAsync(
                        {
                            title: item.name + ' Rec',
                            body: 'Open to see rec ans!',
                            data: { test: item.name + ' Rec', body: 'Open to see rec ans!' },
                            vibrate: true,
                            sound:true,
                            android: {
                                sound: true,
                                vibrate: [0, 250, 250, 250]
                            },
                            ios: {
                                sound: true,
                                vibrate: [0, 250, 250, 250]
                            },
                            priority:'max',
                        },
                        scheduleRec,
                    );
                }
            }
        }
    };
    handleNotification = () => {
        console.warn('ok! got your notif');
    };

    askNotification = async () => {
        // We need to ask for Notification permissions for ios devices
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (Constants.isDevice && status === 'granted')
            console.log('Notification permissions granted.');
    };

    TimerNotification = () => {
        useEffect(() => {
            this.askNotification();
            // If we want to do something with the notification when the app
            // is active, we need to listen to notification events and
            // handle them in a callback
            const listener = Notifications.addListener(this.handleNotification);
            return () => listener.remove();
        }, []);
    };

    updateDatabase=()=> {
        firebaseDb.firestore().collection('users').doc(this.state.id).update({notif:this.state.notifications})
    }

    updateDatabase=(item)=> {
        console.log('item')
        console.log(item)
        firebaseDb.firestore().collection('users').doc(this.state.id).update({notif:item})
    }

    //dummy
    addNotification = (data) => {
        let date = moment()
            .utcOffset('+08:00')
            .format(`DD MMM YYYY`);
        let currTime = moment()
            .utcOffset('+08:00')
            .format(`HH:mm`);
        let res = this.state.notifications
        this.setState({
            notifications: [...this.state.notifications, {
                title: data.test,
                time: date + ' ' + currTime,
                lec: true,
                tut: true,
                lab: true,
                rec: true,
            }]})
        this.setState({currNotif:data})
        res.push({
            title: data.test,
            time: date + ' ' + currTime,
            lec: true,
            tut: true,
            lab: true,
            rec: true,
        })
        this.popup.show({
            onPress: function() {console.log('Pressed')},
            appTitle: 'PlanSyek',
            timeText: 'Now',
            title: data.test,
            body: data.body,
            slideOutTime: 10000
        });
        this.updateDatabase(res)
    }

    updateNotifList = () =>{
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data()
            this.setState({notifications: hsl.notif})
            //this.setState({chosenModule: hsl.modules})
            this.addModule(hsl.notif, hsl.modules)
        })
    }


    addModule = (alarm,module) => {
        let mods = []
        for (let x = 0; x<module.length; x++) {
            mods.push({
                name: module[x].name,
                lecture: module[x].lecture, tutName: module[x].tutorial, recName: module[x].recitation, labName: module[x].lab,
                lecTime: 0, tutTime: 0, labTime: 0, recTime: 0,
                lec: true, tut: true, rec: true, lab: true
            })
        }
        this.setState({chosenModule: mods})
    }

    updateModule = () => {
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data()
            this.setState({chosenModule: hsl.modules})})
        for (let x in this.state.chosenModule) {
            if (!this.state.modules.filter((item) => item.name === x.name)){
                this.addModule(x)
            }
        }
    }

    componentDidMount() {
        this.listener = Notifications.addListener(this.handleNotif);
        this.updateNotifList()
        /*this.popup.show({
                onPress: function() {console.log('Pressed')},
                appTitle: 'PlanSyek',
                timeText: 'Now',
                title: this.state.currNotif.test,
                body: 'Open app to see more',
                slideOutTime: 5000
            });*/
        //this.updateModule()
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }


    handleNotif = ({ origin, data }) => {
        this.addNotification(data)
        console.log(
            `Push notification ${origin} with data: ${JSON.stringify(data)}`,
        );
    };

    getIndex = (value, arr) => {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].name === value) {
                return i;
            }
        }
        return -1;
    }

    setModalVisible = (bool) => {
        this.setState({ isModalVisible: bool })
    }

    setSettingVisible = (bool) => {
        this.setState({ isSettingVisible: bool })
    }

    setInputText = (text) => {
        this.setState({ inputText: text })
    }

    setInputDate = (text) => {
        this.setState({ inputDate: text })
    }
    setInputTime = (text) => {
        this.setState({ inputTime: text })
    }

    setEditedItem = (id) => {
        this.setState({ editedItem: id })
    }
    handleEditItem = (editedItem) => {
        const newData = this.state.modules.map( item => {
            if (this.getIndex(item.name, this.state.modules) === editedItem ) {
                item.lec = !this.state.disableLecture;
                item.lab = !this.state.disableLab;
                item.tut = !this.state.disableTut;
                item.rec = !this.state.disableRec;
                item.lecTime = this.state.lecTime?this.state.lecTime:0;
                item.tutTime = this.state.tutTime?this.state.tutTime:0;
                item.labTime = this.state.labTime?this.state.labTime:0;
                item.recTime = this.state.recTime?this.state.recTime:0;
                return item
            }
            return item
        })
        this.setState({ modules: newData })
        this.updateDatabase(newData)
    }

    handleDeleteItem = (deletedItem) => {
        Alert.alert('Confirm Delete','Are you sure?',[
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
            },
            { text: "OK", onPress: () => this.deleteNotif(deletedItem) }
        ])
    }

    deleteNotif=(deletedItem)=>{
        let newItems = this.state.notifications.filter((item) => {
            return item != deletedItem
        })
        this.setState({notifications: newItems})
        this.updateDatabase(newItems)
    }

    renderItem = ({item, index}) => (
        <TouchableOpacity
            style={styles.alarmBox}>
            <View style = {styles.alarmContent}>
                <Text style={styles.alarmText}>
                    {item.title} {'\n'}
                    {item.time}
                </Text>
            <TouchableOpacity style = {styles.dismissButton}
                onPress={()=>this.handleDeleteItem(item)}>
                <Text style = {styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )

    modulesList = ({item, index}) => (
        <TouchableOpacity style = {styles.moduleBox}
            onPress={() => {
                this.setSettingVisible(true);
                this.setState({inputTitle: item.name});
                this.setState({editedItem: index});
                this.setState({lecTime: item.lecTime});
                this.setState({tutTime: item.tutTime});
                this.setState({recTime: item.recTime});
                this.setState({labTime: item.labTime});
            }}>
            <Text style = {styles.moduleText}> {item.name} </Text>
        </TouchableOpacity>
    )

    setLec = ({item, index}) => {
        if (index === this.state.editedItem) {
            if (item.lecture !== ''){
                return (
                    <View>
                <Text style = {styles.titleText}>Lecture</Text>
                <View style={styles.notifSet}>
                    <TextInput style = {styles.inputs}
                               onChangeText={(text) => {this.setState({lecTime: text? text:0})}}
                               defaultValue={this.state.lecTime}
                               editable = {true}
                    />
                    <Text> minutes after the session is done</Text>
                </View>
                <CheckBox
                    title='choose not to notify this session'
                    checked={this.state.disableLecture}
                    onPress={() => this.setState({disableLecture: !this.state.disableLecture})}
                />
                    </View>
                )
            }
        }
    }

    setTut = ({item, index}) => {
        if (index === this.state.editedItem) {
            if (item.tutName !== ''){
                return (
                    <View>
                        <Text style = {styles.titleText}>Tutorial</Text>
                        <View style={styles.notifSet}>
                            <TextInput style = {styles.inputs}
                                       onChangeText={(text) => {this.setState({tutTime: text})}}
                                       defaultValue={this.state.tutTime}
                                       editable = {true}
                            />
                            <Text> minutes after the session is done</Text>
                        </View>
                        <CheckBox
                            style = {styles.checkBox}
                            title='choose not to notify this session'
                            checked={this.state.disableTut}
                            onPress={() => this.setState({disableTut: !this.state.disableTut})}
                        />
                    </View>
                )
            }
        }
    }

    setLab = ({item, index}) => {
        if (index === this.state.editedItem) {
            if (item.labName !== ''){
                return (
                    <View>
                        <Text style = {styles.titleText}>Lab</Text>
                        <View style={styles.notifSet}>
                            <TextInput style={styles.inputs}
                                       onChangeText={(text) => {this.setState({labTime: text})}}
                                       defaultValue={this.state.labTime}
                                       editable = {true}
                            />
                            <Text> minutes after the session is done</Text>
                        </View>
                        <CheckBox
                            title='choose not to notify this session'
                            checked={this.state.disableLab}
                            onPress={() => this.setState({disableLab: !this.state.disableLab})}
                        />
                    </View>
                )
            }
        }
    }

    setRec = ({item, index}) => {
        if (index === this.state.editedItem) {
            if (item.recName !== ''){
                return (
                    <View>
                        <Text style = {styles.titleText}>Recitation</Text>
                        <View style={styles.notifSet}>
                            <TextInput style = {styles.inputs}
                                       onChangeText={(text) => {this.setState({recTime: text})}}
                                       defaultValue={this.state.recTime}
                                       editable = {true}
                            />
                            <Text> minutes after the session is done</Text>
                        </View>
                        <CheckBox
                            title='choose not to notify this session'
                            checked={this.state.disableRec}
                            onPress={() => this.setState({disableRec: !this.state.disableRec})}
                        />
                    </View>
                )
            }
        }
    }

    render() {
        const {id} = this.state.route.params
        const {email} = this.state.route.params
        this.TimerNotification
        return (
            <View style = {styles.container}>
                <FlatList
                    data={this.state.notifications}
                    renderItem={this.renderItem}
                />
                <TouchableOpacity onPress={()=>{this.setModalVisible(true);
                this.updateNotifList()}}>
                    <Text style={{color:'#53D3EF'}}>Setting</Text>
                </TouchableOpacity>
                <Modal animationType="fade" visible={this.state.isModalVisible}
                    onRequestClose={() => this.setModalVisible(false)}>
                    <View style={styles.container}>
                        <Text>Choose Module</Text>
                    <FlatList
                        data={this.state.chosenModule}
                        renderItem={this.modulesList}
                    />
                    <TouchableOpacity style={ styles.okButton}
                        onPress={()=>this.setModalVisible(false)}>
                        <Text style = {styles.okText}>OK</Text>
                    </TouchableOpacity>
                    </View>
                </Modal>
                <Modal animationType="fade" visible={this.state.isSettingVisible}
                       onRequestClose={() => this.setSettingVisible(false)}>
                    <View style={styles.container}>
                    <FlatList data={this.state.chosenModule} renderItem={this.setLec}/>
                        <FlatList data={this.state.chosenModule} renderItem={this.setTut}/>
                        <FlatList data={this.state.chosenModule} renderItem={this.setLab}/>
                        <FlatList data={this.state.chosenModule} renderItem={this.setRec}/>
                    <TouchableOpacity style={styles.okButton}
                        onPress={()=>{
                        this.handleEditItem(this.state.editedItem);
                        this.onSubmit(this.state.editedItem)
                        this.setSettingVisible(false)
                    }}>
                        <Text style={styles.okText}>OK</Text>
                    </TouchableOpacity>
                    </View>
                </Modal>
                <NotificationPopup ref={ref => this.popup = ref} />
            </View>
        )
    }

}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        padding: 18,
        marginTop: 25,
        marginBottom: 25
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20
    },
    headerText: {
        width: 200,
        textAlign: 'left',
        fontSize: 16,
        marginTop: 5
    },
    menuButton: {
        width: 40,
        //backgroundColor: 'white',
        flexDirection: 'row'
    },
    alarmBox: {
        width: 375,
        height: 100,
        backgroundColor: '#FBFBFB',
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row'
    },
    alarmText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        paddingHorizontal: 10,
        width: 300
    },
    alarmContent: {
        flexDirection: 'row',
    },
    switchButton: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
    },
    addButton: {
        marginBottom: 30,
        width: 125,
        alignItems: 'flex-start',
        backgroundColor: '#53D3EF',
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginTop: 30
    },
    notifBox: {
        backgroundColor: 'white',
        borderWidth: 0.5,
        padding: 8
    },
    notifTextUnread: {
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        fontSize: 18
    },
    notifTextRead: {
        fontFamily: 'Roboto',
        fontSize: 18
    },
    moduleBox: {
        backgroundColor: '#F3F7F8',
        borderRadius: 5,
        margin: 5
    },
    moduleText: {
        fontSize: 18
    },
    okButton: {
        borderRadius: 5,
        backgroundColor: '#53D3EF',
        alignSelf: 'flex-end',
        width: 60,
        height: 35
    },
    okText: {
        fontSize: 18,
        textAlign: 'center'
    },
    inputs: {
        height: 20,
        width: 35,
        borderColor: 'black',
        borderWidth: 1,
        paddingHorizontal: 5,
        margin: 10,
        borderRadius: 5
    },
    notifSet: {
        flexDirection: 'row',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop:5
    },
    checkBox: {
        marginBottom: 8
    },
    dismissButton: {
        justifyContent: 'center'
    },
    dismissText: {
        color: '#53D3EF'
    }

})
