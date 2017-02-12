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
    TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {pop} from '../../redux/nav'

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


    _renderRow(title: string, des: string, onPress: Function) {
        return (
            <View>
                <TouchableHighlight onPress={onPress}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.rowDesText}>
                                {des}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    __activate=()=>{
        pop()
    }

    render(): ReactElement<any> {
        return (
            <View style={[this.props.style,styles.wrap]}>
                {/*{this._renderRow('账号',this.props.userData.mobilePhoneNumber ,() => {

                 })}*/}
                {this._renderRow('账户', this.props.userData.username, () => {
                })}
                <View style={styles.separator}/>
                {this._renderRow('类型', "咨询顾问", () => {
                })}
                <View style={styles.separator}/>
                {this._renderRow('状态', "已激活", () => {
                })}

                <TouchableOpacity style={styles.btn} onPress={this.__activate}>
                    <Text style={styles.btnText}>返回</Text>
                </TouchableOpacity>

            </View>
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
        color:'rgb(150,150,150)'
    },
    separator: {
        backgroundColor: '#bbbbbb',
        // marginLeft: 15,
        height: StyleSheet.hairlineWidth,
    },
    btn: {
        marginTop: 30,
        borderColor: 'blue',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 10,
        borderRadius: 10,
        width:100,
        height:40,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
    },
    btnText: {
        color: 'blue',
        fontSize: 15,
        fontWeight: "400",
    },
})
