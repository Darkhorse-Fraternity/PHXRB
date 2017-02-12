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
                {this._renderRow('年龄', "25", () => {
                })}
                {this._renderRow('年龄', "25", () => {})}
                {this._renderRow('身份证', "25", () => {})}
                {this._renderRow('联系方式', "25", () => {})}
                {this._renderRow('邮箱', "25", () => {})}
                {this._renderRow('城市', "25", () => {})}
                {this._renderRow('婚姻状态', "25", () => {})}
                {this._renderRow('配偶姓名', "25", () => {})}
                {this._renderRow('配偶身份证', "25", () => {})}
                {this._renderRow('配偶电话', "25", () => {})}
                {this._renderRow('居住地址', "25", () => {})}
                {this._renderRow('邮编', "25", () => {})}
                {this._renderRow('户籍地址', "25", () => {})}
                {this._renderRow('工作单位', "25", () => {})}
                {this._renderRow('单位地址', "25", () => {})}
                {this._renderRow('单位性质', "25", () => {})}
                {this._renderRow('单位规模', "25", () => {})}
                {this._renderRow('单位人员规模', "25", () => {})}
                {this._renderRow('在岗职位', "25", () => {})}
                {this._renderRow('职位水平', "25", () => {})}
                {this._renderRow('入职时间', "25", () => {})}
                {this._renderRow('月工资水平', "25", () => {})}
                {this._renderRow('提供工作证明文件', "25", () => {})}
                {this._renderRow('非配偶直系亲属姓名1', "25", () => {})}


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
        color:'rgb(150,150,150)'
    },
    separator: {
        backgroundColor: '#bbbbbb',
        height: StyleSheet.hairlineWidth,
    },
})
