/**
 * Created by lintong on 2017/2/13.
 * @flow
 */
'use strict';


import { ActionSheet,DatePicker,Button } from 'antd-mobile';
import moment from 'moment';
import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    ScrollView
} from 'react-native'
import {connect} from 'react-redux'
import {pop} from '../../redux/nav'
import {bindActionCreators} from 'redux';

//static displayName = MemberInfo


const maxDate = moment('2018-12-03 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('2015-08-06 +0800', 'YYYY-MM-DD Z').utcOffset(8);

const maxTime = moment('22:00 +0800', 'HH:mm Z').utcOffset(8);
const minTime = moment('00:30 +0800', 'HH:mm Z').utcOffset(8);
const gmtNow = moment().utcOffset(0);




@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class Demand extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }


    showActionSheet(message:string,op:any) {
        const wrapProps = {onTouchStart: e => e.preventDefault()}
        const BUTTONS = op.concat('取消')
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                // title: '标题',
                cancelButtonIndex: BUTTONS.length - 1,
                message,
                maskClosable: true,
                'data-seed': 'logId',
                wrapProps,
            },
            (buttonIndex) => {
                if(buttonIndex != BUTTONS.length - 1){
                    this.setState({ clicked: BUTTONS[buttonIndex] });
                }

            });
    }


    _renderRow(title: string,  dex:string,onPress: Function) {
        return (
            <View>
                <TouchableHighlight onPress={()=>onPress(title)}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.dex} >{dex}</Text>
                            {onPress && (<View style={styles.arrowView}/>)}
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    render(): ReactElement<any> {
        const CustomChildren = (props) =>  this._renderRow('到款时间','2017.3.20',props.onClick)

        return (
            <ScrollView style={[this.props.style,styles.wrap]}>

                <View style={styles.groupSpace}/>
                {this._renderRow('收到xxx的融资请求', '13859102336')}
                <View style={styles.groupSpace}/>
                {this._renderRow('日期', '17.2.30')}
                <View style={styles.groupSpace}/>
                {this._renderRow('借款额度','200万')}

                <View style={styles.groupSpace}/>
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="请选择(可选)"
                    onChange={(v) => this.setState({ dpValue: v })}
                >
                    <CustomChildren/>
                </DatePicker>

                <View style={styles.groupSpace}/>
                {this._renderRow('担保资产', '信用',(title) => {
                    this.showActionSheet(title,['信用',"汽车","房产"])
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('借款优先', '额度',(title) => {
                    this.showActionSheet(title,['额度','利率','时间效率'])
                })}
                <View style={styles.groupSpace}/>
                <View style={styles.groupSpace}/>
                <Button onClick={()=>pop()}>需求提交</Button>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    row: {
        backgroundColor: 'white',
        padding: 29 / 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowText: {
        fontSize: 14,
        // fontWeight: '500',
        color: 'black',
        width:200,

    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#bbbbbb',
        marginLeft: 15,
    },
    arrowView: {
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderRightWidth: StyleSheet.hairlineWidth * 2,
        borderColor: '#8c8c85',
        transform: [{rotate: '315deg'}],
        marginLeft: 5,
        width: 10,
        height: 10,
    },
    groupSpace: {
        height: 15 / 2,
    },

    dex:{
        marginRight:5,
    }
})
