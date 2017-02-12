/**
 * Created by lintong on 2017/2/2.
 * @flow
 */
'use strict';


import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';

import {List, InputItem} from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;
//static displayName = Financing
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class Financing extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    render(): ReactElement<any> {
        return (
            <View style={[this.props.style,styles.wrap]}>
                <List>
                    <Item extra="xxx" multipleLine>
                        融资咨询顾问
                    </Item>
                    <Item extra="13412432" multipleLine>
                        联系方式
                    </Item>
                    <Item extra="福建省福州市" multipleLine>
                        服务地区
                    </Item>
                    <Item extra="2017.1.1" multipleLine>
                        注册时间
                    </Item>
                    <Item extra="100" multipleLine>
                        已成功服务次数
                    </Item>
                    <Item extra="100" multipleLine>
                        服务星级
                    </Item>
                    <Item extra="100" multipleLine>
                        已成功服务次数
                    </Item>
                    <Item extra="100s" multipleLine>
                        平均响应时间
                    </Item>
                    <Item extra="xxxx公司" multipleLine>
                        所属融资咨询机构
                    </Item>
                </List>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
})
