import React, { Component } from 'react'
import { Button, SearchBar  } from 'react-native-elements'
import SearchableDropdown from "react-native-searchable-dropdown";
import {View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, SafeAreaView} from 'react-native'
import BusStop from "../BusStop.json"
import Class from "../Classes.json"
import {cos} from "react-native-reanimated";
import firebaseDb from "./firebaseDb";

class TravelPlan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Result: '',
            locationTo: '',
            locationFrom: '',
            busStopTo: '',
            busStopFrom: '',
            possibleRoutes: [],
            dummyFrom: [],
            dummyTo: [],
            BusData: BusStop[0].Stops,
            possibleBusses: [],
            busChosen: '',
            route:this.props.route,
            navigation:this.props.navigation,
            locFromSch: this.props.route.params?.loc,
            id: this.props.route.params.id,
            currTo: this.props.route.params?.loc?this.props.route.params?.loc:Class[2],
            newLoc: '',
            locIndex:0
        }
    }

    updateLoc = () => {
        let res = firebaseDb.firestore().collection('users').doc(this.state.id).get().then(querySnapshot => {
            let hsl = querySnapshot.data()
            this.setState({newLoc: hsl.loc})
            this.getBusInd(hsl.loc)
            console.log(hsl.loc)
            this.state.navigation.setParams({loc:hsl.loc})
        })
    }

    getBusInd = (loc) => {
        this.setState({locIndex:loc?this.getIndex(loc,Class):2})
        this.setState({locFromSch:loc})
        console.log(this.state.newLoc)
        console.log(this.getIndex(loc,Class))
        console.log(this.state.locIndex)
        return loc?this.getIndex(loc,Class):2
    }

    componentDidMount() {
        this.updateLoc()
    }

    updateLocationTo = place => {
        this.setState({locationTo: place})
    }

    updateLocationFrom = place => {
        this.setState({locationFrom: place})
    }

    updateBusStopFrom = place => {
        this.setState({busStopFrom: place})
    }

    updateBusStopTo = place => {
        this.setState({busStopTo: place})
    }

    updateResult = text => {
        this.setState({Result: text})
    }

    updateBusChosen = text => {
        this.setState({busChosen: text})
    }

    handleTravel = (locFrom, locTo) => {
        let itemFrom = this.state.BusData.filter((item) => {
            return item.Classes.includes(locFrom)
        })
        let itemTo = this.state.BusData.filter((item) => {
            return item.Classes.includes(locTo)
        })
        let busStopFrom
        let busStopTo
        let BusChosen
        for (let i = 0; i < itemTo.length; i++){
            for (let j=0; j < itemFrom.length; j++){
                if (itemFrom[j].Possible.includes(itemTo[i].name)){
                    busStopFrom = itemFrom[j]
                    busStopTo = itemTo[i]
                    break
                }
                else if (itemFrom[j].name === itemTo[i].name){
                    this.updateResult("Same location / building!")
                }
            }
        }
        if (busStopFrom != null){
            console.log(busStopFrom.Bus)
            if (busStopFrom.Bus[0].A1.includes(busStopTo.name)){
                BusChosen="A1"
            }
            else if (busStopFrom.Bus[0].A2.includes(busStopTo.name)){
                BusChosen="A2"
            }
            else if (busStopFrom.Bus[0].B1.includes(busStopTo.name)){
                BusChosen="B1"
            }
            else if (busStopFrom.Bus[0].B2.includes(busStopTo.name)){
                BusChosen="B2"
            }
            else if (busStopFrom.Bus[0].C.includes(busStopTo.name)){
                BusChosen="C"
            }
            else if (busStopFrom.Bus[0].D1.includes(busStopTo.name)){
                BusChosen="D1"
            }
            else if (busStopFrom.Bus[0].D2.includes(busStopTo.name)){
                BusChosen="D2"
            }
            else if (busStopFrom.Bus[0].BTC1.includes(busStopTo.name)){
                BusChosen="BTC1"
            }
            else if (busStopFrom.Bus[0].BTC2.includes(busStopTo.name)){
                BusChosen="BTC2"
            }
            else if (busStopFrom.Bus[0].A1E.includes(busStopTo.name)){
                BusChosen="A1E"
            }
            else if (busStopFrom.Bus[0].A2E.includes(busStopTo.name)){
                BusChosen="A2E"
            }
            else if (busStopFrom.Bus[0].AV1.includes(busStopTo.name)){
                BusChosen="AV1"
            }
            if ((busStopFrom != '') && (busStopTo != '') && (BusChosen != '')) {
                this.updateResult("You can take bus " + BusChosen + " from " + busStopFrom.name + " to " + busStopTo.name)
            }
            this.setState({busStopFrom:busStopFrom});
            this.setState({busStopTo:busStopTo});
            this.setState({busChosen:BusChosen})
        }
    }

    getIndex = (value, arr) => {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].name === value) {
                return i;
            }
        }
        return -1;
    }

    defaultToBus = ()=>{
        //this.updateLoc()
        console.log(this.state.locIndex + 'aaa')
        let loc = this.state.locFromSch
        console.log(loc)
        console.log('location')
        let x = this.state.locIndex
        console.log(x)
        return this.getIndex(loc,Class)
    }

    /*defaultToBus = (loc)=>{
        return loc?this.getIndex(loc,Class):2
    }*/

    render () {
        let {loc} = this.state.route.params
        console.log(loc + 'locate')
        console.log(this.state.newLoc)
        console.log(this.state.locIndex)
        //this.updateLoc()
        return (
            <View style = {styles.container}>
                <Text style = {styles.titleText}>
                    + Going From
                </Text>
                <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    onItemSelect={item => this.updateLocationFrom(item)}
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
                    //defaultIndex={2}
                    placeholder="Search Class"
                    resetValue={false}
                    underlineColorAndroid="transparent"
                />
                <Text style = {styles.titleText}>
                    + Going To
                </Text>
                <Text>{this.state.locIndex}</Text>
                <TouchableOpacity onPress={()=>this.updateLoc()}><Text>{this.state.locFromSch}</Text></TouchableOpacity>
                <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    onItemSelect={item => this.updateLocationTo(item)}
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
                    defaultIndex={this.getIndex(loc,Class)}
                    placeholder="Search Class"
                    resetValue={false}
                    underlineColorAndroid="transparent"
                />
                <TouchableOpacity style = {styles.addButton}
                                  onPress={()=>{
                                      this.updateBusStopTo('')
                                      this.updateBusStopFrom('')
                                      this.updateBusChosen('')
                                      this.updateResult('')
                                      this.handleTravel(this.state.locationFrom.name,this.state.locationTo.name)
                                  }}>
                    <Text style={styles.addButText}> Generate </Text>
                </TouchableOpacity>
                <Text style = {styles.resultText}>
                    {this.state.Result}
                </Text>
            </View>
        )
    }
}

export default TravelPlan

const styles = StyleSheet.create ({
    container: {
        alignContent: 'center',
        flex: 1,
        flexDirection: 'column',
        marginTop: 25,
        marginBottom: 25
    },
    titleText: {
        width: 170,
        height: 25,
        textAlign: 'left',
        marginTop: 25,
        marginBottom: 10,
        fontSize: 16,
        marginLeft: 10
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
    generateButton: {
        marginBottom: 30,
        width: 160,
        height: 30,
        alignItems: 'center',
        backgroundColor: '#53D3EF',
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 60
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 14,
        width: 100,
        height: 25
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20
    },
    addText: {
        fontSize: 12,
        width: 200,
        height: 25,
        marginTop: 5,
        marginLeft: 10
    },
    addButton: {
        backgroundColor: '#36A5C9',
        alignSelf: 'center',
        fontSize: 16,
        width: 200,
        height: 50,
        marginTop: 50,
        borderRadius: 5,
        marginRight: 10
    },
    addButText: {
        textAlign: 'center',
        fontSize: 18,
        width: 200,
        height: 50
    },
    sejajar: {
        flexDirection: 'row'
    },
    resultText: {
        textAlign: 'center',
        fontSize: 16,
        width: 400,
        height: 100,
        marginTop: 30,
        flexWrap: 'wrap'
    }
})
