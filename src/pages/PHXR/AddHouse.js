/**
 * Created by lintong on 2017/2/16.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native'
import {deepFontColor, backViewColor, blackFontColor, mainColor} from '../../configure'
import {connect} from 'react-redux'
import { ActionSheet } from 'antd-mobile';
import {bindActionCreators} from 'redux';

//static displayName = AddHouse
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class AddHouse extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }


    showActionSheet(message:string,op:any) {
        const wrapProps = {onTouchStart: e => e.preventDefault()}
        const BUTTONS = op.concat('取消')
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                // title: '标题',
                cancelButtonIndex: BUTTONS.length - 1,
                message,
                maskClosable: true,
                'data-seed': 'logId',
                wrapProps,
            },
            (buttonIndex) => {
                this.setState({ clicked: BUTTONS[buttonIndex] });
            });
    }

    _renderRowMain(title: string, placeholder: string, onChangeText: Function,
                   boardType: PropTypes.oneOf = 'default', autoFocus: bool = false, maxLength: number = 16,
                   ref: string) {

        return (
            <View style={styles.rowMainStyle}>
                <Text style={styles.textStyle}>{title}</Text>
                <TextInput
                    ref={ref}
                    placeholderTextColor="rgba(180,180,180,1)"
                    selectionColor={mainColor}
                    returnKeyType='next'
                    autoFocus={autoFocus}
                    maxLength={maxLength}
                    keyboardType={boardType}
                    style={styles.textInputStyle}
                    underlineColorAndroid='transparent'
                    placeholder={placeholder}
                    clearButtonMode='while-editing'
                    enablesReturnKeyAutomatically={true}
                    onSubmitEditing={() =>this.focusNextField(ref)}
                    onChangeText={onChangeText}/>
            </View>
        )
    }

    _renderRow(title: string, dex: string, onPress: Function) {
        return (
            <View>
                <TouchableOpacity onPress={()=>onPress(title)}>
                    <View style={styles.row}>
                        <Text style={[styles.rowText,{marginRight:15}]}>
                            {title}
                        </Text>
                        <View style={styles.row2}>
                            <Text style={styles.dex}>{dex}</Text>
                            <View style={styles.arrowView}/>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }


    render(): ReactElement<any> {
        return (
            <ScrollView
                style={styles.wrap}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode='on-drag'>

                {this._renderRowMain('房产地址:', 'x省x市x县',
                )}

                {this._renderRowMain('所在小区:', '',
                )}

                {this._renderRow('请选择所在城市:', '个人住宅(70年产权)', (title) => {
                    this.showActionSheet(title, ["个人住宅(70年产权)", "商住两用","商铺","写字楼",
                        "别墅","停车位","自建房","动迁房","经济适用房","预算房"])
                })}
                {this._renderRowMain('已用年限:', '',
                )}
                {this._renderRowMain('产权面积:', '',
                )}
                {this._renderRowMain('实际适用面积:', '',
                )}
                {this._renderRowMain('所在建筑总层数:', '',
                )}
                {this._renderRowMain('所处层数:', '',
                )}
                {this._renderRow('是否有电梯:', '是', (title) => {
                    this.showActionSheet(title, ["是","否"])
                })}
                {this._renderRow('是否有共有产权人:', '是', (title) => {
                    this.showActionSheet(title, ["是","否"])
                })}
                {this._renderRowMain('公有产权人姓名:', '',
                )}
                {this._renderRowMain('共有产权人的身份证:', '',
                )}
                {this._renderRowMain('共有产权人的电话:', '',
                )}
                {this._renderRowMain('共有产权人的关系:', '',
                )}

            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor:'white'
    },
    rowMainStyle: {

        flex: 1,
        height: 40,
        marginTop: 10,
        backgroundColor: 'rgba(200,200,200,0.1)',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    row: {
        marginTop: 15,
        backgroundColor: 'rgba(200,200,200,0.1)',
        padding: 29 / 2,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    row2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowText: {
        fontSize: 14,
        // fontWeight: '500',
        color: blackFontColor,
    },
    arrowView: {
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderRightWidth: StyleSheet.hairlineWidth * 2,
        borderColor: '#8c8c85',
        transform: [{rotate: '315deg'}],
        marginLeft: 5,
        width: 10,
        height: 10,
    },
    textStyle: {
        // flex: ,
        fontSize: 14,
        color: blackFontColor,
    },
    textInputStyle: {
        // width:200,
        flex: 1,
        marginLeft: 0,
        textAlign: 'left',
        fontSize: 14,
        color: 'black',
    },
})
