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
} from 'react-native'

import {mainColor} from '../../configure'
import {connect} from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import CourseTabBar from '../../components/CourseTabBar'

import * as immutable from 'immutable';
import BaseListView from '../../components/Base/BaseListView';
import {listLoad, listLoadMore} from '../../redux/actions/list'
import {push} from '../../redux/nav'
const listKey = BusinessList
function myListLoad(more: bool = false) {
    return (dispatch, getState) => {
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

export default class BusinessList extends Component {
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


    renderRow(itme: Object, sectionID: number, rowID: number) {

        return (
            <TouchableOpacity
                style={{marginTop:10}}
                onPress={()=>{
                    push('Business')
            }}>
                <View style={styles.row}>
                    <View>
                        <Text>收到来自xxx的融资请求</Text>
                        <Text style={{marginTop:10,color:'rgb(150,150,150)'}}>13588834854</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{marginRight:10}}>
                            <Text style={{textAlign:'right'}}>80%</Text>
                            <Text style={{marginTop:10,color:'rgb(150,150,150)'}}>2012.2.2</Text>
                        </View>
                        <View style={styles.arrowView}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {

        const loadStatu = this.props.data && this.props.data.get('loadStatu')
        let listData = this.props.data && this.props.data.get('listData')
        listData = listData && listData.toJS()
        listData = ['111', '222']
        return (
            <ScrollableTabView initialPage={0} renderTabBar={()=><CourseTabBar/>}>
                <BaseListView
                    tabLabel="新任务"
                    //renderHeader={this._renderHeader}
                    style={[this.props.style,styles.list]}
                    loadStatu="LIST_NORMAL"
                    loadData={this.props.load}
                    dataSource={listData}
                    loadMore={this.props.loadMore}
                    renderRow={this.renderRow.bind(this)}
                />
                <BaseListView
                    tabLabel="已办任务"
                    //renderHeader={this._renderHeader}
                    style={[this.props.style,styles.list]}
                    loadStatu={loadStatu}
                    loadData={this.props.load}
                    dataSource={listData}
                    loadMore={this.props.loadMore}
                    renderRow={this.renderRow.bind(this)}
                />
                <BaseListView
                    tabLabel="完成任务"
                    //renderHeader={this._renderHeader}
                    style={[this.props.style,styles.list]}
                    loadStatu={loadStatu}
                    loadData={this.props.load}
                    dataSource={listData}
                    loadMore={this.props.loadMore}
                    renderRow={this.renderRow.bind(this)}
                />
                <BaseListView
                    tabLabel="结案任务"
                    //renderHeader={this._renderHeader}
                    style={[this.props.style,styles.list]}
                    loadStatu={loadStatu}
                    loadData={this.props.load}
                    dataSource={listData}
                    loadMore={this.props.loadMore}
                    renderRow={this.renderRow.bind(this)}
                />
            </ScrollableTabView>
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
    },
    subRow: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
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




