/**
 * Created by lintong on 2017/2/13.
 * @flow
 */
'use strict';


import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Button,
    Linking,
} from 'react-native'
import { SearchBar } from 'antd-mobile';

import {mainColor} from '../../configure'
import {connect} from 'react-redux'
import * as immutable from 'immutable';
import BaseListView from '../../components/Base/BaseListView';
import {listLoad, listLoadMore} from '../../redux/actions/list'
import {phxr_query_person_list} from '../../request/qzapi'
import {push} from '../../redux/nav'
const listKey = 'MenberList'
function myListLoad(more: bool = false) {
    return (dispatch, getState) => {
        const id = getState().login.data.userId
        const params = phxr_query_person_list(id)
        more?dispatch(listLoadMore(listKey,params)):dispatch(listLoad(listKey,params))
    }
}


@connect(
    state =>({
        data: state.list.get(listKey),
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
        load: ()=>dispatch(myListLoad()),
        loadMore: ()=>dispatch(myListLoad(true)),

    })
)

export default class MenberList extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {
        load: PropTypes.func.isRequired,
        loadMore: PropTypes.func.isRequired,
    };
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props.data, nextProps.data)
    }

    makePhone(number:string){
        Linking.openURL('tel:10086')
    }

    renderRow(itme: Object, sectionID: number, rowID: number) {

        return (
            <TouchableOpacity
                style={{marginTop:10}}
                onPress={()=>{
                    push('MemberInfo')
            }}>
                <View style={styles.row}>
                    <View>
                        <Text>黄xx</Text>
                        <Text style={{marginTop:10,color:'rgb(150,150,150)'}}>13588834854</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{marginRight:10}}>
                            <Text style={{textAlign:'right'}}>45%</Text>
                            <Button onPress={this.makePhone} style={{marginTop:10,}} title='通话'/>
                        </View>
                        <View style={styles.arrowView}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    onChange(){

    }

    _renderHeader(){
        return(
            <View>
                <SearchBar
                    //value={this.state.value}
                    placeholder="搜索"
                    onSubmit={(value) => console.log(value, 'onSubmit')}
                    onClear={(value) => console.log(value, 'onClear')}
                    onFocus={() => console.log('onFocus')}
                    onBlur={() => console.log('onBlur')}
                    onChange={this.onChange}
                />
            </View>
        )
    }

    render() {

        const loadStatu = this.props.data && this.props.data.get('loadStatu')
        let listData = this.props.data && this.props.data.get('listData')
        listData = listData && listData.toJS()
        listData = ['11', '22'];

        return (

            <BaseListView
                renderHeader={this._renderHeader}
                style={[this.props.style,styles.list]}
                loadStatu="LIST_NORMAL"
                loadData={this.props.load}
                dataSource={listData}
                loadMore={this.props.loadMore}
                renderRow={this.renderRow.bind(this)}
            />
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
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




