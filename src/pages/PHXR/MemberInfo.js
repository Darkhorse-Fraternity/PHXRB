/**
 * Created by lintong on 2017/2/13.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
} from 'react-native'
import {connect} from 'react-redux'
import {push} from '../../redux/nav'
import {bindActionCreators} from 'redux';
import {phxr_query_person_info} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
import {send} from '../../request'
import {updateUserData} from '../../redux/actions/login'
//static displayName = MemberInfo
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
        load:()=>{
            return (dispatch,getState) =>{
                const userId = getState().login.data.userId
                const params = phxr_query_person_info(userId)
                // request('phxr_query_person_info',param)
                // send(param).then(())
                send(params).then(response => {
                    if(response.rspCode){
                        updateUserData(response.result)
                    }
                }).catch(e => {
                    dispatch(requestFailed(key, e.message))
                })



            }

        }
    })
)
export  default  class MemberInfo extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }



    _renderRow(title: string,  onPress: Function) {
        return (
            <View>
                <TouchableHighlight onPress={onPress}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                          <View style={styles.arrowView}/>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }


    render(): ReactElement<any> {
        const userId = this.props.scene.route.userId
        return (
            <View style={[this.props.style,styles.wrap]}>

                <View style={styles.groupSpace}/>
                {this._renderRow('需求信息', () => {
                    // NavigationManager.goToPage("NickName");
                    push({key:"Demand",userId});
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('个人信息', () => {
                    // NavigationManager.goToPage("NickName");
                    push({key:"UserInfo",userId});
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('信用信息', () => {
                    // NavigationManager.goToPage("NickName");
                    push({key:"Credit",userId});
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('资产信息', () => {
                    // NavigationManager.goToPage("NickName");
                    push({key:"AssetsList",userId});
                })}
                <View style={styles.groupSpace}/>
                {this._renderRow('资料信息', () => {
                    // NavigationManager.goToPage("NickName");
                    push({key:"Information",userId});
                })}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
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
        color: 'black',
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

})
