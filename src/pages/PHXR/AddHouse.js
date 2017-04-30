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
import {ActionSheet} from 'antd-mobile';
import {bindActionCreators} from 'redux';
import {phxr_submit_person_house,
    phxr_query_person_house,
    phxr_query_person_assets_list
} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
import {renderNavSenderButton} from '../../util/viewUtil'
import {pop,refresh} from '../../redux/nav'
import {send} from '../../request'
import {Toast} from '../../util'
//static displayName = AddHouse

const isEmpty = value => value === undefined || value === null || value === '';
@connect(
    state =>({
        //state:state.util.get()
        data:state.req.get("phxr_query_person_house")
    }),
    (dispatch, props) =>({
        //...bindActionCreators({},dispatch),
        submit: (state)=> {
            dispatch(async(dispatch, getState)=> {
                const userId = props.scene.route.userId
                //做验证
                //0、多选转化
                //1、判断不为空
                //2、身份证和电话号码判断
                //3、判断actType
                if(isEmpty(state.houseAddress)){
                    Toast.show('房屋地址不能为空')
                    return;
                }
                if(isEmpty(state.serviceYears)){
                    Toast.show('已用年限不能为空')
                    return;
                }
                if(isEmpty(state.propertyArea)){
                    Toast.show('产权面积不能为空')
                    return;
                }
                // if(isEmpty(state.useArea)){
                //     Toast.show('实际使用面积不能为空')
                //     return;
                // }
                if(isEmpty(state.totalFloor)){
                    Toast.show('所在建筑总层数不能为空')
                    return;
                }
                if(isEmpty(state.positionFloor)){
                    Toast.show('所处层数不能为空')
                    return;
                }

                if(isEmpty(state.positionFloor)){
                    Toast.show('所处层数不能为空')
                    return;
                }

                if(isEmpty(state.shareName)){
                    Toast.show('公有产权人姓名不能为空')
                    return;
                }


                const newState ={
                    houseCity:state.houseCity == "福州"?"591":"592",
                    houseType:["个人住宅(70年产权)", "商住两用", "商铺", "写字楼",
                        "别墅", "停车位", "自建房", "动迁房", "经济适用房", "预算房"].indexOf(state.houseType)+"",
                    ifElevator:["否","是"].indexOf(state.ifElevator)+"",
                    ifShare:["否","是"].indexOf(state.ifShare)+""
                }
                const param = {
                    ...state,
                    ...newState,
                    userId,
                    actType: props.scene.route.actType||"0",
                    houseId:props.scene.route.assetsId,
                }
                try {
                    const params = phxr_submit_person_house(param)
                    const res = await send(params)
                    if(res.rspCode != '0000') return
                    const params2 = phxr_query_person_assets_list(userId)
                    await dispatch(request('phxr_query_person_assets_list', params2,(res)=>{
                        if(res.rspCode = '0000'){
                            Toast.show("提交成功")
                            pop()
                        }
                    }))
                } catch (e) {
                    Toast.show(e.message)
                }

            })
        },
        load:()=>{
            const userId = props.scene.route.userId
            const params =phxr_query_person_house(userId,props.scene.route.assetsId)
            dispatch(request('phxr_query_person_house', params))
        }
    })
)
export  default  class AddHouse extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            houseAddress: '',
            houseCity: "福州",
            houseType: "个人住宅(70年产权)",
            serviceYears: "",
            propertyArea: "",
            useArea: "",
            totalFloor: "",
            positionFloor: "",
            ifElevator: "否",
            ifShare: "否",
            shareName: "",
            shareIdCardNo: "",
            sharePhoneNo: "",
            shareRelation: ""
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
            console.log('test:', 'xxxxx');
            this.props.load()
        }
        if(this.props.scene.route.assetsId){
            refresh({title: "修改房产"});
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data && this.props.scene.route.assetsId){
            let data =  nextProps.data.toJS().data
            console.log('nextProps.data:', data);
            console.log('test:', 'mmmm');
            if(data){
                data = {
                    ...data,
                    houseCity:data.houseCity == "591"?"福州":"厦门",
                    houseType:["个人住宅(70年产权)", "商住两用", "商铺", "写字楼",
                        "别墅", "停车位", "自建房", "动迁房", "经济适用房", "预算房"][data.houseType],
                    ifElevator:["否","是"][data.ifElevator],
                    ifShare:["否","是"][data.ifShare]
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
                    ref={ref}
                    value={this.state[key]+""}
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


    render(): ReactElement<any> {
        return (
            <ScrollView
                style={styles.wrap}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode='interactive'>

                {this._renderRowMain('*房产地址:', '请填写', "houseAddress"
                )}

                {/*{this._renderRowMain('城市区号:', '福州:591,厦门:592', "houseCity","numeric"*/}
                {/*)}*/}
                {this._renderRow('*所在城市:', this.state.houseCity, (title) => {
                    this.showActionSheet(title, "houseCity",["福州","厦门"])
                })}


                {this._renderRow('*请选房地产类型:', this.state.houseType, (title) => {
                    this.showActionSheet(title, "houseType", ["个人住宅(70年产权)", "商住两用", "商铺", "写字楼",
                        "别墅", "停车位", "自建房", "动迁房", "经济适用房", "预算房"])
                })}
                {this._renderRowMain('*已用年限:', '', "serviceYears","numeric","年"
                )}
                {this._renderRowMain('*产权面积:', '', "propertyArea","numeric","平方"
                )}
                {this._renderRowMain('实际使用面积:', '', "useArea","numeric","平方"
                )}
                {this._renderRowMain('*所在建筑总层数:', '', "totalFloor","numeric","层"
                )}
                {this._renderRowMain('*所处层数:', '', "positionFloor","numeric","层"
                )}
                {this._renderRow('*是否有电梯:', this.state.ifElevator, (title) => {
                    this.showActionSheet(title, "ifElevator", ["是", "否"])
                })}
                {this._renderRow('是否有共有产权人:', this.state.ifShare, (title) => {
                    this.showActionSheet(title, "ifShare", ["是", "否"])
                })}
                {this._renderRowMain('*公有产权人姓名:', '', "shareName"
                )}
                {this._renderRowMain('共有产权人的身份证:', '', "shareIdCardNo"
                )}
                {this._renderRowMain('共有产权人的电话:', '', "sharePhoneNo","numeric"
                )}
                {this._renderRowMain('共有产权人的关系:', '', "shareRelation"
                )}

            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: 'white'
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
        justifyContent: 'space-between',
        marginLeft: 15,
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
