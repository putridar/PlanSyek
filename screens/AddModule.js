import React, { Component } from 'react'
import { Button, SearchBar  } from 'react-native-elements'
import SearchableDropdown from "react-native-searchable-dropdown";
import {View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, SafeAreaView,ScrollView, Alert} from 'react-native'
import moment from 'moment'
import firebaseDb from "./firebaseDb";
import Expand from 'react-native-simple-expand';

class AddModule extends Component {

    state = {
        navigation: this.props.navigation,
        email: this.props.route.params.email,
        id: this.props.route.params.id,
        searchModule: '',
        modules: [],
        timetable: [],
        isModalVisible: false,
        editedItem: '',
        inputModule: '',
        inputLecture: '',
        inputTutorial: '',
        inputLab: '',
        inputRec: '',
        openLec: false,
        openTut: false,
        openLab: false,
        openRec: false,
        chosenModule: [],
        currID: 0,
        updated: false,
        exams: [],
        color: ['#F5CDE6','#FAF8F0', '#CFF5EA','#A7E9E1','#F1E1C9','#CFECF5','#A9E2F5','#72D2E3','#A6EBE7','#FAF8ED','#CAAAF3','#E9687E','#FDC2B1','#FDFAF3','#F7E298']
    }

    updateDatabase=()=> {
        firebaseDb.firestore().collection('users').doc(this.state.id).update({modules:this.state.chosenModule})
    }

    componentDidMount() {
        Promise.all([
            fetch('https://api.nusmods.com/2018-2019/2/timetable.json'),
            fetch('https://api.nusmods.com/2018-2019/2/examTimetableRaw.json')
        ])
            .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
            .then(async ([res1, res2]) => {
                //Successful response from the API Call
                var result = [];
                var counter = 0;

                res1.map(el => {
                    var parseMod = {};
                    parseMod['id'] = counter;
                    parseMod['name'] = el['ModuleCode'];
                    parseMod['schedule'] = el['Timetable'];
                    var curr = res2.filter((item) => {return item.ModuleCode === el['ModuleCode']})
                    if (curr[0]){
                        parseMod['exam'] = curr[0];
                    }
                    else{
                        parseMod['exam'] = 'nil';
                    }
                    counter++;
                    result.push(parseMod)
                });

                this.setState({
                    modules: result,
                    //adding the new data in Data Source of the SearchableDropdown
                });
            })
            .catch(error => {
                console.error(error);
            });
        this.updateItem()
    }

    searchData(text) {
        const newData = this.arrayholder.filter(item => {
            const itemData = item.ModuleCode.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1
        });

        this.setState({
            data: newData,
            text: text
        })
    }

    updateSearchModule= searchModule => {
        this.setState({ searchModule });
    }

    setModalVisible = (bool) => {
        this.setState({ isModalVisible: bool })
    }

    updateItem = () => {
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data()
            this.setState({chosenModule: hsl.modules})})
    }

    updateDatabase=()=> {
        firebaseDb.firestore().collection('users').doc(this.state.id).update({modules:this.state.chosenModule})
    }

    updateDatabase=(item)=> {
        firebaseDb.firestore().collection('users').doc(this.state.id).update({modules:item})
    }

    addModule = (module) => {
        let res = this.state.chosenModule
        let col = this.state.color[Math.floor(Math.random()*15)]
        this.setState({
            chosenModule: [...this.state.chosenModule, {
                newID: this.state.currID,
                name: module.name,
                schedule: module.schedule,
                lecture: '',
                tutorial: '',
                lab: '',
                recitation: '',
                exam: module.exam,
                color: col
            }]
        })
        res.push({
            newID: this.state.currID,
            name: module.name,
            schedule: module.schedule,
            lecture: '',
            tutorial: '',
            lab: '',
            recitation: '',
            color: col
        })
        this.updateDatabase(res)
    }

    getIndex = (value, arr) => {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].name === value) {
                return i;
            }
        }
        return -1;
    }
    setEditedItem = (id) => {
        this.setState({ editedItem: id })
    }

    setModule = (item) => {
        this.setState({inputModule: item})
    }

    setLecture = (text) => {
        this.setState({inputLecture: text})
    }

    setTutorial = (text) => {
        this.setState({inputTutorial: text})
    }

    setLab = (text) => {
        this.setState({inputLab: text})
    }

    setRec = (text) => {
        this.setState({inputRec: text})
    }

    setID = () => {
        this.state.currID++
    }

    schInfo=(item)=>{
        let s = ''
        if (item.lecture !== ''){
            s = s+'Lecture: ' + item.lecture.ClassNo + ' (' + item.lecture.DayText + ' ' +
                item.lecture.WeekText + ', ' + item.lecture.StartTime + '-' + item.lecture.EndTime + ')' +
                ' at ' + item.lecture.Venue + '\n\n'
        }
        if(item.tutorial !== '') {
            s = s+'Tutorial: ' + item.tutorial.ClassNo + ' (' + item.tutorial.DayText + ' ' +
                item.tutorial.WeekText + ', ' + item.tutorial.StartTime + '-' + item.tutorial.EndTime + ')' +
                ' at ' + item.tutorial.Venue + '\n\n'
        }
        if(item.lab !== ''){
            s = s+'Laboratory: ' + item.lab.ClassNo + ' (' + item.lab.DayText + ' ' +
                item.lab.WeekText + ', ' + item.lab.StartTime + '-' + item.lab.EndTime + ')' +
                ' at ' + item.lab.Venue + '\n\n'
        }
        if(item.recitation !== '') {
            s = s+'Recitation: ' + item.recitation.ClassNo + ' (' + item.recitation.DayText + ' ' +
                item.recitation.WeekText + ', ' + item.recitation.StartTime + '-' + item.recitation.EndTime + ')' +
                ' at ' + item.recitation.Venue + '\n'
        }
        if (item.exam !== 'nil'){
            s = s + 'Your exam will be on ' + item.exam.Date + ' at ' + item.exam.Time + '\n'
        }
        else {
            s = s + 'No exam data for this module' + '\n'
        }
        if (s===''){
            return 'You have not chosen the timeslot for this module'
        } else {
            return s
        }
    }

    viewSchedule = (item) =>{
        let msg = this.schInfo(item)
        Alert.alert(item.name,msg)
    }

    renderItem = ({item, index}) => (
        <View style = {styles.moduleList}>
            <TouchableOpacity style = {[styles.moduleButton,{backgroundColor: item.color}]}
                              onPress={() =>
                              {this.setModalVisible(true);
                                  this.setModule(item);
                                  this.setLab(item.lab);
                                  this.setLecture(item.lecture);
                                  this.setTutorial(item.tutorial);
                                  this.setRec(item.recitation)
                                  this.setEditedItem(item)}}>
                <Text style={{textAlign:'center'}}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style ={{justifyContent:'center'}} onPress={()=>{this.viewSchedule(item)
                                                                                console.log("exam is on: " + item.exam)}}>
                <Text style={{color:'#53D3EF'}}>Tap to view schedule</Text>
            </TouchableOpacity>
        </View>
    )

    pilihLec = ({item}) => (
        <TouchableOpacity style={styles.chooseLec}
                          onPress={()=>{
                              this.setLecture(item)
                              console.log(this.state.inputLecture)
                          }}>
            <Text>{item.ClassNo}{' ('}{item.Venue}{')'}</Text>
            <Text>{item.WeekText}</Text>
            <Text>{item.DayText} {', '}{item.StartTime}{'-'}{item.EndTime}</Text>
        </TouchableOpacity>
    )

    chooseLecture = ({item}) => {
        const lecs = item.schedule.filter(s => s.LessonType === "Lecture")
        if (lecs.length===0){
            return (<Text style = {{padding:8}}>No Lecture for this module</Text>)
        }
        return (
            <View>
                <FlatList data={lecs} renderItem={this.pilihLec}/>
            </View>
        )
    }

    pilihTut = ({item}) => (
        <TouchableOpacity style={styles.chooseLec}
                          onPress={()=>{
                              this.setTutorial(item)
                          }}>
            <Text>{item.ClassNo}{' ('}{item.Venue}{')'}</Text>
            <Text>{item.WeekText}</Text>
            <Text>{item.DayText} {', '}{item.StartTime}{'-'}{item.EndTime}</Text>
        </TouchableOpacity>
    )

    chooseTutorial = ({item}) => {
        const tuts = item.schedule.filter(s => s.LessonType === "Tutorial")
        if (tuts.length===0){
            return (<Text style = {{padding:8}}>No Tutorial for this module</Text>)
        }
        return (
            <View>
                <FlatList data={tuts} renderItem={this.pilihTut}/>
            </View>
        )
    }

    pilihLab = ({item}) => (
        <TouchableOpacity style={styles.chooseLec}
                          onPress={()=>{
                              this.setLab(item)
                          }}>
            <Text>{item.ClassNo}{' ('}{item.Venue}{')'}</Text>
            <Text>{item.WeekText}</Text>
            <Text>{item.DayText} {', '}{item.StartTime}{'-'}{item.EndTime}</Text>
        </TouchableOpacity>
    )

    chooseLab = ({item}) => {
        const labs = item.schedule.filter(s => s.LessonType === "Laboratory")
        if (labs.length===0){
            return (<Text style = {{padding:8}}>No Laboratory for this module</Text>)
        }
        return (
            <View>
                <FlatList data={labs} renderItem={this.pilihLab}/>
            </View>
        )
    }

    pilihRec = ({item}) => (
        <TouchableOpacity style={styles.chooseLec}
                          onPress={()=>{
                              this.setRec(item)
                          }}>
            <Text>{item.ClassNo}{' ('}{item.Venue}{')'}</Text>
            <Text>{item.WeekText}</Text>
            <Text>{item.DayText} {', '}{item.StartTime}{'-'}{item.EndTime}</Text>
        </TouchableOpacity>
    )

    chooseRecitation = ({item}) => {
        const recs = item.schedule.filter(s => s.LessonType === "Recitation")
        if (recs.length===0){
            return (<Text style = {{padding:8}}>No Recitation for this module</Text>)
        }
        return (
            <View>
                <FlatList data={recs} renderItem={this.pilihRec}/>
            </View>
        )
    }

    handleEditItem = (editedItem) => {
        const newData = this.state.chosenModule.map( item => {
            if (item === editedItem ) {
                item.lecture = this.state.inputLecture;
                item.tutorial = this.state.inputTutorial;
                item.lab = this.state.inputLab;
                item.recitation = this.state.inputRec
                return item
            }
            return item
        })
        this.setState({ chosenModule: newData })
        this.updateDatabase(newData)
    }

    handleDeleteItem = (deletedItem) => {
        let newItems = this.state.chosenModule.filter((item) => {
            return item != deletedItem
        })
        this.setState({chosenModule: newItems})
        this.updateDatabase(newItems)
    }

    render () {
        return (
            <SafeAreaView style = {styles.container}>
                <Text> Add Module </Text>
                <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    onItemSelect={item => {this.updateSearchModule(item)
                                            console.log("exam: "+item.exam)}}
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
                    items={this.state.modules}
                    defaultIndex={2}
                    placeholder="Search Class"
                    resetValue={false}
                    underlineColorAndroid="transparent"
                />
                <TouchableOpacity style = {styles.addButton}
                                  onPress={()=>{
                                      if (this.state.chosenModule.map((item) => item.name).includes(this.state.searchModule.name)){
                                          alert("You have added this module!")
                                      } else if (this.state.searchModule===''){
                                          alert("Please choose a module")
                                      }
                                      else {
                                          this.addModule(this.state.searchModule)
                                          alert("Module added: "+ this.state.searchModule.name)
                                      }
                                  }}>
                    <Text style={styles.addText}> + Add Module</Text>
                </TouchableOpacity>
                <Text>Module List:</Text>
                <FlatList
                    data={this.state.chosenModule}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={this.renderItem}
                />
                <TouchableOpacity onPress={()=>{
                    this.state.navigation.setParams({modules: this.state.chosenModule});
                    this.state.navigation.push('ExpandCalendar',{modules:this.state.chosenModule})
                }}>
                    <Text style={{color:'#53D3EF'}}>Switch to calendar</Text>
                </TouchableOpacity>
                <Modal animationType="fade" visible={this.state.isModalVisible}
                       onRequestClose={() => this.setModalVisible(false)}>
                    <ScrollView style={styles.chooseFL}>
                        <TouchableOpacity style={styles.titleButton} onPress={() => this.setState({ openLec: !this.state.openLec })}>
                            <Text style={styles.chooseText}> Choose Lecture </Text>
                            <Text style={{fontSize:16}}>+</Text>
                        </TouchableOpacity>
                        <Expand value={this.state.openLec}>
                            <FlatList
                                keyExtractor={(item, index) => String(index)}
                                data={this.state.chosenModule.filter(mod => mod.name === this.state.editedItem.name)}
                                renderItem={this.chooseLecture}/>
                        </Expand>
                        <TouchableOpacity style={styles.titleButton} onPress={() => this.setState({ openTut: !this.state.openTut })}>
                            <Text style={styles.chooseText}> Choose Tutorial </Text>
                            <Text style={{fontSize:16}}>+</Text>
                        </TouchableOpacity>
                        <Expand value={this.state.openTut}>
                            <FlatList
                                keyExtractor={(item, index) => String(index)}
                                data={this.state.chosenModule.filter(mod => mod.name === this.state.editedItem.name)}
                                renderItem={this.chooseTutorial}/>
                        </Expand>
                        <TouchableOpacity style={styles.titleButton} onPress={() => this.setState({ openLab: !this.state.openLab })}>
                            <Text style={styles.chooseText}> Choose Lab </Text>
                            <Text style={{fontSize:16}}>+</Text>
                        </TouchableOpacity>
                        <Expand value={this.state.openLab}>
                            <FlatList
                                keyExtractor={(item, index) => String(index)}
                                data={this.state.chosenModule.filter(mod => mod.name === this.state.editedItem.name)}
                                renderItem={this.chooseLab}/>
                        </Expand>
                        <TouchableOpacity style={styles.titleButton} onPress={() => this.setState({ openRec: !this.state.openRec })}>
                            <Text style={styles.chooseText}> Choose Recitation </Text>
                            <Text style={{fontSize:16}}>+</Text>
                        </TouchableOpacity>
                        <Expand value={this.state.openRec}>
                            <FlatList
                                keyExtractor={(item, index) => String(index)}
                                data={this.state.chosenModule.filter(mod => mod.name === this.state.editedItem.name)}
                                renderItem={this.chooseRecitation}/>
                        </Expand>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style ={styles.editButton}
                                              onPress={()=>{
                                                  this.handleEditItem(this.state.editedItem)
                                                  this.setModalVisible(false)
                                              }}>
                                <Text style={{textAlign:'center'}}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style ={styles.deleteButton}
                                              onPress={()=>{
                                                  this.handleDeleteItem(this.state.editedItem)
                                                  alert("Module deleted: "+this.state.editedItem.name)
                                                  this.setModalVisible(false)
                                              }}>
                                <Text style={{textAlign:'center'}}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
            </SafeAreaView>
        )
    }
}

export default AddModule

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        padding: 18,
        //paddingTop: 35,
        //backgroundColor: '#ffffff',
        marginTop: 25,
        marginBottom: 25
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
        fontFamily: 'Roboto'
    },
    dateText: {
        fontSize:28,
        fontFamily: 'Roboto'
    },
    moduleList: {
        flexDirection: 'row',
        //flexWrap: 'wrap',
    },
    moduleButton: {
        //backgroundColor: 'grey',
        width: 100,
        height: 50,
        fontSize: 18,
        borderRadius: 5,
        padding: 8,
        margin: 8,
        justifyContent:'center'
    },
    moduleDesc: {
        fontSize: 14,
        flexWrap: 'wrap',
        marginLeft: 8,
        flex: 1
    },
    addButton: {
        marginBottom: 10,
        width: 150,
        height: 50,
        alignItems: 'flex-start',
        backgroundColor: '#53D3EF',
        borderRadius: 5,
        marginTop: 30,
    },
    addText: {
        alignSelf: 'center',
        marginTop: 5,
        fontSize: 14,
        padding: 8
    },
    chooseLec:{
        backgroundColor: '#F3EEC4',
        padding: 8,
        marginTop:10,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        borderRadius: 5
    },
    chooseFL: {
        flex: 1
    },
    chooseText:{
        fontSize: 16,
        margin: 8,
        width: 320
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
    titleButton:{
        backgroundColor:'#A9E9F8',
        padding:8,
        marginTop:10,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems:'center',
        borderRadius: 5
    }
})