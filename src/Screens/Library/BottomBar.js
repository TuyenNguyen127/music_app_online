import React, {useState} from "react";
import { Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {Circle, G, Path } from 'react-native-svg';

import { Colors, Images, Metrics } from 'Constants';

const BottomBar = ({children}) => { 
    
    return(
        <View style={{
            width: 321,
            height: 84,
            borderRadius: 84,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'flex-start'
        }}>
            <View style={{width: 42, height:84}}></View>
            <View style={{height: 84, justifyContent: 'space-between'}}>
                <LinearGradient 
                    colors={Colors.linearGradient2}
                    start={{x:0, y:0}}
                    end={{x:1, y:1}}
                    style={{
                        width: 321 - 84,
                        height: 3,
                        flexDirection: 'row',
                        justifyContent: 'flex-start'
                    }}
                />
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',

                }}>
                    <View style={{
                        width: 6,
                        height: 6,
                        borderRadius: 6,
                        position: 'relative',
                        bottom: -1.5,
                        backgroundColor: '#6A8CCC'
                    }}></View>
                    <View style={{
                        width: 321 - 84 - 150,
                        height: 3,
                        borderRadius: 3,
                        alignSelf: 'flex-end',
                        backgroundColor: '#ED1BA3'
                    }}></View>
                </View>
            </View>
            <Svg height="84" width="84">
                <Circle 
                    cx="0"
                    cy="42"
                    r="40"
                    stroke="#ED1BA3"
                    strokeWidth="3"
                    fill='transparent'  
                ></Circle>
            </Svg>
            <View style={{
                marginVertical:7,
                marginHorizontal: 7,
                width: 321 - 84 + 70, 
                height: 70,
                borderRadius: 70,
                backgroundColor: Colors.secondary,
                position: 'absolute',
                top: 0,
                left: 0
            }}>
               {children}
            </View>
        </View>
    )
}
export default BottomBar;