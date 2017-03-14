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

import {mainColor} from '../../configure'
import {connect} from 'react-redux'
import * as immutable from 'immutable';
import BaseListView from '../../components/Base/BaseListView';
import {listLoad, listLoadMore} from '../../redux/actions/list'
import {phxr_query_files_list, phxr_deal_files} from  '../../request/qzapi'
import {refresh, push} from '../../redux/nav'
import {bindActionCreators} from 'redux';
import {send} from '../../request'
import {renderNavAddButton} from '../../util/viewUtil'
import {Toast} from '../../util'
const listKey = 'fiels_listKey_person'
function myListLoad(id,more: bool = false) {
    return (dispatch, getState) => {
        // const id = getState().login.data.userId
        const params = phxr_query_files_list(id)
        more ? dispatch(listLoadMore(listKey, params)) : dispatch(listLoad(listKey, params))
    }
}

//我的资料
@connect(
    state =>({
        data: state.list.get(listKey),
    }),
    (dispatch,props) =>({
        //...bindActionCreators({},dispatch),
        load: ()=>dispatch(myListLoad(props.scene.route.userId)),
        loadMore: ()=>dispatch(myListLoad(props.scene.route.userId,true)),
        delete: (fileId)=> {
            dispatch(async(dispatch, getState)=> {


                try {
                    const userID = getState().login.data.userId
                    const param = phxr_deal_files(props.scene.route.userId, "3", undefined, fileId, undefined, undefined, undefined, userID)
                    const res = await send(param)
                    if (res.rspCode == "0000") {
                        dispatch(myListLoad(props.scene.route.userId))
                    } else {
                        Toast.show(res.rspMsg)
                    }
                } catch (e) {
                    Toast.show(e.message)
                }
            })


        }
    })
)

export default class FilesList extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {
        load: PropTypes.func.isRequired,
        loadMore: PropTypes.func.isRequired,
    };
    static defaultProps = {
        data: immutable.fromJS({
            listData: {},
            loadStatu: 'LIST_NORMAL',
        })
    };

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }


    __tapRight=()=> {
        push({key:'InfoUpLoad',userId:this.props.scene.route.userId})
    }

    componentDidMount() {

        const rightBtn = renderNavAddButton(this.__tapRight)
        refresh({
            renderRightComponent: rightBtn,
            rightButtonDisabled: false,
            rightButtonIsLoad: false
        });
    }

    renderRow(itme: Object, sectionID: number, rowID: number) {

        return (
            <View style={[styles.row,{marginTop:10}]}>
                <Text style={{textDecorationLine:"underline"}} onPress={()=>{
                        push({key:'FilesScan',url:itme.filePath})
                    }}>
                    {itme.fileTypeDesc}
                </Text>
                {/*<View style={styles.arrowView}/>*/}
                <Text onPress={()=>{

                         Alert.alert(
                        '确定要删除吗？',
                           "",
                        [
                            {text: '取消', onPress: () => {}},
                            {text: '确定', onPress: () =>{
                                this.props.delete(itme.id)
                            }},
                        ])

                      }}>
                    删除
                </Text>
            </View>
        )
    }

    render() {

        const loadStatu = this.props.data.get('loadStatu')
        console.log('test:', this.props.data.get('listData'));
        let listData = this.props.data.get('listData').toJS().content
        return (
            <BaseListView
                //renderHeader={this._renderHeader}
                style={[this.props.style,styles.list]}
                //loadStatu={loadStatu}
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




