/**
 * Created by lintong on 2017/2/12.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {refresh, pop} from '../../redux/nav'
import {bindActionCreators} from 'redux';
import {renderNavSenderButton} from '../../util/viewUtil'
import {ActionSheet, DatePicker} from 'antd-mobile';
import {deepFontColor, backViewColor, blackFontColor, mainColor} from '../../configure'
import {phxr_submit_person_info,
    phxr_query_person_info,
    phxr_query_person_list,
    phxr_act_account} from '../../request/qzapi'
import {send} from '../../request'
import {request} from '../../redux/actions/req'
import {updateUserData} from '../../redux/actions/login'
import moment from 'moment';
import {listLoad} from '../../redux/actions/list'
import {Toast, checkPhoneNum, checkIDCard} from '../../util'
//static displayName = UserInfoDetail
@connect(
    state =>({
        //state:state.util.get()
    }),
    (dispatch,props) =>({
        //...bindActionCreators({},dispatch),
        load:  (param)=> {
            dispatch(async (dispatch, getState) => {
                // const userId = getState().login.data.userId
                const params = phxr_submit_person_info(props.scene.route.userId, param)
                // request('phxr_query_person_info',param)
                // send(param).then(())
                try {
                    const response = await send(params)
                    if (response.rspCode == "0000") {
                        // console.log('response:', response.result);
                        Toast.show("修改成功");
                        const params1 = phxr_query_person_info(props.scene.route.userId)
                        dispatch(request('phxr_query_person_info', params1))
                        //更新个人信息

                        const id = getState().login.data.userId
                        const params2 = phxr_query_person_list(id)
                        dispatch(listLoad("MenberList", params2))
                        // const params2 = phxr_act_account(userId)
                        // const response2 = await send(params2)
                        // if (response2.rspCode) {
                        //     dispatch(updateUserData(response2.result))
                        // }

                        pop()

                    }else {
                        Toast.show(response.rspMsg)
                    }
                }catch (e){
                    dispatch(requestFailed("phxr_query_advisers_info", e.message))
                }
            })

        }
    })
)

export  default  class UserInfoDetail extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            clicked: "",
            visible:false,
        }
    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object, nestState) {
        return !immutable.is(this.props, nextProps) || !immutable.is(this.state, nestState)
    }



    __tapRight = ()=> {

        //做验证
        const point = this.props.scene.route.point
        let clicked = this.state.clicked
        if (point == 'customerName' && clicked.length == 0) {
            Toast.show("姓名不能为空");
            return;
        }

        if (point == "sex") {
            if (clicked == "男") clicked = "0"
            if (clicked == "女") clicked = "1"
        }

        if (point == 'telNum' && !checkPhoneNum(clicked)) {
            Toast.show("不是正确的电话号码");
            return;
        }

        // if (point == 'cardNum' && !checkIDCard(clicked)) {
        //     Toast.show("不是正确的身份证号码");
        //     return;
        // }

        if (point == 'homeCity') {
            if (clicked == "福州") clicked = "591"
            if (clicked == "厦门") clicked = "592"
        }

        if (point == 'isMarriage') {
            if (clicked == "未婚") clicked = "0"
            if (clicked == "已婚") clicked = "1"
            if (clicked == "离婚") clicked = "2"
        }

        let arr = []
        if(point == "companyNature"){
            arr = ["政府机关", "事业单位", "私企","外企"]
            clicked =  arr.indexOf(clicked)

        }

        if (point == "jobLevel"){
            arr = ["普通员工", "中层管理", "高层管理","高层管理","企业主","个体经营者"]
            clicked =  arr.indexOf(clicked)
        }

        if(point == "companySize"){
            arr = ["20人以下", "20人至50人", "50人至100人","100人以上"]
            clicked =  arr.indexOf(clicked)
        }
        if(point == "provideWorkCertificate"){
            arr = ["否", "是"]
            clicked =  arr.indexOf(clicked)
        }


        const phones = ["immediateFamilyPhone1","immediateFamilyPhone2","spouseTelNum","telNum"]
        if(phones.indexOf(point) != -1 && !checkPhoneNum(clicked)){
            Toast.show("不是正确的手机号码")
            return
        }

        const ids = ["spouseIdCardNo","cardNum"]
        if(ids.indexOf(point) != -1 && !checkIDCard(clicked)){
            Toast.show("不是正确的身份证号码")
            return
        }

        if (clicked.length == 0) {
            Toast.show("数据不能为空。");
            return;
        }
        this.props.load({[point]: clicked})


    }

    componentDidMount() {

        const rightBtn = renderNavSenderButton(this.__tapRight)
        refresh({
            renderRightComponent: rightBtn,
            rightButtonDisabled: false,
            rightButtonIsLoad: false
        });
        this.props.scene.route.des && this.setState({clicked:this.props.scene.route.des})
    }

    __renderInputRow(name, props): ReactElement<any> {
        const point = this.props.scene.route.point
        let keyboardType = "default"
        if (point == "postCodes" || point == "serviceCode" || point == "telNum"
            || point == "spouseTelNum" || point == "immediateFamilyPhone1"
            || point == "immediateFamilyPhone2"||point == "monthlyWages") {
            keyboardType = 'numeric'
        }
        return (
            <View style={styles.row}>
                <Text style={styles.textStyle}>{name}</Text>
                <TextInput
                    value = {this.state.clicked}
                    style={styles.textInputStyle}
                    placeholder={"请输入您的" + name}
                    keyboardType={keyboardType}
                    underlineColorAndroid='transparent'
                    clearButtonMode='while-editing'
                    enablesReturnKeyAutomatically={true}
                    onSubmitEditing={this.__tapRight}
                    onChangeText={(text)=>this.setState({clicked: text})}
                    {...props}
                />
            </View>
        )
    }

    _renderRow(title: string, dex: string, onPress: Function) {
        return (
            <TouchableOpacity onPress={()=>onPress(title)}>
                <View style={styles.rowx}>
                    <Text style={[styles.rowText,{marginRight:15}]}>
                        {title}
                    </Text>
                    <View style={styles.row2}>
                        <Text style={styles.dex}>{dex}</Text>
                        <View style={styles.arrowView}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _renderDatePikcerRow(title: string, dex: string, onPress: Function) {
        const zhNow = moment();
        const minDate = moment("1950-01-01");
        return (
            <DatePicker
                mode="date"
                title="选择日期"
                visible={this.state.visible}
                minDate={minDate}
                maxDate={zhNow}
                onOk={() => {this.setState({visible:false})}}
                onChange={(monmet)=>{
                    const text = monmet.format("YYYY-MM-DD")
                    //console.log('test:', text);
                    this.setState({clicked:text})
                }}
                onDismiss={() => this.setState({visible:false})}
            >
                <TouchableOpacity style={styles.rowx} onPress={()=>this.setState({visible:true})}>
                    <Text style={[styles.rowText,{marginRight:15}]}>
                        {title}
                    </Text>
                    <View style={styles.row2}>
                        <Text style={styles.dex}>{dex}</Text>
                        <View style={styles.arrowView}/>
                    </View>
                </TouchableOpacity>
            </DatePicker>
        )
    }

    showActionSheet(message: string, op: any) {
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
                    this.setState({clicked: BUTTONS[buttonIndex]});
                }

            });
    }

    render(): ReactElement<any> {
        const point = this.props.scene.route.point


        // console.log('test:', point);
        // console.log('test:', this.state.clicked);

        const array = ['sex',"homeCity","isMarriage","companySize","companyNature","jobLevel","provideWorkCertificate"]
        const flag =  array.indexOf(point) == -1
        return (
            <View style={[this.props.style,styles.wrap]}>

                {flag && point !=  "birthday" && point != 'entryDate'
                && this.__renderInputRow(this.props.scene.route.index, {})}


                {!flag && point !=  "birthday" && point != 'EntryDate'
                && this._renderRow("请选择您的" + this.props.scene.route.index,
                    this.state.clicked, (title) => {
                        var arr = [];
                        if (point == "sex") {
                            arr = ["男", "女"]
                        }
                        if (point == "homeCity") {
                            arr = ["福州", "厦门"]
                        }
                        if (point == "isMarriage") {
                            arr = ["未婚", "已婚", "离婚"]
                        }

                        if(point == "companyNature"){
                            arr = ["政府机关", "事业单位", "私企","外企"]
                        }

                        if (point == "jobLevel"){
                            arr = ["普通员工", "中层管理", "高层管理","高层管理","企业主","个体经营者"]
                        }

                        if(point == "companySize"){
                            arr = ["20人以下", "20人至50人", "50人至100人","100人以上"]
                        }

                        if(point == "provideWorkCertificate"){
                            arr = ["否","是"]
                        }

                        this.showActionSheet(title, arr)
                    })}
                {(point == 'birthday' || point == 'entryDate') &&
                this._renderDatePikcerRow("请选择您的" + this.props.scene.route.index,this.state.clicked)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    row: {
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInputStyle: {
        // width:200,
        flex: 1,
        marginLeft: 0,
        textAlign: 'left',
        fontSize: 14,
        color: 'black',
    },
    textStyle: {
        // flex: ,
        fontSize: 14,
        color: 'black',
        marginLeft: 15,
        marginRight: 15,
    },

    rowx: {
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,

    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowText: {
        fontSize: 14,
        // fontWeight: '500',
        color: blackFontColor,
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
})
