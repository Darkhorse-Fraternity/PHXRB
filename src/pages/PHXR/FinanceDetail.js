/**
 * Created by lintong on 2017/2/3.
 * @flow
 */
'use strict';

import {backViewColor, blackFontColor, grayFontColor, mainColor} from '../../configure';
import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TextInput
} from 'react-native'
import {Button} from 'antd-mobile';
import {connect} from 'react-redux'
import TipProgress from '../../components/TipProgress'
import {ActionSheet, DatePicker} from 'antd-mobile';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {send} from '../../request'
import {
    phxr_query_financing_detail,
    phxr_submit_business_info
} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
import {pop,push} from '../../redux/nav'
import {Toast} from '../../util'
//static displayName = Account
@connect(
    state =>({
        //state:state.util.get()
        data: state.req.get('phxr_query_financing_detail')
    }),
    (dispatch, props) =>({
        //...bindActionCreators({},dispatch),
        load: ()=> {
            dispatch(async(dispatch, getState)=> {

                // const uid = getState().login.data.userId
                const params = phxr_query_financing_detail(props.scene.route.businessId,
                    props.scene.route.userId)
                await dispatch(request('phxr_query_financing_detail', params))

            })
        },
        submit: async(state,data)=> {
            // const uid = props.scene.route.userId
            

            const flag = data.checkStatus == 0 || data.checkStatus == 2
            const businessState  = flag ?1:2
            let pa = {businessState,title:data.title}
            if(flag){
                //提交审核
                pa = {
                    businessState,
                    title:data.title,
                    financingLimit:state.financingLimit,
                    moneyTime:state.moneyTime,
                    securedAssets:["信用","房产","汽车"].indexOf(state.securedAssets),
                    borrowingPriority:["额度","利率","时效"].indexOf(state.borrowingPriority),
                }
            }


            const params = phxr_submit_business_info(props.scene.route.businessId,
                props.scene.route.userId,pa)
            console.log('test:', params);
            const res = await send(params)
            //
            res.rspCode && pop() && Toast.show('提交成功!')


        }
    })
)
export  default  class Account extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            securedAssets: "信用",
            borrowingPriority: "额度",
            visible: false,
            moneyTime:moment().hour(50).format("YYYY-MM-DD"),
        }
    }

    shouldComponentUpdate(nextProps: Object,nextState:Object) {
        return !immutable.is(this.props, nextProps) ||
                !immutable.is(this.state,nextState)

    }

    static propTypes = {
        load: PropTypes.func.isRequired,
    };
    static defaultProps = {
        data: immutable.fromJS({})
    };


    componentDidMount() {
        this.props.load()
    }


    __renderTipProgress(titleArray, index, lineStatu, direction): ReactElement<any> {
        const rightPosition = (Dimensions.get('window').width ) - 52.5
        const leftPosition = 52.5;
        return (
            <View style={styles.tipProgressView}>
                <TipProgress index={index} style={styles.propgress} direction={direction}/>
                <View style={styles.subProgressTip}>
                    {(titleArray.map((title)=> {
                        return ( <Text key={title} style={styles.progressTipText}>{title}</Text>)
                    }))}
                </View>
                {lineStatu != 'hidden' && (<View style={[styles.verticalLine,
                {left:lineStatu == 'left'?leftPosition:rightPosition}]}/>)}
            </View>
        )
    }


    map(item): string {
        let res = "无报告";

        if (item == "1") res = "待处理"
        if (item == "2") res = "同意"
        if (item == "3") res = "拒绝"

        return res;

    }

    map1(item): string {
        let res = "未通过";

        if (item == "1") res = "通过"
        if (item == "2") res = "待审核"
        if (item == "3") res = "审核中"

        return res;

    }


    showActionSheet(message: string, key, op: any) {
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
                if (buttonIndex != BUTTONS.length - 1) {
                    this.setState({[key]: BUTTONS[buttonIndex]});
                }

            });
    }


    _renderRowMain(title: string, placeholder: string, key: string, boardType: PropTypes.oneOf = 'default',
                   autoFocus: bool = false, maxLength: number = 40,
                   ref: string) {

        return (
            <View >
                <View style={styles.row}>
                    <Text style={styles.textStyle}>{title}</Text>
                    <TextInput
                        ref={ref}
                        placeholderTextColor="rgba(180,180,180,1)"
                        selectionColor={mainColor}
                        returnKeyType='next'
                        autoFocus={autoFocus}
                        maxLength={maxLength}
                        keyboardType={boardType}
                        style={styles.textInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder={placeholder}
                        clearButtonMode='while-editing'
                        enablesReturnKeyAutomatically={true}
                        //onSubmitEditing={() =>this.focusNextField(ref)}
                        onChangeText={(text)=>{this.setState({ [key]: text});}}/>
                    <Text style={styles.textStyle}>万元</Text>
                </View>
                <View style={styles.separator}/>
            </View>
        )
    }

    _renderRow(title: string, dex: string, onPress: Function, showArrow: bool = false) {
        return (
            <View>
                <TouchableOpacity onPress={()=>onPress(title)}>
                    <View style={styles.row}>
                        <Text style={[styles.rowText,{marginRight:15}]}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.dex}>{dex}</Text>
                            {showArrow && (<View style={styles.arrowView}/>)}
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </TouchableOpacity>
            </View>
        );
    }


    _renderDatePikcerRow = (title: string, dex: string, onPress: Function)=> {
        const zhNow = moment().locale('zh-cn').utcOffset(8);
        return (
            <DatePicker
                mode="date"
                title="选择日期"
                visible={this.state.visible}
                minDate={zhNow}
                onOk={() => {this.setState({visible:false})}}
                onChange={(monmet)=>{
                    const text = monmet.format("YYYY-MM-DD")
                    this.setState({moneyTime:text})
                }}
                onDismiss={() => this.setState({visible:false})}
            >
                <View>
                    <TouchableOpacity style={styles.row} 
                                      onPress={()=>{
                                          this.setState({visible:true})
                                      }}>
                        <Text style={[styles.rowText,{marginRight:15}]}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.dex}>{dex}</Text>
                            <View style={styles.arrowView}/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.separator}/>
                </View>
            </DatePicker>
        )
    }

    render(): ReactElement<any> {
        let data = this.props.data.toJS().data || [{}]
        // console.log('test:', data);
        data = data[0]
        // console.log('test:', data);
        let securedAssets = "信用"
        if (data.securedAssets == "1") {
            securedAssets = "房产"
        }
        if (data.securedAssets == "2") {
            securedAssets = "汽车"
        }

        let borrowingPriority = "额度"
        if (data.borrowingPriority == "1") {
            borrowingPriority = "利率"
        }
        if (data.borrowingPriority == "2") {
            borrowingPriority = "时效"
        }

        let financingPriority = data.financingPriority || "0"
        // financingPriority = '100000000000'
        financingPriority = financingPriority.indexOf('1') != -1 ? 12 - financingPriority.indexOf('1') : 0
        console.log('financingPriority:', financingPriority);

        const flag = data.checkStatus == 0 || data.checkStatus == 2

        return (
            <ScrollView style={[this.props.style,styles.wrap]}>
                {/*{this._renderRow('账号',this.props.userData.mobilePhoneNumber ,() => {

                 })}*/}
                {this._renderRow('标题', data.title, () => {
                })}

                {(data.checkStatus != 0 && data.checkStatus != 2) &&
                this._renderRow('借款额度', data.financingLimit || 0 + "万元", () => {
                })}
                {flag &&
                this._renderRowMain("借款额度", "请填写", "financingLimit", "numeric", true)}
                {!flag && this._renderRow('到款时间', data.moneyTime, () => {
                }, flag)}
                {flag && this._renderDatePikcerRow("到款时间",
                    this.state.moneyTime)}
                {this._renderRow('担保资产', flag ? this.state.securedAssets : securedAssets, () => {
                    flag && this.showActionSheet("担保资产", "securedAssets", ["信用", "房产", "汽车"])
                }, flag)}
                {this._renderRow('借款优先', flag ? this.state.borrowingPriority : borrowingPriority, () => {
                    flag && this.showActionSheet("借款优先",
                        "borrowingPriority", ["额度", "利率", "时效"])
                }, flag)}
                <View>
                    {this.__renderTipProgress(['需求确认', '信息录入', '材料收集', '材料审核'], financingPriority,
                        'hidden')}
                    {this.__renderTipProgress(['需求确认1', '信息录入1', '材料收集1', '材料审核1']
                        , financingPriority - 3, 'right', "right")}
                    {this.__renderTipProgress(['需求确认2', '信息录入2', '材料收集2', '材料审核2'],
                        financingPriority - 8, 'left')}
                    <View style={[styles.line]}/>
                </View>

                {this._renderRow('材料审核', this.map1(data.checkStatus), () => {
                    data.checkStatus == 0 &&
                    push({key:"FinanceTip",checkInfo:data.checkInfo})
                }, data.checkStatus == 0)}
                {this._renderRow('融资规划预案', this.map(data.prePlanState), () => {
                })}
                {this._renderRow('签约计划', this.map(data.signPlanState), () => {
                })}
                {this._renderRow('还款计划表', this.map(data.repaymentTableState), () => {
                })}
                {this._renderRow('费用计算表', this.map(data.costTableState), () => {
                })}
                {this._renderRow('结案报告', this.map(data.closedReportState), () => {
                })}

                <View>
                    <Button inline style={{ margin: 10 }}
                            onClick={()=>{
                                this.props.submit(this.state,data)
                            }}>{flag?"提交审核":"确定"}</Button>
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
        marginTop: 25,

    },
    verticalLine: {
        height: 35,
        backgroundColor: 'black',
        width: StyleSheet.hairlineWidth,
        zIndex: 100,
        position: 'absolute',
        top: -12,
    },
    rowMainStyle: {

        flex: 1,
        height: 40,
        marginTop: 10,
        backgroundColor: 'rgba(200,200,200,0.1)',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
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
    textStyle: {
        // flex: ,
        fontSize: 14,
        color: blackFontColor,
    },
    textInputStyle: {
        // width:200,
        flex: 1,
        marginLeft: 10,
        textAlign: 'right',
        fontSize: 14,
        color: 'black',
        marginTop: 2,
        marginRight: 5,
    },
})
