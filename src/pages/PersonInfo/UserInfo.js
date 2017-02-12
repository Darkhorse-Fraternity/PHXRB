/**
 * Created by lintong on 2017/2/3.
 * @flow
 */
'use strict';

import {backViewColor, blackFontColor, grayFontColor} from '../../configure';
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
import {bindActionCreators} from 'redux';
import {push} from '../../redux/nav'
//static displayName = Account
@connect(
    state =>({
        //state:state.util.get()
        userData: state.login.data,
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class Account extends Component {
    constructor(props: Object) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props.data, nextProps.data)
    }

    static propTypes = {};
    static defaultProps = {};


    _renderRow(title: string, des: string,onPress: Function) {
        return (
            <View>
                <TouchableHighlight onPress={()=>{
                    push({key:'UserInfoDetail',index:title})
                }}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.rowDesText}>
                                {des}
                            </Text>
                            <View style={styles.arrowView}/>
                        </View>
                    </View>

                </TouchableHighlight>
                <View style={styles.separator}/>
            </View>
        );
    }

    render(): ReactElement<any> {
        return (
            <ScrollView style={[this.props.style,styles.wrap]}>
                {/*{this._renderRow('账号',this.props.userData.mobilePhoneNumber ,() => {

                 })}*/}
                {this._renderRow('姓名', "李xx", () => {
                })}

                {this._renderRow('性别', "男", () => {
                })}
                {this._renderRow('身份证', "35042619890320000", () => {
                })}
                {this._renderRow('联系方式', "13588833404", () => {})}
                {this._renderRow('邮箱', "420156367@qq.com", () => {})}
                {this._renderRow('城市', "福州", () => {})}
                {this._renderRow('婚姻状况', "未婚", () => {})}
                {this._renderRow('年龄', "29", () => {})}
                {this._renderRow('家庭地址', "福州xxxx", () => {})}
                {this._renderRow('邮编', "350001", () => {})}
                {this._renderRow('业务代码', "12046572", () => {})}

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    groupSpace: {
        height: 15 / 2,
    },
    row: {
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 29 / 2,
        paddingRight: 23 / 2,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowText: {
        fontSize: 14,
        // fontWeight: '500',
        color: blackFontColor,
    },
    rowDesText:{
        fontSize:13,
        color:'rgb(150,150,150)',
        marginRight:10,
    },
    separator: {
        backgroundColor: '#bbbbbb',
        height: StyleSheet.hairlineWidth,
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
