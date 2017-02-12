/**
 * Created by lintong on 2016/11/16.
 * @flow
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
} from 'react-native'
import {steps} from '../../source'
import * as Animatable from 'react-native-animatable';


export default class MyComponet extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {
        total:PropTypes.number,
        index:PropTypes.number,
    };
    static defaultProps = {
        total:4,
        index:0,
    };

    __renderAnimation(i) {
        return (
            <View key={i} style={styles.animation}>

                <Animatable.View
                    animation="pulse"
                    iterationCount="infinite"
                    style={styles.dotAni}>
                    <View style={styles.dot}/>
                </Animatable.View>
            </View>
        )
    }

    __renderPlacehold(i) {
        return (
            <View key={i} style={styles.placehold}>
                <View style={styles.placeholdIn}/>
            </View>
        )
    }

    _renderSubImage(){
        let array = [];
        for (let i=0;i<this.props.total;i++)
        {
            if(i<this.props.index){
                array[i] = (<Image key={i} source={steps}/>)
            }else if(i == this.props.index){
                array[i] = this.__renderAnimation(i)
            }else {
                array[i] = this.__renderPlacehold(i)
            }

        }
        return array
    }

    render() {
        return (
            <View style={[this.props.style,styles.wrap]}>
                <View style={styles.line}/>
                <View style={styles.imageView}>
                    {this._renderSubImage()}
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        height: 25,
        // backgroundColor:'grey',
        justifyContent: 'center',

    },
    line: {
        top: 12.5,
        zIndex: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgb(200,200,200)',
        // marginVertical:10,
        marginHorizontal: 10,
    },
    placehold: {
        width: 25,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholdIn:{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgb(200,200,200)',
    },
    animation: {
        width: 25,
        alignItems: 'center',
        justifyContent: 'center',

    },
    dot: {
        width: 8,
        height: 8,
        backgroundColor: '#49c3c1',
        borderRadius: 5,
    },
    dotAni: {
        backgroundColor: 'rgba(73,195,193,0.35)',
        width: 15,
        height: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    imageView: {
        // zIndex:2,
        // position:'absolute',
        // width:300,
        // backgroundColor:'grey',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})