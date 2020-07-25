import React, { Component } from 'react'
import { Button } from 'react-native-elements'
import { View, Text, TouchableOpacity, Switch, StyleSheet, FlatList, TextInput, Modal, TouchableHighlight, Platform, Alert} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import TimePicker from "react-native-24h-timepicker";
import { Audio } from 'expo-av';
import Expo, { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import NotificationPopup from 'react-native-push-notification-popup';
import firebaseDb from './firebaseDb'

const date = new Date(1598051730000)

class Reminder extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        switchValue:false,
        alarms: [],
        count: 0,
        added: false,
        currTitle: 'x',
        isModalVisible: false,
        inputText: '',
        editedItem: {},
        inputDate: '',
        inputTime: '',
        newTime: '',
        notifOut: false,
        isCalendarVisible: false,
        dateChosen: '',
        show: false,
        mode: 'date',
        chosenModule:[],
        currNotif: [],
        current: '',
        email: this.props.route.params.email,
        id: this.props.route.params.id,
        color: ['#F5CDE6','#FAF8F0', '#CFF5EA','#A7E9E1','#F1E1C9','#CFECF5','#A9E2F5','#72D2E3','#A6EBE7','#FAF8ED','#CAAAF3','#E9687E','#FDC2B1','#FDFAF3','#F7E298']
    }

    onSubmit = (editedItem) => {
        let curr = new Date().getTime()
        let date = moment()
            .utcOffset('+08:00')
            .format(`DD MMM YYYY`)
        let h =  moment()
            .utcOffset('+08:00')
            .format(`HH`)
        let min =  moment()
            .utcOffset('+08:00')
            .format(`mm`)
        let datediff
        let timediff
        let schedule
        console.log(curr)
        for(let x = 0; x<this.state.alarms.length; x++) {
            let item = this.state.alarms[x]
            if (item === editedItem ) {
                datediff = moment(item.alarmDate).diff(date)
                let time = item.alarmTime.split(':')
                let sec = new Date().getSeconds()
                let sch = datediff + (time[0]-h)*3600000 + (time[1]-min)*60000 - sec*1000
                schedule = {
                    time:  curr + sch
                }
                if (item.switch && sch>0) {
                    let currNotif = this.handleSchedule(schedule,item)
                    console.log(currNotif.id)
                    let newData= []
                    console.log(this.state.currNotif.length +'length')
                    for (let x=0; x<this.state.currNotif.length; x++) {
                        if (this.state.currNotif[x].item === item) {
                            newData = this.state.currNotif.map(x => {
                                if (x.item === item) {
                                    x.notif = currNotif;
                                    return x
                                }
                                return x
                            })
                        }
                    }
                    console.log(newData.length)
                    if (newData.length === 0) {
                        this.setState({
                            currNotif: [...this.state.currNotif, {
                                item: item, notif: currNotif
                            }]
                        })
                    } else {
                        this.setState({currNotif:newData})
                    }
                    this.setState({current: item})
                }
            }
        }
    };
    async handleSchedule(schedule,item){
        let currNotif = await Notifications.scheduleLocalNotificationAsync(
            {
                title: item.title,
                body: item.alarmTime,
                data: { test: item.title },
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
            schedule? schedule:{time:curr},
        );
        return currNotif
    }

    rescheduleNotif(){
        let curr = new Date().getTime()
        let date = moment()
            .utcOffset('+08:00')
            .format(`DD MMM YYYY`)
        let h =  moment()
            .utcOffset('+08:00')
            .format(`HH`)
        let min =  moment()
            .utcOffset('+08:00')
            .format(`mm`)
        let datediff
        let timediff
        let schedule
        console.log(curr)
        for(let x = 0; x<this.state.alarms.length; x++) {
            let item = this.state.alarms[x]
            datediff = moment(item.alarmDate).diff(date)
            let sec = new Date().getSeconds()
            console.log(sec)
            let time = item.alarmTime.split(':')
            let sch = datediff + (time[0]-h)*3600000 + (time[1]-min)*60000 - sec*1000
            schedule = {
                time:  curr + sch
            }
            if (item.switch && sch>0) {
                let currNotif = this.handleSchedule(schedule,item)
                console.log(currNotif.id)
                let newData= []
                console.log(this.state.currNotif.length +'length')
                for (let x=0; x<this.state.currNotif.length; x++) {
                    if (this.state.currNotif[x].item === item) {
                        newData = this.state.currNotif.map(x => {
                            if (x.item === item) {
                                x.notif = currNotif;
                                console.log(x)
                                console.log(x.notif)
                                console.log('notif')
                                return x
                            }
                            return x
                        })
                    }
                }
                console.log(newData.length)
                if (newData.length === 0) {
                    this.setState({
                        currNotif: [...this.state.currNotif, {
                            item: item, notif: currNotif
                        }]
                    })
                } else {
                    this.setState({currNotif:newData})
                }
                this.setState({current: item})
            }

        }
    }
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

    showMode = (currentMode) => {
        this.setState({show:true});
        this.setState({mode: currentMode});
    };

    showDatepicker = () => {
        this.showMode('date');
    };

    showTimepicker = () => {
        this.showMode('time');
    };

    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        this.setState({show: Platform.OS === 'ios'});
        this.setState({date:currentDate});
        this.setState({inputTime: currentDate})
    };

    onCancel() {
        this.TimePicker.close();
    }

    onConfirm(hour, minute) {
        this.setState({ inputTime: `${hour}:${minute}` });
        this.TimePicker.close();
    }

    selectDate = (date) => {
        this.setState({dateChosen: date})
    }

    updateAlarmList = () =>{
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data()
            this.setState({alarms: hsl.alarm})
            this.addModule(hsl.alarm, hsl.modules)
            //this.setState({chosenModule: hsl.modules})
        })

    }

    updateDatabase=()=> {
        firebaseDb.firestore().collection('users').doc(this.state.id).update({alarm:this.state.alarms})
    }
    updateDatabase=(item)=> {
        firebaseDb.firestore().collection('users').doc(this.state.id).update({alarm:item})
    }

    addAlarm = () => {
        let res = this.state.alarms
        let col = this.state.color[Math.floor(Math.random()*15)]
        this.setState({
            alarms: [...this.state.alarms, {title: 'Alarm ' + this.state.count.toString(),
                switch: false,
                alarmDate:moment()
                    .utcOffset('+08:00')
                    .format(`DD MMM YYYY`),
                alarmTime: moment()
                    .utcOffset('+08:00')
                    .format(`HH:mm`),
                color: col}]})
        res.push({title: 'Alarm ' + this.state.count.toString(),
            switch: false,
            alarmDate:moment()
                .utcOffset('+08:00')
                .format(`DD MMM YYYY`),
            alarmTime: moment()
                .utcOffset('+08:00')
                .format(`HH:mm`),
            color:col})
        this.setState({count:this.state.count+1})
        this.updateDatabase(res)
    }

    //dummy
    addModule = (alarm,module) => {
        this.setState({alarms:alarm})
        let res = this.state.alarms
        for (let x = 0; x<module.length; x++) {
            if (module[x].exam != 'nil'){
                let col = this.state.color[Math.floor(Math.random()*7)]
                if(this.state.alarms.length === 0 || this.state.alarms.filter((item) => item.title === module[x].name + ' Final Exam').length === 0){
                    this.setState({alarms: [...this.state.alarms, {title: module[x].name + ' Final Exam',
                            switch: false,
                            alarmDate:moment(module[x].exam.Date, 'DD/MM/YYYY').format(`DD MMM YYYY`),
                            alarmTime: moment(module[x].exam.Time,'h:mmA').format('HH:mm'),
                            color: col}]})
                    res.push({title: module[x].name + ' Final Exam',
                        switch: false,
                        alarmDate: moment(module[x].exam.Date, 'DD/MM/YYYY').format(`DD MMM YYYY`),
                        alarmTime: moment(module[x].exam.Time,'h:mmA').format('HH:mm'),
                        color:col})
                }
            }
        }
        this.updateDatabase(res)
    }

    updateModule = () => {
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data()
            this.setState({chosenModule: hsl.modules})})
        for (let x in this.state.chosenModule) {
            if (this.state.alarm.filter((item) => item.title === x.name) === []){
                this.addModule(x)
            }
        }
    }

    getIndex = (value, arr) => {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].title === value) {
                return i;
            }
        }
        return -1;
    }

    setModalVisible = (bool) => {
        this.setState({ isModalVisible: bool })
    }

    setInputText = (text) => {
        this.setState({ inputText: text })
    }

    setInputDate = (text) => {
        this.setState({ inputDate: moment(text).format(`DD MMM YYYY`) })
    }
    setInputTime = (text) => {
        this.setState({ inputTime: text })
    }

    setEditedItem = (id) => {
        this.setState({ editedItem: id })
    }

    showCalendar = (bool) => {
        this.setState({isCalendarVisible: bool})
    }

    setSwitchValue = (val, editItem) => {
        const newData = this.state.alarms.map( item => {
            if (item === editItem ) {
                item.switch = val
                if (val === true) {
                    this.onSubmit(item)
                }
                return item
            }
            return item
        })
        this.setState({ alarms: newData });
        this.updateDatabase(newData)
        this.cancelNotif()
    }


    handleEditItem = (editedItem) => {
        const newData = this.state.alarms.map( item => {
            if (item === editedItem ) {
                item.title = this.state.inputText;
                item.alarmDate = this.state.inputDate;
                item.alarmTime = this.state.inputTime;
                return item
            }
            return item
        })
        for (let x = 0; x<this.state.currNotif.length;x++){
            let curr = this.state.currNotif[x]
            if (curr.item === editedItem){
                this.cancelNotif()
                //this.onSubmit(editedItem)
            }
        }
        this.setState({alarms:newData})
        //this.setState({currNotif:newItems})
        this.updateDatabase(newData)
    }

    async cancelNotif() {
        //await Notifications.cancelScheduledNotificationAsync(curr.notif)
        await Notifications.cancelAllScheduledNotificationsAsync()
        this.rescheduleNotif()
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
        let newItems = this.state.alarms.filter((item) => {
            return item != deletedItem
        })
        this.setState({alarms: newItems})
        this.updateDatabase(newItems)
    }

    renderItem = ({item, index}) => (
        <TouchableOpacity
            onPress={() => {this.setModalVisible(true);
                this.setInputText(item.title);
                this.setInputDate(item.alarmDate);
                this.setInputTime(item.alarmTime);
                this.setEditedItem(item)}}
            underlayColor={'#f1f1f1'}
            style={[styles.alarmBox,{backgroundColor: item.color}]}>
            <View style = {styles.alarmContent}>
                <Text style={styles.alarmText}>
                    {item.title} {'\n'}
                    {item.alarmDate} {'\n'}
                    {item.alarmTime} {'\n'}
                </Text>

                <Switch
                    style = {styles.switchButton}
                    trackColor={{ false: "#767577", true: "#85C5E0" }}
                    thumbColor={item.switch ? "#38ADEF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) => this.setSwitchValue(value, item)}
                    value={item.switch}
                />
                <TouchableOpacity style = {styles.deleteMenu}
                                  onPress={() => {this.handleDeleteItem(item)}}>
                    <Ionicons name={"ios-trash"} size={30}/>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )

    chooseDate = () => {
        this.showCalendar(true);
    }

    componentDidMount() {
        this.updateAlarmList()
        this.listener = Notifications.addListener(this.handleNotif);
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }


    handleNotif = ({ origin, data }) => {
        console.log(
            `Push notification ${origin} with data: ${JSON.stringify(data)}`,
        );
        this.playMusic()

    };

    async playMusic(){
        let date = moment()
            .utcOffset('+08:00')
            .format(`DD MMM YYYY`)
        let time = moment()
            .utcOffset('+08:00')
            .format(`HH:mm`)
        //for (let x = 0; x < this.state.alarms.length; x++) {
        //  if (this.state.alarms[x].alarmDate === date && this.state.alarms[x].alarmTime === time && this.state.alarms[x].switch === true) {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: true,
            useNativeControls: false
        })
        const playbackObject = Audio.Sound.createAsync(
            require('../assets/alarm-bell.mp3'),
            {shouldPlay: true}
        );
        this.popup.show({
            onPress: function() {console.log('Pressed')},
            appTitle: 'PlanSyek',
            timeText: 'Now',
            title: this.state.current.title,
            body: this.state.current.body,
            slideOutTime: 10000
        });
        //await playbackObject.setAudioMode({playsInSilentModeIOS:true, staysActiveInBackground: true, interruptionModeIOS:1, interruptionModeAndroid: 1})
        await playbackObject.playAsync();
        //}
        //}

    }


    render() {
        let isDeleted = false
        this.TimerNotification
        return (
            <View style = {styles.container}>

                <FlatList
                    data={this.state.alarms}
                    keyExtractor={(item) => item.title}
                    renderItem={this.renderItem}
                />
                <Modal animationType="fade" visible={this.state.isModalVisible}
                       onRequestClose={() => this.setModalVisible(false)}>
                    <View style={styles.modalView}>
                        <Text style={styles.text}>Title:</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => {this.setState({inputText: text})}}
                            defaultValue={this.state.inputText}
                            editable = {true}
                            multiline = {false}
                            maxLength = {200}
                        />
                        <Text style={styles.text}>Date:</Text>
                        <TouchableOpacity style={styles.chooseButton}
                            onPress={() => this.chooseDate()}>
                            <Text>Choose Date</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => {this.setState({inputDate: text}); }}
                            defaultValue={this.state.inputDate}
                            editable = {false}
                            multiline = {false}
                            maxLength = {200}
                        />
                        <Text style={styles.text}>Time:</Text>
                        <TouchableOpacity style={styles.chooseButton}
                            onPress={() => this.TimePicker.open()}>
                            <Text>Choose Time</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => {this.setState({inputTime: text});}}
                            defaultValue={this.state.inputTime}
                            editable = {false}
                            multiline = {false}
                            maxLength = {200}
                        />
                        <TouchableHighlight
                            onPress={() => {
                                this.handleEditItem(this.state.editedItem);
                                this.setModalVisible(false)
                            }}
                            style={styles.saveChange} underlayColor={'#f1f1f1'}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>
                <Modal animationType="fade" visible={this.state.isCalendarVisible}
                       onRequestClose={() => this.showCalendar(false)}>
                    <View style={styles.modalView}>
                        <Text style={{fontSize:20, textAlign:'center', marginBottom:30}}>Choose Date:</Text>
                        <Calendar
                            style={{
                                height: 375,
                                width: 350,
                                backgroundColor:'#FAF8ED'
                            }}
                            onDayPress={(day) => {
                                this.selectDate(day.dateString)
                            }}
                            markedDates={{
                                [this.state.dateChosen]: {selected: true}
                            }}
                        >
                        </Calendar>
                        <TouchableOpacity style={{backgroundColor:'#53D3EF', borderRadius:5,padding:8, marginTop:10}}
                            onPress={() => {
                                this.showCalendar(false);
                                this.setInputDate(this.state.dateChosen)
                            }}>
                            <Text>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <TimePicker
                    ref={ref => {
                        this.TimePicker = ref;
                    }}
                    onCancel={() => this.onCancel()}
                    onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
                />
                <View style={styles.tombolAdd}>
                        <TouchableOpacity style= {styles.addButton}
                            onPress={() => {
                                this.updateAlarmList();
                                isDeleted = false
                            }}>
                            <Text style={styles.addText}>+ Add {'\n'} My Module</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style= {styles.addButton}
                            onPress={() => {
                                this.addAlarm();
                                isDeleted = false
                            }}>
                        <Text style={styles.addText}>+ Add New</Text>
                        </TouchableOpacity>
                </View>
                <NotificationPopup ref={ref => this.popup = ref} />
            </View>
        )
    }

}

export default Reminder

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        padding: 18,
        //paddingTop: 35,
        //backgroundColor: '#ffffff',
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
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    alarmBox: {
        width: 375,
        height: 100,
        //backgroundColor: '#C4C4C4',
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row'
    },
    alarmText: {
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        //backgroundColor: '#C4C4C4',
        paddingHorizontal: 10,
        width: 270
    },
    switchButton: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
    },
    addButton: {
        marginBottom: 10,
        width: 125,
        //alignItems: 'flex-start',
        backgroundColor: '#53D3EF',
        borderRadius: 5,
        marginTop: 30,
        marginRight: 30,
        marginLeft: 30,
        height: 55,
        textAlign: 'center',
        justifyContent:'center'
    },
    tombolAdd: {
        flexDirection:'row',
    },
    textInput: {
        width: '80%',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 30,
        marginTop: 15,
        borderColor: 'gray',
        borderBottomWidth: 2,
        fontSize: 16,
    },
    modalView: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveChange: {
        backgroundColor: '#53D3EF',
        marginVertical: 10,
        alignSelf: 'center',
        alignItems: 'center',
        width: 70,
        height: 30,
    },
    saveText: {
        fontSize: 18
    },
    alarmContent: {
        flexDirection: 'row',
    },
    deleteMenu: {
        justifyContent: 'center',
        width: 30,
        marginLeft: 20
    },
    chooseButton:{
        backgroundColor:'#F8D38B',
        borderRadius:5
    },
    addText: {
        fontSize: 16,
        textAlign:'center'
    }
})
