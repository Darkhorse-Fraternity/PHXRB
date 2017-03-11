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
    Alert,
} from 'react-native'
import {push, refresh} from '../../redux/nav'
import {mainColor} from '../../configure'
import {connect} from 'react-redux'
import * as immutable from 'immutable';
import BaseListView from '../../components/Base/BaseListView';
import {listLoad, listLoadMore} from '../../redux/actions/list'
import {renderNavAddButton} from '../../util/viewUtil'

import {phxr_query_person_assets_list} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
import {Button, WingBlank} from 'antd-mobile';
import {Toast} from '../../util'
const listKey = 'listKey'
function myListLoad(id, more: bool = false) {
    return (dispatch, getState) => {
        const params = phxr_query_files_list(id)
        more ? dispatch(listLoadMore(listKey, params)) : dispatch(listLoad(listKey, params))
    }
}


@connect(
    state =>({
        //state:state.util.get()
        data: state.req.get('phxr_query_person_assets_list')
    }),
    (dispatch,props) =>({
        //...bindActionCreators({},dispatch),
        load: ()=> {

            dispatch(async(dispatch, getState)=> {
                // const uid = getState().login.data.userId
                try {
                    const params = phxr_query_person_assets_list(props.scene.route.userId)
                    await dispatch(request('phxr_query_person_assets_list', params))
                }catch (e){
                    Toast.show(e.message)
                }

            })


        }
    })
)

export default class List extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    static propTypes = {
        load: PropTypes.func.isRequired,
    };

    static defaultProps = {
        data: immutable.fromJS({
            data: []
        })
    };

    // shouldComponentUpdate(nextProps: Object,nextState:Object) {
    //     return !immutable.is(this.props, nextProps) ||  !immutable.is(this.state, nextState)
    // }


    componentDidMount() {
        this.props.load()
    }


    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props.data, nextProps.data)
    }

    _renderHeader = ()=> {
        const userId = this.props.scene.route.userId
        return (
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:10}}>
                <Button onClick={()=>push({key:'AddHouse',userId})}>新增房产</Button>
                <WingBlank/>
                <Button onClick={()=>push({key:'AddCar',userId})}>新增汽车</Button>
            </View>
        )
    }


    renderRow(itme: Object, sectionID: number, rowID: number) {

        return (
            <TouchableOpacity
                style={{marginTop:10}}
                onPress={()=>{
                    push({key:'AssetsInfo',item:itme})
            }}>
                <View style={styles.row}>
                    <Text>{itme.assetsName}</Text>
                    <View style={styles.row2}>
                        <Text  onPress={()=>{
                             Alert.alert(
                        '确定要删除吗？',
                           "",
                        [
                            {text: '取消', onPress: () => {}},
                            {text: '确定', onPress: () =>{}},
                        ])

                        }}>删除 </Text>
                        <View style={styles.arrowView}/>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

    render() {

        let listData = this.props.data && this.props.data.get('data')
        listData = listData && listData.toJS()
        // listData = ["1", '2']
        return (
            <View style={[this.props.style,styles.list]}>
                <BaseListView
                    renderHeader={this._renderHeader}
                    style={styles.list}
                    //loadStatu={loadStatu}
                    loadStatu={'LIST_NORMAL'}
                    loadData={this.props.load}
                    dataSource={listData}
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
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
    row2:{
        flexDirection:'row',
        alignItems:'center'
    },

})




