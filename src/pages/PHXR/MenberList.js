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
import {SearchBar} from 'antd-mobile';

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
        more ? dispatch(listLoadMore(listKey, params)) : dispatch(listLoad(listKey, params))
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
        this.state = {
            searchText: "",
        }
    }

    static propTypes = {
        load: PropTypes.func.isRequired,
        loadMore: PropTypes.func.isRequired,
    };
    static defaultProps = {
        data: immutable.fromJS({
            listData: {
                content: []
            },
        })
    };

    // shouldComponentUpdate(nextProps: Object, nextState:string) {
    //     return !immutable.is(this.props, nextProps)
    //         || immutable.is(this.state, nextState)
    // }

    makePhone(number: string) {
        Linking.openURL('tel:' + number)
    }

    renderRow(itme: Object, sectionID: number, rowID: number) {

        return (
            <TouchableOpacity
                style={{marginTop:10}}
                onPress={()=>{
                    push({key:'MemberInfo',userId:itme.userId})
            }}>
                <View style={styles.row}>
                    <View>
                        <Text>{itme.customerName}</Text>
                        <Text style={{marginTop:10,color:'rgb(150,150,150)'}}>{itme.telNum}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{marginRight:10}}>
                            <Text style={{textAlign:'right'}}>{itme.dataPercent * 100}%</Text>
                            <Button onPress={()=>this.makePhone(itme.telNum)} style={{marginTop:10,}} title='通话'/>
                        </View>
                        <View style={styles.arrowView}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    _renderHeader() {
        return (
            <View>
                <SearchBar
                    //value={this.state.value}
                    placeholder="搜索"
                    onSubmit={(value) => console.log(value, 'onSubmit')}
                    onClear={(value) => console.log(value, 'onClear')}
                    onFocus={() => console.log('onFocus')}
                    onBlur={() => console.log('onBlur')}
                    onChange={(text)=>{ 
                        if(typeof text == 'string'){
                         this.setState({searchText:text})
                        }

                    }}
                />
            </View>
        )
    }

    render() {

        const loadStatu = this.props.data.get('loadStatu')
        let listData = this.props.data.get('listData').toJS().content

        if (this.state.searchText.length > 0) {
            listData = listData.filter(item => {
                const text = this.state.searchText
                if (item.telNum.indexOf(text) >=0 || item.customerName.indexOf(text)>= 0) {
                    return item
                }
            })
        }

        return (

            <BaseListView
                renderHeader={this._renderHeader.bind(this)}
                style={[this.props.style,styles.list]}
                loadStatu={loadStatu}
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




