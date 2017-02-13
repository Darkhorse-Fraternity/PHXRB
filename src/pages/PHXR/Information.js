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
    ScrollView,
    TouchableOpacity,
    Text,
    Alert,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {push} from '../../redux/nav'
//static displayName = Information
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class Information extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }

    __renderRow(props) {

        return (
            <TouchableOpacity
                style={{marginTop:10}}
                onPress={()=>{
                    push('InfoUpLoad')


            }}>
                <View style={styles.row}>
                    <Text>{props.name}</Text>
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
                       <View style={styles.line}/>
                        <View style={styles.arrowView}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    render(): ReactElement<any> {
        const Row = this.__renderRow
        return (
            <ScrollView style={[this.props.style,styles.wrap]}>
                <Row name="借款申请书"/>
                <Row name="借款申请书"/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
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
    line:{
        backgroundColor:'black',
        width:StyleSheet.hairlineWidth,
        height:20,
        marginHorizontal:10,
    }

})
