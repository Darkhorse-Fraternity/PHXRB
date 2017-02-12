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
    ScrollView,
    Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import TipProgress from '../../components/TipProgress'
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




    __renderTipProgress(titleArray,index,lineStatu): ReactElement<any> {
        const rightPosition = (Dimensions.get('window').width ) -52.5
        const leftPosition = 52.5;
        return (
            <View style={styles.tipProgressView}>
                <TipProgress index={index} style={styles.propgress}/>
                <View style={styles.subProgressTip}>
                    {(titleArray.map((title)=>{
                        return ( <Text key={title} style={styles.progressTipText}>{title}</Text>)
                    }))}
                </View>
                {lineStatu != 'hidden' && (<View style={[styles.verticalLine,
                {left:lineStatu == 'left'?leftPosition:rightPosition}]}/>)}
            </View>
        )
    }


    _renderRo2(title: string, statu: string, onPress: Function) {
        return (
            <View>
                <View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.rowDesText}>
                                {statu}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.separator}/>
            </View>
        );
    }

    render(): ReactElement<any> {
        return (
            <ScrollView style={[this.props.style,styles.wrap]}>
                {/*{this._renderRow('账号',this.props.userData.mobilePhoneNumber ,() => {

                 })}*/}
                {this._renderRow('标题', "收到来自xxx的融资请求", () => {
                })}

                {this._renderRow('借款额度', "200万", () => {
                })}
                {this._renderRow('到款时间', "12.1.2", () => {
                })}
                {this._renderRow('担保资产', "信用", () => {
                })}
                {this._renderRow('借款优先', "额度", () => {
                })}
                <View>
                    {this.__renderTipProgress(['需求确认','信息录入','材料收集','材料审核'],4,'hidden')}
                    {this.__renderTipProgress(['需求确认1','信息录入1','材料收集1','材料审核1'],4,'right')}
                    {this.__renderTipProgress(['需求确认2','信息录入2','材料收集2','材料审核2'],1,'left')}
                    <View style={[styles.line]}/>
                </View>

                {this._renderRow('融资规划预案', "待处理", () => {
                })}
                {this._renderRow('融资规划方案', "待处理", () => {
                })}
                {this._renderRow('签约计划', "待处理", () => {
                })}
                {this._renderRow('还款计划表', "待处理", () => {
                })}
                {this._renderRow('费用计算表', "待处理", () => {
                })}
                {this._renderRow('结案报告', "待处理", () => {
                })}

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
    rowDesText: {
        fontSize: 13,
        color: 'rgb(150,150,150)'
    },
    separator: {
        backgroundColor: '#bbbbbb',
        height: StyleSheet.hairlineWidth,
    },
    line: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    tipProgressView: {
        // alignItems:'center'
        backgroundColor: 'white',
    },
    subProgressTip: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 15,
    },
    progressText: {
        marginTop: 15,
        marginBottom: 15,
        alignSelf: 'center',
        fontSize: 13,
    },
    progressTipText: {
        color: 'rgb(200,200,200)'

    },
    propgress: {
        paddingHorizontal: 40,
        marginTop:25,

    },
    verticalLine:{
        height:35,
        backgroundColor:'black',
        width:StyleSheet.hairlineWidth,
        zIndex:100,
        position:'absolute',
        top:-12,
    }
})
