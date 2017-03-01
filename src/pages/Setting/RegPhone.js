/* @flow */
//注册页面
'use strict';
import React, {Component, PropTypes} from 'react';
import  {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    Picker,
    LayoutAnimation,
    TouchableOpacity,
} from 'react-native'
import {OS} from '../../util/';

import {BCButton} from '../../components/Base/WBButton'
import Button from 'react-native-button'
import {request} from '../../request'
import {requestSmsCode} from '../../request/leanCloud'
import {deepFontColor, backViewColor, blackFontColor, mainColor} from '../../configure'
import {connect} from 'react-redux'
import {navigateReplaceIndex, navigatePush} from '../../redux/actions/nav'
import {register} from '../../redux/actions/login'
import {checkPhoneNum, Toast} from '../../util'

const webUrl = 'https://static.dayi.im/static/fudaojun/rule.html?version=20160603182000';
import {ActionSheet} from 'antd-mobile';
class RegPhone extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            time: 60,
            codeName: '',
            phone: "", //号码
            ymCode: "", //验证码
            isTap: false,
            timeLoad: false,
            userName: '',
            password: '',
            passwordAgain:"",
            clicked:'福州'
        };
    }

    state: {
        phone:string,
        time:number,
        codeName:string,
        ymCode:string,
        isTap:bool, // 用于time 是否在走。
        timeLoad:bool,
        userName:string
    };


    requestHandle: Object;
    id: number = 0;

    _onClickCode() {
        //发送验证码请求
//没注册过手机号 13517238595

        this.setState({timeLoad: true});
        var self = this;
        requestSmsCode.params.mobilePhoneNumber = this.state.phone;
        this.requestHandle = request(requestSmsCode, function (response) {
            if (response.statu) {
                console.log('test:', response)
                Toast.show("发送成功!");
                self.refs[2] && self.refs[2].focus()
                if (self.state.isTap == false) {
                    self.setState({isTap: true});
                    self.id = setInterval(function () {
                        self.time()
                    }, 1000)
                }
            }
            self.setState({timeLoad: false});
        });
    }


    time() {
        if (this.state.time == 0) {
            clearInterval(this.id);
            // this.isTap = false;
            this.setState({isTap: false});
        }

        this.setState({
            time: this.state.time == 0 ? 60 : --this.state.time,
        })
    }

    _gowebView = ()=> {


        this.props.pushWebView({key: 'WebView', title: '普汇信融用户服务协议', url: webUrl});
    };

    _goRegist() {

        //判断用户名
        if(this.state.userName.length == 0){
            Toast.show('用户名不能为空');
            this.refs['1'].focus();
            return;
        }



        var r = /^\+?[1-9][0-9]*$/;
        if(r.test(this.state.userName)){
            Toast.show('用户名必须含有字母');
            this.refs['1'].focus();
            return;
        }

        // 判断手机号的正则
        if (!checkPhoneNum(this.state.phone)) {
            Toast.show('不是正确的手机号码');
            this.refs['2'].focus();
            return;
        }
        //判断验证码的正则
        // const reg = /^\d{6}$/;
        // const flag = reg.test(this.state.ymCode)
        // if (!flag) {
        //     Toast.show('不是正确验证码');
        //     this.refs['2'].focus();
        //     return;
        // }


        if(this.state.password.length < 6){
            Toast.show('密码需要大于6位数');
            this.refs['3'].focus();
            return;
        }

        if(this.state.password != this.state.passwordAgain){
            Toast.show('密码确定与密码不一致！');
            this.refs['4'].focus();
            return;
        }


        this.props.mRegister(this.state);
    //
    }


    componentWillUnmount() {
        this.id && clearInterval(this.id);
        this.requestHandle && this.requestHandle.next();
    }


    showActionSheet(message: string, op: any) {
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
                this.setState({clicked: BUTTONS[buttonIndex]});
            });
    }


    focusNextField(nextField: string) {

        if (nextField == '1') {
            this.refs['2'].focus();
        } else if (nextField == '2') {
            this._goRegist()
        }
    }

    _renderRowMain(title: string, placeholder: string, onChangeText: Function,
                   boardType: PropTypes.oneOf = 'default', autoFocus: bool = false, maxLength: number = 16,
                   ref: string,secureTextEntry:bool=false) {

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
                    //onSubmitEditing={() =>this.focusNextField(ref)}
                    secureTextEntry={secureTextEntry}
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

    render() {
        var codeEnable = checkPhoneNum(this.state.phone) &&
            this.state.time == 60 && !this.state.isTap;
        const reg = /^\d{6}$/;
        const flag = reg.test(this.state.ymCode) && checkPhoneNum(this.state.phone)
        return (
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode='on-drag'>

                    {this._renderRowMain('用户名:', '请填入用户名',
                        (text) => this.setState({userName: text}), 'default', true, 20, "1"
                    )}

                    {this._renderRowMain('手机号:', '请填入手机号码',
                        (text) => this.setState({phone: text}), 'numeric', false, 11, "2"
                    )}

                    {this._renderRow('请选择所在城市:', this.state.clicked, (title) => {
                        this.showActionSheet(title, ["福州", "厦门"])
                    })}
                    {this._renderRowMain('密码:', '请输入密码',
                        (text) => this.setState({password: text}), 'default', false, 50, "3",true
                    )}
                    {this._renderRowMain('确认密码:', '请再次确认密码',
                        (text) => this.setState({passwordAgain: text}), 'default', false, 50, "4",true
                    )}

                    {/*<View style={{flexDirection:'row'}}>*/}
                    {/*{this._renderRowMain('验证码:', '输入您收到的验证码',*/}
                    {/*(text) => {*/}
                    {/*this.setState({ymCode: text})*/}
                    {/*},*/}
                    {/*'numeric'*/}
                    {/*, false, 6, "2"*/}
                    {/*)}*/}

                    {/*<BCButton containerStyle={styles.buttonContainerStyle}*/}
                    {/*disabled={!codeEnable}*/}
                    {/*loaded={this.state.timeLoad}*/}
                    {/*//styleDisabled={{fontWeight:'normal'}}*/}
                    {/*onPress={this._onClickCode.bind(this)}*/}
                    {/*style={{fontWeight:'400',fontSize:14}}*/}
                    {/*>*/}
                    {/*{this.state.time == 60 || this.state.time == 0 ? '获取验证码' :*/}
                    {/*this.state.time.toString() + '秒'}*/}
                    {/*</BCButton>*/}
                    {/*</View>*/}


                    <BCButton
                        //disabled={!flag}
                        isLoad={this.props.state.loaded}
                        onPress={this._goRegist.bind(this)}
                        containerStyle={styles.buttonContainerStyle2}>
                        注册
                    </BCButton>
                    <View style={styles.bottom}>
                        <Text style={styles.protocolPre}>点击注册,即表示已阅读并同意</Text>
                        <Button
                            onPress={this._gowebView}
                            style={styles.protocolSuf}>
                            《普汇信融用户服务条款》
                        </Button>
                    </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20,
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
    buttonContainerStyle: {
        marginRight: 15,
        marginLeft: -5,
        height: 40,
        marginTop: 10,
        paddingHorizontal: 15,
        alignSelf: 'center',

        justifyContent: 'center',
    },
    textStyle: {
        // flex: ,
        width: 65,
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
    buttonSelectStyle: {
        marginLeft: OS == 'ios' ? 29 / 2 : 27,
        flex: 1,
        height: 30,
        justifyContent: 'center',
    },
    buttonTextStyle: {
        fontSize: 14,
        color: '#9ba0a2'
    },
    buttonMainTextStyle: {
        fontSize: 14,
        color: deepFontColor,
    },
    buttonContainerStyle2: {
        marginLeft: 29 / 2,
        marginRight: 29 / 2,
        marginTop: 30,
        height: 40,
        justifyContent: 'center',
    },

    protocolPre: {
        marginTop: 8,
        fontSize: 11,
        color: '#9e9e9e',
    },
    protocolSuf: {
        marginTop: 8,
        fontSize: 11,
        color: mainColor,
    },

    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
})


const mapStateToProps = (state) => {
    //从login reduce 中获取state的初始值。
    //console.log('state:',state);
    return {
        state: state.login,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // push: ()=> {
        //     //index 为空 则为当前index
        //     dispatch(navigateReplaceIndex('TabView'));
        // },
        mRegister: (state)=> {
            dispatch(register(state));
        },
        pushWebView: (params)=> {
            dispatch(navigatePush(params));
        }

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegPhone)
