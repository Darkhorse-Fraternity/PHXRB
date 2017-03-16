/**
 * Created by lintong on 2017/2/16.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native'
import {deepFontColor, backViewColor, blackFontColor, mainColor} from '../../configure'
import {connect} from 'react-redux'
import moment from 'moment';
import { ActionSheet ,DatePicker} from 'antd-mobile';
import {bindActionCreators} from 'redux';
import {phxr_submit_person_car,
    phxr_query_person_car,
    phxr_query_person_assets_list} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
import {renderNavSenderButton} from '../../util/viewUtil'
import {pop,refresh} from '../../redux/nav'
import {send} from '../../request'
import {Toast} from '../../util'
//static displayName = AddHouse
const isEmpty = value => value === undefined || value === null || value === '';
@connect(
    state =>({
        data:state.req.get("phxr_query_person_car")
    }),
    (dispatch, props) =>({
        //...bindActionCreators({},dispatch),
        submit: (state)=> {
            dispatch(async (dispatch, getState)=> {
                const userId = props.scene.route.userId
                //做验证
                //0、多选转化
                //1、判断不为空
                //2、身份证和电话号码判断
                //3、判断actType
                if(isEmpty(state.brand)){
                    Toast.show('品牌不能为空')
                    return;
                }
                if(isEmpty(state.model)){
                    Toast.show('型号不能为空')
                    return;
                }
                if(isEmpty(state.plateNumber)){
                    Toast.show('车牌号不能为空')
                    return;
                }
                if(isEmpty(state.kilometers)){
                    Toast.show("公里数不能为空")
                    return;
                }
                if(isEmpty(state.totalTradeTimes)){
                    Toast.show('总过户数不能为空')
                    return;
                }
                if(isEmpty(state.tradeTimesOneYear)){
                    Toast.show('近一年内过户次数不能为空')
                    return;
                }



                const newState ={
                    useType:["非营运","营运"].indexOf(state.useType)+"",
                    carType:["乘用车", "客车", "货车", "牵引汽车"].indexOf(state.carType)+"",
                    pledge:["否","是"].indexOf(state.pledge)+"",
                    seized:["否","是"].indexOf(state.seized)+"",
                    annualVerification:["否","是"].indexOf(state.annualVerification)+"",
                    registerCompany:["否","是"].indexOf(state.registerCompany)+"",
                    blackPlate:["否","是"].indexOf(state.blackPlate)+"",
                    owner:["否","是"].indexOf(state.owner)+"",
                }

                // console.log('props.scene.route.actType:', props.scene.route.actType);
                const param = {
                    ...state,
                    userId,
                    actType: props.scene.route.actType||"0",

                    carId:props.scene.route.assetsId,
                    ...newState
                }
                try {
                    const params = phxr_submit_person_car(param)
                    const res = await send(params)
                    // console.log('res:', res);
                    if(res.rspCode == "0000"){
                        const params2 = phxr_query_person_assets_list(userId)
                        dispatch(request('phxr_query_person_assets_list', params2))
                        Toast.show("提交成功")
                        pop()
                    }else {
                        Toast.show(res.rspMsg)
                    }

                } catch (e) {
                    Toast.show(e.message)
                }

            })
        },
        load:()=>{
            const userId = props.scene.route.userId
            const params =phxr_query_person_car(userId,props.scene.route.assetsId)
            dispatch(request('phxr_query_person_car', params))
        }
    })
)
export  default  class AddCar extends Component {
    constructor(props: Object) {
        super(props);
        this.state={
            brand:"",
            useType:"非营运",
            carType:"乘用车",
            model:"",
            plateNumber:"",
            kilometers:"",
            productionDate:moment().format("YYYY-MM-DD"),
            buyDate:moment().format("YYYY-MM-DD"),
            totalTradeTimes:"",
            tradeTimesOneYear:"",
            pledge:"否",
            seized:"否",
            annualVerification:"否",
            registerCompany:"否",
            blackPlate:"否",
            owner:"否",
            ownerName:"",
            ownerIdCardNo:"",
            ownerPhoneNo:"",
            ownerRelation:"",

        }

    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object,nextState:Object) {
        return !immutable.is(this.props, nextProps)||
            !immutable.is(this.state,nextState)
    }

    _tapRight() {
        this.props.submit(this.state)
    }

    componentDidMount() {
        const rightBtn = renderNavSenderButton(this._tapRight.bind(this))
        refresh({renderRightComponent: rightBtn});
        if(this.props.scene.route.assetsId){
            this.props.load()
        }
        if(this.props.scene.route.assetsId){
            refresh({title: "修改车辆信息"});
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data && this.props.scene.route.assetsId){
            let data =  nextProps.data.toJS().data
            // console.log('nextProps.data:', data);
            if(data){
                data = {
                    ...data,
                    useType:["非营运","营运"][data.useType],
                    carType:["乘用车", "客车", "货车", "牵引汽车"][data.carType],
                    pledge:["否","是"][data.pledge],
                    seized:["否","是"][data.seized],
                    annualVerification:["否","是"][data.annualVerification],
                    registerCompany:["否","是"][data.registerCompany],
                    blackPlate:["否","是"][data.blackPlate],
                    owner:["否","是"][data.owner],
                }
                this.setState(data)
            }
            //
        }

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
                   unit:string ='',
                   autoFocus: bool = false, maxLength: number = 40,
                   ref: string) {

        return (
            <View style={styles.rowMainStyle}>
                <Text style={styles.textStyle}>{title}</Text>
                <TextInput
                    value={this.state[key]+""}
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
                <Text style={styles.textStyle}>{unit}</Text>
            </View>
        )
    }

    _renderRow(title: string, dex: string, onPress: Function) {
        return (
            <View>
                <TouchableOpacity onPress={()=>onPress(title)}>
                    <View style={styles.row}>
                        <Text style={[styles.rowText,{marginRight:15}]}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.dex}>{dex}</Text>
                            <View style={styles.arrowView}/>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderDatePikcerRow = (title: string, dex: string,key:string, onPress: Function)=> {
        const zhNow = moment();
        const minDate = moment("1950-01-01");
        return (
            <DatePicker
                mode="date"
                title="选择日期"
                visible={this.state[key+"_visible"]}
                maxDate={zhNow}
                minDate={minDate}
                onOk={() => {this.setState({[key+"_visible"]:false})}}
                onChange={(monmet)=>{
                    const text = monmet.format("YYYY-MM-DD")
                    this.setState({[key]:text})
                }}
                onDismiss={() => this.setState({[key+"_visible"]:false})}
            >
                {this._renderRow(title,this.state[key],()=>{
                    this.setState({[key+"_visible"]:true})
                })}
            </DatePicker>
        )
    }

    render(): ReactElement<any> {
        return (
            <ScrollView
                style={styles.wrap}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode='interactive'>

                {this._renderRow('机动车类型:', this.state.carType, (title) => {
                    this.showActionSheet(title,"carType", ["乘用车", "客车","货车","牵引汽车",
                        ])
                })}

                {this._renderRow('使用性质:', this.state.useType, (title) => {
                    this.showActionSheet(title,"useType" ,["营运", "客车","货车","牵引汽车",
                    ])
                })}

                {this._renderRowMain('品牌:', '',"brand"
                )}
                {this._renderRowMain('型号:', '',"model"
                )}
                {this._renderRowMain('车牌号:', '',"plateNumber"
                )}
                {this._renderRowMain('公里数:', '',"kilometers","numeric","公里"
                )}
                {this._renderDatePikcerRow('出产日期:', '',"productionDate")}
                {this._renderDatePikcerRow('购买日期:', '',"buyDate")}

                {this._renderRowMain('总过户次数:', '',"totalTradeTimes","numeric",'次'

                )}
                {this._renderRowMain('近一年内过户次数:', '',"tradeTimesOneYear","numeric","次"

                )}
                {this._renderRow('车管所抵押:', this.state.pledge, (title) => {
                    this.showActionSheet(title,"pledge", ["是","否"])
                })}
                {this._renderRow('查封车:', this.state.seized, (title) => {
                    this.showActionSheet(title,"seized", ["是","否"])
                })}
                {this._renderRow('正常年审:',this.state.annualVerification, (title) => {
                    this.showActionSheet(title, "annualVerification",["是","否"])
                })}
                {this._renderRow('注册在公司:',this.state.registerCompany, (title) => {
                    this.showActionSheet(title,'registerCompany', ["是","否"])
                })}
                {this._renderRow('黑牌车:',this.state.blackPlate, (title) => {
                    this.showActionSheet(title,"blackPlate" ,["是","否"])
                })}
                {this._renderRow('自有机动车:',this.state.owner, (title) => {
                    this.showActionSheet(title, "owner",["是","否"])
                })}
                {this._renderRowMain('所有人的姓名:', '',"ownerName"
                )}
                {this._renderRowMain('所有人的身份证:', '',"ownerIdCardNo"
                )}
                {this._renderRowMain('所有人的电话:', '',"ownerPhoneNo","numeric"
                )}
                {this._renderRowMain('于本人关系:', '',"ownerRelation"
                )}

            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor:'white'
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
    row: {
        marginTop: 15,
        backgroundColor: 'rgba(200,200,200,0.1)',
        padding: 29 / 2,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    row2: {
        flex: 1,
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
    textStyle: {
        // flex: ,
        fontSize: 14,
        color: blackFontColor,
    },
    textInputStyle: {
        // width:200,
        flex: 1,
        marginLeft: 10,
        textAlign: 'left',
        fontSize: 14,
        color: 'black',

    },
})
