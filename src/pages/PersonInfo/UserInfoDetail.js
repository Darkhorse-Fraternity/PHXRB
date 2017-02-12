/**
 * Created by lintong on 2017/2/12.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native'
import {connect} from 'react-redux'
import {refresh,pop} from '../../redux/nav'
import {bindActionCreators} from 'redux';
import {renderNavSenderButton} from '../../util/viewUtil'
//static displayName = UserInfoDetail
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)

export  default  class UserInfoDetail extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props.data, nextProps.data)
    }

    __tapRight(){
        pop()
    }

    componentDidMount() {

        const rightBtn = renderNavSenderButton(this.__tapRight)
        refresh({renderRightComponent:rightBtn,
            rightButtonDisabled:false,
            rightButtonIsLoad:false});
    }

    __renderInputRow( name,props): ReactElement<any> {
        return (
            <View style={styles.row}>
                <Text style={styles.textStyle}>{name}</Text>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={"请输入您的" + name}
                    //keyboardType='numeric'
                    underlineColorAndroid='transparent'
                    clearButtonMode='while-editing'
                    enablesReturnKeyAutomatically={true}
                    onSubmitEditing={() => {}}
                    {...props}
                />
            </View>
        )
    }

    render(): ReactElement<any> {
        return (
            <View style={[this.props.style,styles.wrap]}>
                {this.__renderInputRow(this.props.scene.route.index,{})}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    row: {
        marginTop:10,
        flexDirection:'row',
        backgroundColor:'white',
        height:40,
        justifyContent:'center',
        alignItems:'center',
    },
    textInputStyle: {
        // width:200,
        flex: 1,
        marginLeft: 0,
        textAlign: 'left',
        fontSize: 14,
        color: 'black',
    },
    textStyle: {
        // flex: ,
        fontSize: 14,
        color: 'black',
        marginLeft:15,
        marginRight:15,
    },
})
