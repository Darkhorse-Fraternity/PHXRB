/**
 * Created by lintong on 2017/2/13.
 * @flow
 */
'use strict';


import { ActionSheet } from 'antd-mobile';

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
import {send} from '../../request'
import {
    phxr_query_person_credit,
    phxr_submit_person_credit,
} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
import {Toast} from '../../util'
//static displayName = MemberInfo
@connect(
    state =>({
        data:state.req.get("phxr_query_person_credit")
    }),
    (dispatch,props) =>({
        //...bindActionCreators({},dispatch),
        load: ()=> {
            const userId = props.scene.route.userId
            const params = phxr_query_person_credit(userId)
            dispatch(request('phxr_query_person_credit', params))
        },
        submit:(key,value,creditId="")=>{
            dispatch(async (dispatch,getState)=>{

                try{
                    const userId = props.scene.route.userId
                    const params = phxr_submit_person_credit(creditId,
                        userId,{[key]:value})
                    console.log('test:', params);
                    const response = await send(params)
                    if(response.rspCode =="0000"){
                        const params = phxr_query_person_credit(userId)
                        dispatch(request('phxr_query_person_credit', params))
                    }else{
                        Toast.show(response.rspMsg)
                    }

                }catch (e){
                    Toast.show(e.message())
                }

            })
        }
    })
)
export  default  class Credit extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {
        data:immutable.fromJS({})
    };

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }

    componentDidMount() {
        this.props.load()
    }

    showActionSheet=(message:string,key,op:any)=> {
        const wrapProps = {onTouchStart: e => e.preventDefault()}
        const BUTTONS = op.concat('取消')
        const data = this.props.data.toJS().data || {}
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
                // this.setState({ clicked: BUTTONS[buttonIndex] });
                if(buttonIndex !=  BUTTONS.length - 1){
                    this.props.submit(key,buttonIndex,data.creditId)
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
                            <View style={styles.arrowView}/>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    render(): ReactElement<any> {
        const BUTTONS = ['0', '1', '2', '3', '4','5','6','6次以上'];

        const data = this.props.data.toJS().data || {}
        console.log('test:', data);
        return (
            <ScrollView style={[this.props.style,styles.wrap]}>

                <View style={styles.groupSpace}/>
                {this._renderRow('近一年是否有贷款及信用卡还款累计逾期次数',
                    BUTTONS[data.totalOverdueTimesOneYear],
                    (title) => {
                    this.showActionSheet(title,"totalOverdueTimesOneYear",BUTTONS)
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('近两年是否有贷款及信用卡还款累计逾期次数',
                    BUTTONS[data.totalOverdueTimesTwoYear],
                    (title) => {
                    this.showActionSheet(title,"totalOverdueTimesTwoYear",BUTTONS)
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('近三年是否有贷款及信用卡还款累计逾期次数',
                    BUTTONS[data.totalOverdueTimesThreeYear],
                    (title) => {
                    this.showActionSheet(title,"totalOverdueTimesThreeYear",BUTTONS)
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('5年内是否存在资产处置、担保代偿要求',
                    ["是","否"][data.assetDisposalGuaranteeFiveYear],
                    (title) => {
                    this.showActionSheet(title,"assetDisposalGuaranteeFiveYear",
                        ["是","否"])
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('信用卡账户状态',
                    ["正常","呆账","止付","冻结"][data.creditCardAccountState],
                    (title) => {
                    this.showActionSheet(title,"creditCardAccountState",
                        ["正常","呆账","止付","冻结"])
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('信贷五级分类状态',
                    ["正常","次级","可疑","损失"][data.creditFiveLevelState],
                    (title) => {
                    this.showActionSheet(title,"creditFiveLevelState",
                        ["正常","次级","可疑","损失"])
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('对外担保贷款状态',
                    ["正常","次级","可疑","损失","无要求"][data.securedLoanState],
                    (title) => {
                    this.showActionSheet(title,"securedLoanState",
                        ["正常","次级","可疑","损失","无要求"])
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('近一个月贷款及信用卡审批查询次数',
                    BUTTONS[data.approvalQueryTimesOneMonth],
                    (title) => {
                    this.showActionSheet(title,"approvalQueryTimesOneMonth",BUTTONS)
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('近三个月贷款及信用卡审批查询次数',
                    BUTTONS[data.approvalQueryTimesThreeMonth],
                    (title) => {
                    this.showActionSheet(title,"approvalQueryTimesThreeMonth",BUTTONS)
                })}

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
