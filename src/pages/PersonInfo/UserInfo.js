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
import {push} from '../../redux/nav'
//static displayName = Account
import {phxr_query_advisers_info} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
import {send} from '../../request'
import {updateUserData} from '../../redux/actions/login'
@connect(
    state =>({
        //state:state.util.get()
        data: state.req.get('phxr_query_advisers_info'),
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
        load:()=>{
             dispatch((dispatch,getState) =>{
                const userId = getState().login.data.userId
                const params = phxr_query_advisers_info(userId)
                 dispatch(request('phxr_query_advisers_info',params))
                // send(param).then(())
                // send(params).then(response => {
                //     if(response.rspCode){
                //         updateUserData(response.result)
                //     }
                // }).catch(e => {
                //     dispatch(requestFailed(key, e.message))
                // })

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

    componentDidMount() {
        this.props.load();
    }

    static propTypes = {};
    static defaultProps = {
        data:immutable.fromJS({})
    };


    _renderRow(title: string, des: string,point:string,onPress: Function) {
        const flag = title != "业务代码"
        return (
            <View>
                <TouchableHighlight onPress={()=>{
                   flag  && push({key:'UserInfoDetail',index:title,point,des:des + ""})
                }}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.rowDesText}>
                                {des||"未填写"}
                            </Text>
                            {flag && (<View style={styles.arrowView}/>)}
                        </View>
                    </View>

                </TouchableHighlight>
                <View style={styles.separator}/>
            </View>
        );
    }

    render(): ReactElement<any> {

        const data = this.props.data.toJS().data || {}

        //console.log('test:', data);
        return (
            <ScrollView style={[this.props.style,styles.wrap]}>
                {/*{this._renderRow('账号',this.props.userData.mobilePhoneNumber ,() => {

                 })}*/}
                {this._renderRow('姓名', data.name, "name",() => {
                })}

                {this._renderRow('性别', data.sex=="0"?"男":"女", "sex",() => {
                })}
                {this._renderRow('身份证', data.cardNum,"cardNum", () => {
                })}
                {this._renderRow('联系方式',  data.telNum, "telNum",() => {})}
                {this._renderRow('邮箱', data.email, "email",() => {})}
                {this._renderRow('城市',  data.homeCity=="591"?"福州":"厦门","homeCity" ,() => {})}
                {this._renderRow('婚姻状况',["未婚","已婚","离婚"][data.isMarriage],"isMarriage", () => {})}
                {this._renderRow('出生日期', data.birthday, "birthday",() => {})}
                {this._renderRow('家庭地址', data.userAddr,"userAddr",() => {})}
                {this._renderRow('邮编', data.postCodes,"postCodes", () => {})}
                {this._renderRow('业务代码', data.serviceCode, "serviceCode",() => {})}

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
        marginRight:10,
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
