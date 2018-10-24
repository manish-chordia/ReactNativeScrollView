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
                <ScrollView key={2} ref="sv1" onScroll={this.getScrollPosition.bind(this)} style={{ backgroundColor: "#808000", height: 150}}>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>3</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>2</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>1</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>1</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>1</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>1</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>1</Text>
                    </View>
                </ScrollView>
                <ScrollView key={3} ref="sv2" style={{ backgroundColor: "#FFFF00", height: 250}}>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>30</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>20</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>10</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>10</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>10</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>10</Text>
                    </View>
                    <View key={1}>
                        <Text style={{ fontSize: 60 }}>10</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    getScrollPosition(val){
        if(val < -440){
            this.changeTextColorToRed();
            this.refs.sv2.scrollTo(val-10);
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