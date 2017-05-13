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
    NativeModules,
    Image,
    Dimensions
} from 'react-native'
import {OS} from '../../util/';

import {BCButton} from '../../components/Base/WBButton'
import Button from 'react-native-button'
import {request} from '../../request'
import {phxr_login, phxr_verification_code} from '../../request/qzapi'
import {deepFontColor, backViewColor, blackFontColor, mainColor} from '../../configure'
import {connect} from 'react-redux'
import {navigatePop, navigatePush} from '../../redux/actions/nav'
import {login} from '../../redux/actions/login'
import {checkPhoneNum, Toast} from '../../util'
import WBButton from '../../components/Base/WBButton'
const webUrl = 'https://static.dayi.im/static/fudaojun/rule.html?version=20160603182000';
import {logo, placeholder} from '../../../source'
class RegPhone extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            time: 60,
            phone: "", //号码
            ymCode: "", //验证码
            isTap: false,
            timeLoad: false,
            password: '',
        };
    }

    state: {
        phone:string,
        time:number,
        ymCode:string,
        isTap:bool, // 用于time 是否在走。
        timeLoad:bool,
    };


    requestHandle: Object;
    id: number = 0;

    _onClickCode() {
        //发送验证码请求
//没注册过手机号 13517238595

        this.setState({timeLoad: true});
        var self = this;
        const param = phxr_verification_code(this.state.phone, '6')
        this.requestHandle = request(param, function (response) {
            if (response.data.rspCode == "0000") {
                //console.log('test:', response)
                Toast.show("发送成功!");
                self.refs[2] && self.refs[2].focus()
                if (self.state.isTap == false) {
                    self.setState({isTap: true});
                    self.id = setInterval(function () {
                        self.time()
                    }, 1000)
                }
            } else {
                Toast.show(response.data.rspMsg);
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

    _login = ()=> {
        // 判断手机号的正则


        if (this.state.phone.length == 0) {
            Toast.show('用户名或手机号码不能为空');
            this.refs['2'].focus();
            return;
        }
        //判断验证码的正则
        // const reg = /^\d{6}$/;
        // const flag = reg.test(this.state.ymCode)
        // if (!flag) {
        //     Toast.show('不是正确验证码');
        //     this.refs['3'].focus();
        //     return;
        // }


        if (this.state.password.length == 0) {
            Toast.show('密码不能为空!');
            this.refs['1'].focus();
            return;
        }

        this.props.login(this.state);

    }


    componentWillUnmount() {
        this.id && clearInterval(this.id);
        this.requestHandle && this.requestHandle.next();
    }


    focusNextField(nextField: string) {

        if (nextField == '1') {
            this.refs['2'].focus();
        } else if (nextField == '2') {
            this._login()
        } else if (nextField == '3') {
            this._login()
        }
    }

    _renderRowMain(image: number, title: string, placeholder: string, onChangeText: Function,
                   boardType: PropTypes.oneOf = 'default', autoFocus: bool = false, maxLength: number = 16,
                   ref: string, secureTextEntry = false) {

        return (
            <View style={styles.rowMainStyle}>
                {/*<Text style={styles.textStyle}>{title}</Text>*/}
                <Image source={image} style={{marginRight:15}}/>
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
                    secureTextEntry={secureTextEntry}
                    onChangeText={onChangeText}/>
            </View>
        )
    }

    render() {
        var codeEnable = this.state.phone.length > 0 &&
            this.state.time == 60 && !this.state.isTap;
        const reg = /^\d{6}$/;

        const flag = this.state.phone.length > 0 && this.state.password.length > 0


        const logo2 = require('../../../source/img/login/signin.png')
        const back = require('../../../source/img/login/btn_back.png')
        const user = require('../../../source/img/login/ico_user.png')
        const password = require('../../../source/img/login/ico_password.png')
        return (
            <View
                style={[styles.container,{justifyContent:'space-between'}]}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode='interactive'>
                <View>
                    <TouchableOpacity style={{width:50,
                           height:50,
                            top:35,
                           left:15,
                           zIndex:100,
                           position:'absolute'}} onPress={()=>this.props.pop()}>
                        <Image source={back}
                        />
                    </TouchableOpacity>
                    <Image source={logo2} style={styles.logo}/>


                    <View style={{height:20}}/>
                    {this._renderRowMain(user, '用户名/手机号:', '请填入用户名或手机号码',
                        (text) => this.setState({phone: text}), 'default', false, 16, "2"
                    )}


                    {this._renderRowMain(password, '密码:', '请输入密码',
                        (text) => this.setState({password: text}), 'default', false, 50, "1", true
                    )}


                    <BCButton
                        onPress={this._login}
                        containerStyle={styles.cbutton}
                        disabled={!flag}
                        isLoad={this.props.state.loaded}
                    >
                        登 录
                    </BCButton>


                    <TouchableOpacity

                        onPress={()=>this.props.push('FindPwd')}
                        style={styles.mbutton}
                    >
                        <Text style={styles.buttonTextColor}> {'忘记密码?'} </Text>
                    </TouchableOpacity>
                </View>
                <WBButton
                    onPress={()=>this.props.push('RegPhone')}
                    style={{color:mainColor}}
                    containerStyle={[styles.creactbutton,{marginTop:10}]}
                >
                    <Text style={{alignSelf:'center'}}>
                        <Text style={{color:'rgb(150,150,150)'}}>还没有账号？</Text>
                        <Text>立即注册</Text>
                    </Text>
                </WBButton>
            </View>
        );
    }
}


const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor: 'white',
        // paddingTop: 20,

    },

    logo: {
        marginTop: 0,
        width: Dimensions.get('window').width,
        height: 200,
    },

    rowMainStyle: {

        // flex: 1,
        height: 40,
        marginTop: 10,
        // backgroundColor: 'rgba(200,200,200,0.1)',
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 30,
        borderBottomColor: 'rgb(200,200,200)',
        borderBottomWidth: StyleSheet.hairlineWidth
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
    buttonTextColor: {
        color: 'rgb(150,150,150)',
        fontSize: 13,
        // textAlign: "center",
    },

    cbutton: {
        marginLeft: 29,
        marginRight: 29,
        marginTop: 30,
        height: 40,
        justifyContent: 'center',

    },
    mbutton: {
        marginTop: 12,
        height: 40,
        width: 150,
        marginLeft: 30
        // alignSelf: 'center',
    },

    creactbutton: {
        borderColor: 'rgb(150,150,150)',
        borderWidth: StyleSheet.hairlineWidth,
        marginLeft: 29,
        marginRight: 29,
        marginTop: 17,
        height: 40,
        justifyContent: 'center',
        borderRadius: 3,
        marginBottom:20,
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
        push: (key)=> {
            //index 为空 则为当前index
            dispatch(navigatePush(key));
        },
        pop: ()=> {
            dispatch(navigatePop())
        },
        login: (state)=> {
            dispatch(login(state));
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
