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

import {refresh,push} from '../../redux/nav'
import {bindActionCreators} from 'redux';
import {renderNavAddButton} from '../../util/viewUtil'

const listKey = 'listKey'
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
        push: (key)=> {
            // dispatch(navigatePush(key));
            push('')
        },
    })
)

export default class List extends Component {
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


    __tapRight(){
    }

    componentDidMount() {

        const rightBtn = renderNavAddButton(this.__tapRight)
        refresh({renderRightComponent:rightBtn,
            rightButtonDisabled:false,
            rightButtonIsLoad:false});
    }

    renderRow(itme: Object, sectionID: number, rowID: number) {

        return (
            <TouchableOpacity
                style={{marginTop:10}}
                onPress={()=>{
                    {/*push('AssetsInfo')*/}
                         Alert.alert(
                        '确定要删除吗？',
                           "",
                        [
                            {text: '取消', onPress: () => {}},
                            {text: '确定', onPress: () =>{}},
                        ])

            }}>
                <View style={styles.row}>
                    <Text>资料证明文件</Text>
                    {/*<View style={styles.arrowView}/>*/}
                    <Text>删除</Text>
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
            <BaseListView
                //renderHeader={this._renderHeader}
                style={[this.props.style,styles.list]}
                //loadStatu={loadStatu}
                loadStatu={'LIST_NORMAL'}
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
        flexDirection:'row',
        justifyContent:'space-between'
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




