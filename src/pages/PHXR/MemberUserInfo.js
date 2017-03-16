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
    TouchableOpacity,
    Text,
    ScrollView
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {phxr_query_person_info} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
import {push} from '../../redux/nav'
//static displayName = Account
@connect(
    state =>({
        //state:state.util.get()
        data:state.req.get('phxr_query_person_info')
    }),
    (dispatch,props) =>({
        //...bindActionCreators({},dispatch),
        load:()=>{
            dispatch(async (dispatch,getState)=>{
                // const uid = getState().login.data.userId
                const params = phxr_query_person_info(props.scene.route.userId)
                await dispatch(request('phxr_query_person_info',params))
            })

        }
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
    static defaultProps = {
        data:immutable.fromJS({
            data:{}
        })
    };

    componentDidMount() {
        this.props.load()
    }

    _renderRow(title: string, des: string,point:string,onPress: Function) {


        let arr = []
        if (point == 'marriageStatus') {
            arr = ["未婚", "已婚", "离婚"]
            des =  arr[des]
        }


        if(point == "companyNature"){
            arr = ["政府机关", "事业单位", "私企","外企"]
            des =  arr[des]
        }

        if (point == "jobLevel"){
            arr = ["普通员工", "中层管理", "高层管理","高层管理","企业主","个体经营者"]
            des =  arr[des]
        }

        if(point == "companySize"){
            arr = ["20人以下", "20人至50人", "50人至100人","100人以上"]
            des =  arr[des]
        }


        return (
            <View>
                <TouchableOpacity onPress={()=>{
                    if(point != "advisersCode"){
                        push({key:'MemberUserInfoDetail',index:title,point,des:des?des + "":"",
                    userId:this.props.scene.route.userId})
                    }
                }}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.rowDesText}>
                                {des||"未填写"}
                            </Text>
                            {point != "advisersCode" && (<View style={styles.arrowView}/>)}
                        </View>
                    </View>

                </TouchableOpacity>
                <View style={styles.separator}/>
            </View>
        );
    }


    render(): ReactElement<any> {
        let data = this.props.data.toJS().data || {}
        console.log('test:', data);
        return (
            <ScrollView style={[this.props.style,styles.wrap]}>
                {/*{this._renderRow('账号',this.props.userData.mobilePhoneNumber ,() => {

                 })}*/}
                {this._renderRow('姓名', data.customerName,'customerName', () => {
                    {/*console.log('test:', '11111');*/}
                })}

                {this._renderRow('性别', data.sex == "0"?"男":"女", "sex",() => {
                })}
                {this._renderRow('出生日期', data.birthday,"birthday",() => {
                })}
                {this._renderRow('身份证', data.cardNum, "cardNum",() => {})}
                {this._renderRow('联系方式', data.telNum, "telNum",() => {})}
                {this._renderRow('邮箱', data.email, "email",() => {})}
                {this._renderRow('城市', data.homeCity == 591?"福州":"厦门","homeCity", () => {})}
                {this._renderRow('婚姻状态', ["未婚","已婚","离婚"][data.isMarriage],
                    "isMarriage", () => {})}
                {this._renderRow('配偶姓名', data.spouseName,"spouseName", () => {})}
                {this._renderRow('配偶身份证', data.spouseIdCardNo,"spouseIdCardNo" ,() => {})}
                {this._renderRow('配偶电话', data.spouseTelNum, "spouseTelNum" ,() => {})}
                {this._renderRow('居住地址', data.userAddr,"userAddr" ,() => {})}
                {this._renderRow('邮编', data.postCodes,"postCodes",() => {})}
                {this._renderRow('户籍地址', data.familyRegisterAddr,"familyRegisterAddr", () => {})}
                {this._renderRow('工作单位', data.companyName,"companyName", () => {})}
                {this._renderRow('单位地址', data.officeAddr,"officeAddr", () => {})}
                {this._renderRow('单位性质', data.companyNature, "companyNature",() => {})}
                {this._renderRow('单位规模', data.companySize, "companySize",() => {})}
                {this._renderRow('单位人员规模', data.companySize,"companySize", () => {})}
                {this._renderRow('在岗职位', data.job,"job", () => {})}
                {this._renderRow('职位水平', data.jobLevel,"jobLevel", () => {})}
                {this._renderRow('入职时间', data.entryDate, "entryDate",() => {})}
                {this._renderRow('月工资水平', data.monthlyWages,"monthlyWages", () => {})}
                {this._renderRow('提供工作证明文件', data.provideWorkCertificate?"是":"否",
                    "provideWorkCertificate",
                    () => {})}
                {this._renderRow('非配偶直系亲属姓名1', data.immediateFamilyName1,"immediateFamilyName1",
                    () => {})}
                {this._renderRow('非配偶直系亲属手机1', data.immediateFamilyPhone1,"immediateFamilyPhone1",
                    () => {})}
                {this._renderRow('非配偶直系亲属姓名2', data.immediateFamilyName2,"immediateFamilyName2",
                    () => {})}
                {this._renderRow('非配偶直系亲属手机1', data.immediateFamilyPhone2,"immediateFamilyPhone2",
                    () => {})}
                {this._renderRow('咨询顾问服务代码', data.advisersCode,"advisersCode",
                    () => {})}


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
        marginRight:15,
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
