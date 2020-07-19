import React, {Component, useContext} from 'react'
import { Button } from 'react-native-elements'
import { View, Text, TouchableOpacity, StyleSheet, FlatList,SafeAreaView} from 'react-native'
import moment from 'moment'
import {useNavigation, useRoute} from "@react-navigation/native";
import firebaseDb from './firebaseDb'
import { Ionicons } from '@expo/vector-icons';

console.disableYellowBox = true;

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {navigation: this.props.navigation,
            route: this.props.route,
            notif: this.props.route.params?.notif,
            agenda: this.props.route.params?.agenda,
            email: this.props.route.params.email,
            id: this.props.route.params.id,
            //notif: [{title:'CS1010S Rec', time: "29 Jun 2020 19:46", lec:true, lab: true, tut: true, rec:true},
            //    {title:'MA1101R Lecture', time: "30 Jun 2020 12:00", lec:true, lab: true, tut: true, rec:true}],
            schedule: [{data:
                    [{duration: "1h",
                        hour:"1500",
                        schedule:{
                            ClassNo:"01",
                            DayText:"Monday",
                            EndTime:"1600",
                            LessonType:"Tutorial",
                            StartTime: "1500",
                            Venue:"AS3-0620",
                            WeekText:"Every Week",
                            title: "CS1010S Tutorial"}},
                        {duration: "1h",
                            hour:"1200",
                            schedule:{
                                ClassNo:"01",
                                DayText:"Monday",
                                EndTime:"1300",
                                LessonType:"Tutorial",
                                StartTime: "1200",
                                Venue:"AS3-0620",
                                WeekText:"Every Week",
                                title: "MA1101R Tutorial"}}],
                title: moment()
                    .utcOffset('+08:00')
                    .format(`YYYY-MM-DD`)}],
            //schedule: [],
            data:'',
            user:'',
            try: ''}
    }

    renderItem = ({item}) => (
        <TouchableOpacity style = {styles.toBox}
            onPress={()=>this.state.navigation.navigate('Notification')}>
            <Text>
                {item.title} {'\n'}
                {item.time}
            </Text>
        </TouchableOpacity>
    )

    betweenDuration = (item) => {
        let startTime = item.schedule.StartTime
        let startHour = startTime.slice(0,2)
        let startMin = startTime.slice(2,4)
        let endTime = item.schedule.EndTime
        let endHour = endTime.slice(0,2)
        let endMin = endTime.slice(2,4)
        let currHour = moment()
            .utcOffset('+08:00')
            .format(`HH`);
        let currMin = moment()
            .utcOffset('+08:00')
            .format(`mm`);
        console.log(startHour)
        return (currHour-startHour)*60+currMin-startMin>=0&&(endHour-currHour)*60+endMin-currMin>=0
    }

    schList = ({item}) => (
        <TouchableOpacity style = {this.betweenDuration(item)?styles.scheduleBoxChosen:styles.scheduleBox}
            onPress={()=>this.state.navigation.navigate('Schedule')}>
            <Text  style={styles.scheduleText}>
                {item.schedule.title} {item.schedule.ClassNo}{'\n'}
                {item.schedule.StartTime} {'-'}{item.schedule.EndTime}
            </Text>
        </TouchableOpacity>
    )

    updateItem = () => {
        console.log(this.state.id)
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data().notif
            this.setState({notif: hsl})
            this.addNotif(hsl)
        })
    }

    updateSch = () => {
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data().schedule
            this.setState({schedule: hsl})
            this.addSch(hsl)
        })
    }

    addNotif=(notif)=>{
        this.setState({notif:notif})
    }
    addSch=(sch)=>{
        let hsl
        let date = moment()
            .utcOffset('+08:00')
            .format(`YYYY-MM-DD`);
        for (let x=0; x<sch.length;x++){
            let curr = sch[x]
            if (curr.title === date){
                hsl = curr.data
            }
        }
        this.setState({agenda:hsl})
    }

    componentDidMount() {
        this.updateItem()
        this.updateSch()
        this.addNotif(this.state.notif)
        //this.addSch(this.state.agenda)
        //this.addSch(this.state.schedule)
    }

    render () {
        let date = moment()
            .utcOffset('+08:00')
            .format(`DD MMM YYYY`);
        let currTime = moment()
            .utcOffset('+08:00')
            .format(`HH:mm`);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let day = new Date();
        let dayName = days[day.getDay()];
        return (
            <View style = {styles.container}>
                <View style={styles.dateBox}>
                    <Text style = {styles.dateText}>{dayName}, {date}</Text>
                    <Text style = {styles.timeText}>{currTime}</Text>
                </View>
                <SafeAreaView style = {styles.scheduleContainer}>
                    <Text style = {styles.titleText}>Today Schedule</Text>
                    <FlatList
                        data={this.state.agenda}
                        renderItem={this.schList}
                    />
                    <TouchableOpacity
                        onPress={()=>this.state.navigation.navigate('TravelPlan')}>
                        <Text style={styles.travelText}>How to go there?</Text>
                    </TouchableOpacity>
                </SafeAreaView>
                <SafeAreaView style = {styles.scheduleContainer}>
                    <Text style = {styles.titleText}>Notifications</Text>
                    <FlatList
                        data={this.state.notif}
                        renderItem={this.renderItem}
                    />
                    <TouchableOpacity onPress={()=>this.updateItem()}>
                        <Text>Refresh</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 0.9,
        padding: 18,
        //paddingTop: 35,
        //backgroundColor: '#ffffff',
        marginTop: 25,
        marginBottom: 25,
    },
    text: {
        position: 'absolute',
        width: 122,
        height: 61,
        fontFamily: 'Roboto',
        fontSize: 18,
        alignSelf: 'center',
        color: 'white',
        marginTop: 100,
        paddingHorizontal: 5,
        textAlign: 'center'
    },
    menuButton: {
        width: 40,
    },
    headerText: {
        width: 300,
        textAlign: 'left',
        fontSize: 16,
        marginTop: 5
    },
    timeText: {
        fontSize:20,
        fontFamily: 'Roboto',
        textAlign: 'center'
    },
    dateText: {
        fontSize:28,
        fontFamily: 'Roboto',
        textAlign: 'center'
    },
    scheduleContainer: {
        marginTop: 30,
        //marginBottom: 10,
        flex: 1
    },
    titleText: {
        fontSize: 20
    },
    contentText: {
        fontSize:16
    },
    travelText: {
        color: '#53D3EF'
    },
    toBox: {
        backgroundColor: '#F8D38B',
        margin: 5,
        padding: 8,
        borderRadius: 5
    },
    dateBox: {
        backgroundColor:'#B5FDF9',
        borderRadius: 5,
    },
    scheduleBox: {
        flexDirection: 'row',
        padding:8,
        borderRadius:5,
        backgroundColor:'#FBFBFB',
    },
    scheduleBoxChosen:{
        flexDirection: 'row',
        backgroundColor:'#A9E9F8',
        borderRadius: 5,
        padding: 8,
        alignItems:'stretch'
    },
    scheduleText: {
        fontSize: 14,
        //marginRight: 170,
        width:320
    },
    navigation: {
        alignSelf: 'center',
        width:20,
        //flexDirection:'row-reverse'
    }
})
