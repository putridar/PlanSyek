import _ from 'lodash';
import React, {Component} from 'react';
import {
    Platform,
    Alert,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Button,
    Modal
} from 'react-native';
import SearchableDropdown from "react-native-searchable-dropdown";
import { useNavigation, useRoute } from '@react-navigation/native';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import firebaseDb from "./firebaseDb";
import Class from "../Classes.json"
import BusStop from "../BusStop.json"

const testIDs = require('../testIDs');


const today = new Date().toISOString().split('T')[0];
const fastDate = getPastDate(3);
//const dates = [fastDate, today].concat(futureDates);
const themeColor = '#00AAAF';
const lightThemeColor = '#EBF9F9';
const moment = require('moment');
const first = moment('2020-08-03')

function getPastDate(days) {
    return new Date(Date.now() - (864e5 * days)).toISOString().split('T')[0];
}

function getDateIndex(day) {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for (let x = 0; x<days.length; x++) {
        if (days[x] === day ){
            return x + 1
        }
    }
    return -1
}


export default class ExpandCalendar extends Component {
    constructor(props) {
        super(props)
        this.state = {navigation: this.props.navigation,
            route: this.props.route,
            isModalVisible: false,
            locTo: '',
            locFrom: '',
            theWay: '',
            test: this.props.route.params?.test,
            modules: this.props.route.params?.modules,
            email: this.props.route.params.email,
            id: this.props.route.params.id,
            BusData: BusStop[0].Stops,
            schedule: [{data:
                    [{duration: "1h",
                        hour:"1500",
                        schedule:{
                            ClassNo:"01",
                            DayText:"Wednesday",
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
                                DayText:"Wednesday",
                                EndTime:"1300",
                                LessonType:"Tutorial",
                                StartTime: "1200",
                                Venue:"AS3-0620",
                                WeekText:"Every Week",
                                title: "MA1101R Tutorial"}}],
                title: moment()
                    .utcOffset('+08:00')
                    .format(`YYYY-MM-DD`)}],
            try: ''}
    }

    handleTravelCal = (locFrom, locTo) => {
        let itemFrom = this.state.BusData.filter((item) => {
            return item.Classes.includes(locFrom)
        })
        let itemTo = this.state.BusData.filter((item) => {
            return item.Classes.includes(locTo)
        })
        let busStopFrom
        let busStopTo
        let BusChosen = ''
        for (let i = 0; i < itemTo.length; i++){
            for (let j=0; j < itemFrom.length; j++){
                if (itemFrom[j].Possible.includes(itemTo[i].name)){
                    busStopFrom = itemFrom[j]
                    busStopTo = itemTo[i]
                    break
                }
                else if (itemFrom[j].name === itemTo[i].name){
                    this.setTheWay("Same location / building!")
                }
            }
        }
        if (busStopFrom != null){
            console.log(busStopFrom.Bus)
            if (busStopFrom.Bus[0].A1.includes(busStopTo.name)){
                BusChosen+="A1, "
            }
            if (busStopFrom.Bus[0].A2.includes(busStopTo.name)){
                BusChosen+="A2, "
            }
            if (busStopFrom.Bus[0].B1.includes(busStopTo.name)){
                BusChosen+="B1, "
            }
            if (busStopFrom.Bus[0].B2.includes(busStopTo.name)){
                BusChosen+="B2, "
            }
            if (busStopFrom.Bus[0].C.includes(busStopTo.name)){
                BusChosen+="C, "
            }
            if (busStopFrom.Bus[0].D1.includes(busStopTo.name)){
                BusChosen+="D1, "
            }
            if (busStopFrom.Bus[0].D2.includes(busStopTo.name)){
                BusChosen+="D2, "
            }
            if (busStopFrom.Bus[0].BTC1.includes(busStopTo.name)){
                BusChosen+="BTC1, "
            }
            if (busStopFrom.Bus[0].BTC2.includes(busStopTo.name)){
                BusChosen+="BTC2, "
            }
            if (busStopFrom.Bus[0].A1E.includes(busStopTo.name)){
                BusChosen+="A1E, "
            }
            if (busStopFrom.Bus[0].A2E.includes(busStopTo.name)){
                BusChosen+="A2E, "
            }
            if (busStopFrom.Bus[0].AV1.includes(busStopTo.name)){
                BusChosen+="AV1, "
            }
            if ((busStopFrom != '') && (busStopTo != '') && (BusChosen != '')) {
                this.setTheWay("You can take bus " + BusChosen + " from " + busStopFrom.name + " to " + busStopTo.name + ' to get to ' + this.state.locTo)
            }
        }
    }

    setTheWay = (TheWay) => {
        this.setState({ theWay: TheWay })
    }

    onDateChanged = (/* date, updateSource */) => {
        // console.warn('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
        // fetch and set data for date + week ahead
    }

    onMonthChange = (/* month, updateSource */) => {
        // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
    }

    setLocTo = (locTo) => {
        this.setState({ locTo: locTo })
    }

    setLocFrom = (locFrom) => {
        this.setState({ locFrom: locFrom })
    }

    buttonPressed = (title, sch) => {
        Alert.alert(title,sch.Venue,[
            {
                text: "How to go there?",
                onPress: () => {
                    this.setLocTo(sch.Venue)
                    this.setModalVisible(true)}
            },
            { text: "OK", onPress: () => console.log('ok')}
        ]);
    }

    searchRoute = (locTo) => {

    }

    setModalVisible = (bool) => {
        this.setState({ isModalVisible: bool })
    }

    itemPressed(id) {
        Alert.alert(id);
    }

    dateDiff = (time1, time2)=> {

        let diff = time2-time1
        let hour = Math.floor(diff/100);
        let min = diff%100;
        if (min === 0) {
            return hour.toString() + 'h'
        } else if (hour === 0) {
            return min.toString() +'m'
        } else {
            return hour.toString() +'h' + min.toString()+'m'
        }

    }

    updateDatabase=(sch)=> {
        firebaseDb.firestore().collection('users').doc(this.state.id).update({schedule:sch})
    }

    getFutureDates(week,modules) {
        const array = [];
        for (let x = 0; x < modules.length; x++) {
            if (modules[x].lecture.WeekText === 'Every Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.lecture.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.lecture, module:mod.name});
                }
            } else if (modules[x].lecture.WeekText === 'Odd Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.lecture.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7*2, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.lecture, module:mod.name});
                }
            } else if (modules[x].lecture.WeekText === 'Even Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.lecture.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7*2 + 7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.lecture, module:mod.name});
                }
            } else if(modules[x].lecture.WeekText) {
                let weeks = modules[x].lecture.WeekText.split(",")
                for (let index = 0; index < weeks.length; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.lecture.DayText;
                    const date = firstDate.add(getDateIndex(day)+weeks[index]*7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.lecture, module:mod.name});
                }
            }
            if (modules[x].tutorial.WeekText === 'Every Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.tutorial.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.tutorial, module:mod.name});
                }
            } else if (modules[x].tutorial.WeekText === 'Odd Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.tutorial.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7*2, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.tutorial, module:mod.name});
                }
            } else if (modules[x].tutorial.WeekText === 'Even Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.tutorial.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7*2 + 7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.tutorial, module:mod.name});
                }
            } else if(modules[x].tutorial.WeekText) {
                let weeks = modules[x].tutorial.WeekText.split(",")
                for (let index = 0; index < weeks.length; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.tutorial.DayText;
                    const date = firstDate.add(getDateIndex(day)+weeks[index]*7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.tutorial, module:mod.name});
                }
            }
            if (modules[x].lab.WeekText === 'Every Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.lab.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.lab, module:mod.name});
                }
            } else if (modules[x].lab.WeekText === 'Odd Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.lab.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7*2, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.lab, module:mod.name});
                }
            } else if (modules[x].lab.WeekText === 'Even Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.lab.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7*2 + 7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.lab, module:mod.name});
                }
            } else if(modules[x].lab.WeekText) {
                let weeks = modules[x].lab.WeekText.split(",")
                for (let index = 0; index < weeks.length; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.lab.DayText;
                    const date = firstDate.add(getDateIndex(day)+weeks[index]*7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.lab, module:mod.name});
                }
            }
            if (modules[x].recitation.WeekText === 'Every Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.recitation.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.recitation, module:mod.name});
                }
            } else if (modules[x].recitation.WeekText === 'Odd Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.recitation.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7*2, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.recitation, module:mod.name});
                }
            } else if (modules[x].recitation.WeekText === 'Even Week') {
                for (let index = 0; index <= week; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.recitation.DayText;
                    const date = firstDate.add(getDateIndex(day)+index*7*2 + 7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.recitation, module:mod.name});
                }
            } else if(modules[x].recitation.WeekText) {
                let weeks = modules[x].recitation.WeekText.split(",")
                for (let index = 0; index < weeks.length; index++) {
                    let firstDate = moment('2020-08-03')
                    const mod = modules[x]
                    const day = mod.recitation.DayText;
                    const date = firstDate.add(getDateIndex(day)+weeks[index]*7, "days"); // 864e5 == 86400000 == 24*60*60*1000
                    const dateString = date.toISOString().split('T')[0];
                    array.push({date:dateString, type:mod.recitation, module:mod.name});
                }
            }
        }
        let sch = [{data:
                [{duration: "1h",
                    hour:"1500",
                    title: "CS1010S Tutorial",
                    schedule:{
                        ClassNo:"01",
                        DayText:"Wednesday",
                        EndTime:"1600",
                        LessonType:"Tutorial",
                        StartTime: "1500",
                        Venue:"AS3-0620",
                        WeekText:"Every Week",
                        title: "CS1010S Tutorial"}},
                    {duration: "1h",
                        hour:"1200",
                        title: "MA1101R Tutorial",
                        schedule:{
                            ClassNo:"01",
                            DayText:"Wednesday",
                            EndTime:"1300",
                            LessonType:"Tutorial",
                            StartTime: "1200",
                            Venue:"AS3-0620",
                            WeekText:"Every Week",
                            title: "MA1101R Tutorial"}}],
            title: moment()
                .utcOffset('+08:00')
                .format(`YYYY-MM-DD`)}]
        for (let y = 0; y <array.length; y++){
            let updated = false
            for (let z = 0; z<sch.length; z++) {
                if (sch[z].title === array[y].date) {
                    let mod = array[y]
                    sch[z].data.push({hour: mod.type.StartTime,
                        duration: this.dateDiff(mod.type.StartTime,mod.type.EndTime),
                        title: mod.module + ' '+mod.type.LessonType,
                        schedule: mod.type})
                    updated = true
                }
            }
            if (!updated) {
                let mod = array[y]
                let data = {
                    title: mod.date,
                    data: [{
                        hour: mod.type.StartTime,
                        duration: this.dateDiff(mod.type.StartTime, mod.type.EndTime),
                        title: mod.module +' ' + mod.type.LessonType,
                        schedule: mod.type
                    }]
                }
                sch.push(data)
            }
        }
        sch.sort((a,b)=>a.title>b.title?1:-1)
        sch.map((item)=>item.data.sort((a,b) => a.hour>b.hour? 1:-1))
        this.setState({schedule:sch});
        this.updateDatabase(sch)
    }

    updateScheduleList = () =>{
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data()
            if (hsl.length !== 0)
                this.setState({schedule: hsl.schedule})
        })
    }

    updateModule = () => {
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data()
            this.setState({modules: hsl.modules})
        this.getFutureDates(13,hsl.modules)})
    }

    componentDidMount() {
        this.updateScheduleList()
            this.updateModule()
            //this.getFutureDates(13, this.state.modules)
    }

    renderEmptyItem() {
        return (
            <View style={styles.emptyItem}>
                <Text style={styles.emptyItemText}>No Events Planned</Text>
            </View>
        );
    }

    renderItem = ({item}) => {
        if (_.isEmpty(item)) {
            return this.renderEmptyItem();
        }

        return (
            <TouchableOpacity
                onPress={() => this.itemPressed(item.title)}
                style={styles.item}
            >
                <View>
                    <Text style={styles.itemHourText}>{item.hour}</Text>
                    <Text style={styles.itemDurationText}>{item.duration}</Text>
                </View>
                <Text style={styles.itemTitleText}>{item.title}</Text>
                <View style={styles.itemButtonContainer}>
                    <Button color={'grey'} title={'Info'} onPress={()=>this.buttonPressed(item.title,item.schedule)}/>
                </View>
            </TouchableOpacity>
        );
    }

    getMarkedDates = () => {
        const marked = {};
        this.state.schedule.forEach(item => {
            if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
                marked[item.title] = {marked: true};
            }
        });
        return marked;
    }

    getTheme = () => {
        const disabledColor = 'grey';

        return {
            // arrows
            arrowColor: 'black',
            arrowStyle: {padding: 0},
            // month
            monthTextColor: 'black',
            textMonthFontSize: 16,
            textMonthFontFamily: 'HelveticaNeue',
            textMonthFontWeight: 'bold',
            // day names
            textSectionTitleColor: 'black',
            textDayHeaderFontSize: 12,
            textDayHeaderFontFamily: 'HelveticaNeue',
            textDayHeaderFontWeight: 'normal',
            // dates
            dayTextColor: themeColor,
            textDayFontSize: 18,
            textDayFontFamily: 'HelveticaNeue',
            textDayFontWeight: '500',
            textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
            // selected date
            selectedDayBackgroundColor: themeColor,
            selectedDayTextColor: 'white',
            // disabled date
            textDisabledColor: disabledColor,
            // dot (marked date)
            dotColor: themeColor,
            selectedDotColor: 'white',
            disabledDotColor: disabledColor,
            dotStyle: {marginTop: -2}
        };
    }


    render() {
        const {modules} = this.state.route.params;
        return (
            <View style = {styles.container}>
                <CalendarProvider
                    date={this.state.schedule[0]?.title}
                    onDateChanged={this.onDateChanged}
                    onMonthChange={this.onMonthChange}
                    showTodayButton
                    disabledOpacity={0.6}
                >
                    {this.props.weekView ?
                        <WeekCalendar
                            testID={testIDs.weekCalendar.CONTAINER}
                            firstDay={1}
                            markedDates={this.getMarkedDates()}
                        /> :
                        <ExpandableCalendar
                            testID={testIDs.expandableCalendar.CONTAINER}
                            firstDay={1}
                            markedDates={this.getMarkedDates()}
                        />
                    }
                    <AgendaList
                        sections={this.state.schedule}
                        extraData={this.state}
                        renderItem={this.renderItem}
                    />
                </CalendarProvider>
                <TouchableOpacity style={styles.addButton}
                                  onPress={() => this.state.navigation.navigate('Add Module')}>
                    <Text style={styles.addText}>+ Add Modules</Text>
                </TouchableOpacity>
                {/*<Text>{test}</Text>*/}
                <Modal animationType="fade" visible={this.state.isModalVisible}
                       onRequestClose={() => this.setModalVisible(false)}>
                    <View style={styles.modalView}>
                        <Text style={{textAlign: 'center', fontSize:20}}>Navigate to {this.state.locTo}</Text>
                        <Text style={styles.titleText}>Where are you from?</Text>
                        <SearchableDropdown
                            onTextChange={text => console.log(text)}
                            onItemSelect={item => {this.setLocFrom(item.name)}}
                            containerStyle={{ padding: 5 }}
                            textInputStyle={{
                                padding: 12,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                backgroundColor: '#FAF7F6',
                            }}
                            itemStyle={{
                                padding: 10,
                                marginTop: 2,
                                backgroundColor: '#FAF9F8',
                                borderColor: '#bbb',
                                borderWidth: 1,
                            }}
                            itemTextStyle={{
                                color: '#222',
                            }}
                            itemsContainerStyle={{
                                maxHeight: '60%',
                            }}
                            items={Class}
                            placeholder="Search Class"
                            resetValue={false}
                            underlineColorAndroid="transparent"
                        />
                        <Text style = {styles.resultText}>{this.state.theWay}</Text>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style ={styles.editButton}
                                              onPress={()=>{
                                                  this.handleTravelCal(this.state.locFrom, this.state.locTo)
                                              }}>
                                <Text style={{textAlign:'center'}}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style ={styles.deleteButton}
                                              onPress={()=>{
                                                  this.setModalVisible(false)
                                                  this.setTheWay('')
                                              }}>
                                <Text style={{textAlign:'center'}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        //marginTop: 40
    },
    calendar: {
        paddingLeft: 20,
        paddingRight: 20
    },
    section: {
        backgroundColor: lightThemeColor,
        color: 'grey',
        textTransform: 'capitalize'
    },
    item: {
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        flexDirection: 'row'
    },
    itemHourText: {
        color: 'black'
    },
    itemDurationText: {
        color: 'grey',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4
    },
    itemTitleText: {
        color: 'black',
        marginLeft: 16,
        fontWeight: 'bold',
        fontSize: 16
    },
    itemButtonContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    emptyItem: {
        paddingLeft: 20,
        height: 52,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    emptyItemText: {
        color: 'lightgrey',
        fontSize: 14
    },
    addButton: {
        marginBottom: 5,
        width: 350,
        alignItems: 'flex-start',
        backgroundColor: '#53D3EF',
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 20,
        height: 35,
    },
    addText: {
        alignSelf: 'center',
        marginTop: 8,
        fontSize: 18
    },
    modalView: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor:'#53D3EF',
        borderRadius: 5,
        height: 30,
        width: 60,
        marginRight: 220,
        marginLeft: 30,
        marginBottom:8
    },
    deleteButton:{
        backgroundColor:'#53D3EF',
        borderRadius: 5,
        alignSelf: 'flex-end',
        height: 30,
        width: 60,
        marginBottom:8
    },
    resultText: {
        textAlign: 'center',
        fontSize: 16,
        width: 400,
        height: 100,
        marginTop: 30,
        flexWrap: 'wrap'
    },
    titleText: {
        width: 170,
        height: 25,
        textAlign: 'center',
        marginTop: 25,
        marginBottom: 10,
        fontSize: 16,
        marginLeft: 10
    },
});

