/**
 * Created by lintong on 2017/2/3.
 * @flow
 */
'use strict';

import {backViewColor, blackFontColor, grayFontColor} from '../../configure';
import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import { Button } from 'antd-mobile';

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
import {pop} from '../../redux/nav'
import {phxr_query_financing_detail} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
//static displayName = Account
@connect(
    state =>({
        //state:state.util.get()
        data:state.req.get('phxr_query_financing_detail')
    }),
    (dispatch,props) =>({
        //...bindActionCreators({},dispatch),
        load:()=>{
            dispatch(async (dispatch,getState)=>{

                // const uid = getState().login.data.userId
                const params = phxr_query_financing_detail(props.scene.route.businessId)
                await dispatch(request('phxr_query_financing_detail',params))

            })

        }
    })
)
export  default  class Business extends Component {
    constructor(props: Object) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props.data, nextProps.data)
    }

    static propTypes = {
        load: PropTypes.func.isRequired,
    };
    static defaultProps = {
        data:immutable.fromJS({
        })
    };


    componentDidMount() {
        this.props.load()
    }


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

    sw(){
        pop()
    }
    render(): ReactElement<any> {
        let data =  this.props.data.toJS().data || [{}]
        data = data[0]
        console.log('data:', data);
        return (
            <ScrollView style={[this.props.style,styles.wrap]}>
                {/*{this._renderRow('账号',this.props.userData.mobilePhoneNumber ,() => {

                 })}*/}
                {this._renderRow('状态', "未处理", () => {
                })}

                {this._renderRow('融资会员姓名', "xxx", () => {
                })}
                {this._renderRow('所在地域', "xx省xx市xx区", () => {
                })}
                {this._renderRow('注册时间', "2017年x月x号", () => {
                })}
                {this._renderRow('发起需求时间', "2017年月x号", () => {
                })}
                {this._renderRow('服务需求', "首次融资服务申请", () => {
                })}
                <View>
                    {this.__renderTipProgress(['需求确认','信息录入','材料收集','材料审核'],0,'hidden')}
                    {/*{this.__renderTipProgress(['需求确认1','信息录入1','材料收集1','材料审核1'],4,'right')}*/}
                    {/*{this.__renderTipProgress(['需求确认2','信息录入2','材料收集2','材料审核2'],1,'left')}*/}
                    <View style={[styles.line]}/>
                </View>

                <View>
                    <Button inline style={{ margin: 10 }} onClick={this.sw}>确认服务</Button>
                    <Text style={{padding:10}}>点击"确认服务"后，咨询顾问必须尽快与您的融资会员联系,并上门为其服务</Text>
                </View>


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
