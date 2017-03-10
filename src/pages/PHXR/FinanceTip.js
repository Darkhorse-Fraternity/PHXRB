/**
 * Created by lintong on 2017/3/10.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {Button} from 'antd-mobile';
import {pop, push} from '../../redux/nav'
//static displayName = FinanceTip
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class FinanceTip extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }

    render(): ReactElement<any> {
        return (
            <View style={[this.props.style,styles.wrap]}>
                <Text style={styles.title}>
                    无法报送，请处理问题,问题详情如下:
                </Text>

                <Text style={styles.checkInfo}>
                    {this.props.scene.route.checkInfo}
                </Text>

                <Button inline style={{ margin: 10 }}
                        onClick={()=>{pop()}}>
                    确定
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor:'white',
    },
    title:{
        alignSelf:'center',
        marginTop:20,
        fontSize:17,
    },
    checkInfo:{
        marginTop:20,
        marginBottom:20,
        alignSelf:'center',
    }

})
