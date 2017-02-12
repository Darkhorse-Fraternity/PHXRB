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

        push('MemberList')
    }

    __myfinanced = ()=> {
        push('BusinessList')
    }

    render(): ReactElement<any> {
        return (
            <ScrollView style={[this.props.style, {backgroundColor:"white"}]}>
                <View style={[this.props.style, styles.wrap]}>
                    <Image source={placeholder} style={styles.logo}/>
                    <TouchableOpacity style={styles.btn} onPress={this.__gofinancing}>
                        <Text style={styles.btnText}>我的会员</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={this.__myfinanced}>
                        <Text style={styles.btnText}>我的业务</Text>
                    </TouchableOpacity>
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
