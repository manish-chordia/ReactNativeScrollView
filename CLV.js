import React from 'react';
import { View, PanResponder, Text, StyleSheet, Image } from 'react-native';
import ScrollView from './ScrollView';

export default class CLV extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textColor: '#000'
        };
    }
    
    render() {
        return (
            <View>
                <Text key={1} style={{ fontSize: 60, color: this.state.textColor }}>Page title</Text>  
                <ScrollView key={2} ref="parentSv" onScroll={this.getParentScrollPosition.bind(this)}  /*onScroll={this.getParentScrollPosition.bind(this)}*/ style={{ backgroundColor: "#FFFFE0", height: 750}}> 
                    <View key={'bottomSheet'} style={{ marginTop: 400 }}>
                        <View key={'bottomSheetHeader'} style={{ backgroundColor: "#ADFF2F", height: 200}}>
                                <Text style={{ fontSize: 60 }}>Bottom sheet</Text>
                        </View>
                        <ScrollView key={4} ref="childSv2" style={{ backgroundColor: "#FFFF00", height: 600}}>
                            <View key={31}>
                                <Text style={{ fontSize: 60 }}>100</Text>
                            </View>
                            <View key={32}>
                                <Text style={{ fontSize: 60 }}>200</Text>
                            </View>
                            <View key={33}>
                                <Text style={{ fontSize: 60 }}>300</Text>
                            </View>
                            <View key={34}>
                                <Text style={{ fontSize: 60 }}>400</Text>
                            </View>
                            <View key={35}>
                                <Text style={{ fontSize: 60 }}>500</Text>
                            </View>
                            <View key={36}>
                                <Text style={{ fontSize: 60 }}>600</Text>
                            </View>
                            <View key={37}>
                                <Text style={{ fontSize: 60 }}>700</Text>
                            </View>
                            <View key={38}>
                                <Text style={{ fontSize: 60 }}>800</Text>
                            </View>
                            <View key={39}>
                                <Text style={{ fontSize: 60 }}>900</Text>
                            </View>
                            <View key={40}>
                                <Text style={{ fontSize: 60 }}>1000</Text>
                            </View>
                            <View key={41}>
                                <Text style={{ fontSize: 60 }}>1100</Text>
                            </View>
                            <View key={42}>
                                <Text style={{ fontSize: 60 }}>1200</Text>
                            </View>
                            <View key={43}>
                                <Text style={{ fontSize: 60 }}>1300</Text>
                            </View>
                            <View key={44}>
                                <Text style={{ fontSize: 60 }}>1400</Text>
                            </View>
                            <View key={45}>
                                <Text style={{ fontSize: 60 }}>1500</Text>
                            </View>
                            <View key={46}>
                                <Text style={{ fontSize: 60 }}>1600</Text>
                            </View>
                            <View key={47}>
                                <Text style={{ fontSize: 60 }}>1700</Text>
                            </View>
                            <View key={48}>
                                <Text style={{ fontSize: 60 }}>1800</Text>
                            </View>
                            <View key={50}>
                                <Text style={{ fontSize: 60 }}>1900</Text>
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        );
    }
    
    getParentScrollPosition(val){
        console.log('parent scroll value: ', val);
        if(val < -398){
            this.changeTextColorToRed();
            console.log('passing scroll to child');
            this.refs.childSv2.scrollTo(val);
        }else{
            this.changeTextColorToBlack();
            // this.refs.childSv1.scrollTo(val);
        }
    }

    getScrollPosition(val){
        if(val < -440){
            this.changeTextColorToRed();
            this.refs.childSv2.scrollTo(val-10);
        }else{
            this.changeTextColorToBlack();
        }
    }

    changeTextColorToRed(){
        this.setState({
            textColor: '#ff0000'
        })
    }

    changeTextColorToBlack(){
        this.setState({
            textColor: '#000'
        })
    }
}