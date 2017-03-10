/**
 * Created by lintong on 2017/2/2.
 * @flow
 */
'use strict';


import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native'

import {mainColor} from '../../configure'
import {connect} from 'react-redux'
import * as immutable from 'immutable';
import BaseListView from '../../components/Base/BaseListView';
import {listLoad, listLoadMore} from '../../redux/actions/list'
import {push} from '../../redux/nav'

import {phxr_query_financing_list} from '../../request/qzapi'
import {request} from '../../redux/actions/req'



@connect(
    (state,props) =>({
        //state:state.util.get()
        data:state.req.get('phxr_query_financing_list'+props.businessSate)
    }),
    (dispatch,props) =>({
        //...bindActionCreators({},dispatch),
        load:()=>{
            dispatch(async (dispatch,getState)=>{
                const uid = getState().login.data.userId
                const params = phxr_query_financing_list("1",uid,props.businessSate)
                await dispatch(request('phxr_query_financing_list'+props.businessSate,params))
            })

        }
    })
)

export default class List extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {
        load: PropTypes.func.isRequired,
    };
    static defaultProps = {
        data:immutable.fromJS({
            data:[]
        })
    };

    componentDidMount() {
        this.props.load()
    }

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }


    renderRow(item: Object, sectionID: number, rowID: number) {

        // console.log('item:', item);

        let financingState = '审核中'
        if(item.financingState == "1") financingState = "已办理"
        if(item.financingState == "2") financingState = "已完成"
        if(item.financingState == "3") financingState = "已结案"

        return (
            <TouchableOpacity
                style={{marginTop:10}}
                onPress={()=>{
                    {/*push({key:'Business',businessId:item.businessId})*/}
                    push({key:'FinanceDetail',businessId:item.businessId})
            }}>
                <View style={styles.row}>
                    <View>
                        <Text>{item.title}</Text>
                        <Text style={{marginTop:10,color:'rgb(150,150,150)'}}>{item.phoneNo}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{marginRight:10}}>
                            <Text style={{textAlign:'right'}}>{item.dataPercent}</Text>
                            <Text style={{marginTop:10,color:'rgb(150,150,150)'}}>{item.createTime}</Text>
                        </View>
                        <View style={styles.arrowView}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {

        let listData = this.props.data && this.props.data.get('data')
        listData = listData && listData.toJS() || []
        return (
            <BaseListView
                //renderHeader={this._renderHeader}
                style={[this.props.style,styles.list]}
                //loadStatu={loadStatu}
                loadStatu={'LIST_NORMAL'}
                loadData={this.props.load}
                dataSource={listData}
                renderRow={this.renderRow.bind(this)}
            />
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor:'white'
    },
    list: {
        flex: 1,
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    text: {
        marginLeft: 5,
        fontSize: 16,
        color: 'rgb(150,150,150)'
    },
    subText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
        color: 'rgb(200,200,200)'
    },
    date: {
        fontSize: 14,
        color: 'rgb(100,100,100)'
    },
    row: {
        backgroundColor: 'white',
        paddingHorizontal: 18,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'space-between'
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




