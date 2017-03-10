/**
 * Created by lintong on 2017/2/13.
 * @flow
 */
'use strict';


import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native'

import {mainColor} from '../../configure'
import {connect} from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import CourseTabBar from '../../components/CourseTabBar'
import Financed from './Financed'
import * as immutable from 'immutable';




@connect(
    state =>({
    }),
    dispatch =>({


    })
)

export default class BusinessList extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {
    };
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props.data, nextProps.data)
    }



    render() {


        return (
            <ScrollableTabView style={styles.wrap} initialPage={0} renderTabBar={()=><CourseTabBar/>}>
                <Financed
                    tabLabel="新任务"
                    style={[this.props.style,styles.list]}
                    businessSate="0"
                />
                <Financed
                    tabLabel="已办任务"
                    businessSate="1"
                    style={[this.props.style,styles.list]}

                />
                <Financed
                    tabLabel="完成任务"
                    businessSate="2"
                    style={[this.props.style,styles.list]}

                />
                <Financed
                    tabLabel="结案任务"
                    businessSate="3"
                    style={[this.props.style,styles.list]}

                />
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: 'white',
    },
    list: {
        flex: 1,
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    text: {
        marginLeft: 5,
        fontSize: 16,
        color: 'rgb(150,150,150)'
    },
    subText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
        color: 'rgb(200,200,200)'
    },
    date: {
        fontSize: 14,
        color: 'rgb(100,100,100)'
    },
    // row: {
    //     backgroundColor: 'white',
    //     paddingHorizontal: 18,
    //     paddingVertical: 18,
    // },
    subRow: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        backgroundColor: 'white',
        paddingHorizontal: 18,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    arrowView: {
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderRightWidth: StyleSheet.hairlineWidth * 2,
        borderColor: '#8c8c85',
        transform: [{rotate: '315deg'}],
        width: 10,
        height: 10,
    },
})




