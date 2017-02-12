/**
 * Created by lintong on 2017/2/2.
 * @flow
 */
'use strict';


import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {placeholder} from '../../../source/'
import {push,refresh} from '../../redux/nav'
import {renderNavImageButton} from '../../util/viewUtil'
//static displayName = Home
import {icon_class} from '../../../source'
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class Home extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    componentDidMount() {
        const renderLeftComponent = renderNavImageButton(icon_class, 'left',
            ()=>push('PersonInfo'))
        refresh({renderLeftComponent})
    }

    __gofinancing = ()=> {

        Alert.alert(
            '请确定是否需要融资',
            "",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {text: '确定', onPress: () => push('Financing')},
            ]
        )
    }

    __myfinanced = ()=> {
        push('Financed')
    }

    render(): ReactElement<any> {
        return (
            <ScrollView style={[this.props.style, {backgroundColor:"white"}]}>
                <View style={[this.props.style, styles.wrap]}>
                    <Image source={placeholder} style={styles.logo}/>
                    <Text style={styles.label}>不动产抵押融资服务</Text>
                    <Text style={styles.label}>机动车抵押融资服务</Text>
                    <Text style={styles.label}>信用消费类融资服务</Text>
                    <TouchableOpacity style={styles.btn} onPress={this.__gofinancing}>
                        <Text style={styles.btnText}>我要融资</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={this.__myfinanced}>
                        <Text style={styles.btnText}>我的融资</Text>
                    </TouchableOpacity>
                    <Text style={styles.tip}>点击"我要融资"，您专属的融资咨询顾问会为您提供进行全方位的融资咨询服务</Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    logo: {
        marginTop: 30,
        width: 200,
        height: 120,
    },
    label: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: "400",
        borderColor: 'black',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 10,
        paddingHorizontal: 60,
        borderRadius: 10,
    },
    btn: {
        marginTop: 30,
        borderColor: 'blue',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 10,
        paddingHorizontal: 80,
        borderRadius: 10,
    },
    btnText: {
        color: 'blue',
        fontSize: 20,
        fontWeight: "400",
    },
    tip: {
        marginTop: 20,
        fontSize: 12,
    }
})
