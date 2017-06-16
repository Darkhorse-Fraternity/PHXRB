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
    Dimensions,
    Image,
    TouchableWithoutFeedback
} from 'react-native'
import {OS} from '../../util/';

import {BCButton} from '../../components/Base/WBButton'
import Button from 'react-native-button'
import {request} from '../../request'
import {requestSmsCode} from '../../request/leanCloud'
import {phxr_verification_code} from '../../request/qzapi'
import {deepFontColor, backViewColor, blackFontColor, mainColor} from '../../configure'
import {connect} from 'react-redux'
import {navigatePush, navigatePop} from '../../redux/actions/nav'
import {register} from '../../redux/actions/login'
import {checkPhoneNum, Toast} from '../../util'

const webUrl = 'http://103.236.253.138:8088/declare.html';
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
            passwordAgain: "",
            clicked: '福州',
            choice:true,
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
        const param = phxr_verification_code(this.state.phone, '6')
        this.requestHandle = request(param, function (response) {
            if (response.data.rspCode == "0000") {
                //console.log('test:', response)
                Toast.show("发送成功!");
                self.refs[3] && self.refs[3].focus()
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

    _goRegist() {

        if(!this.state.choice){
            Toast.show('需要同意《融资无忧用户服务条款》才能注册。');
            return;
        }

        //判断用户名
        if (this.state.userName.length == 0) {
            Toast.show('用户名不能为空');
            this.refs['1'].focus();
            return;
        }


        var r = /^\+?[1-9][0-9]*$/;
        if (r.test(this.state.userName)) {
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
        const reg = /^\d{6}$/;
        const flag = reg.test(this.state.ymCode)
        if (!flag) {
            Toast.show('不是正确验证码');
            this.refs['3'].focus();
            return;
        }


        if (this.state.password.length < 6) {
            Toast.show('密码需要大于6位数');
            this.refs['4'].focus();
            return;
        }

        if (this.state.password != this.state.passwordAgain) {
            Toast.show('密码确定与密码不一致！');
            this.refs['5'].focus();
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
                if (buttonIndex != BUTTONS.length - 1) {
                    this.setState({clicked: BUTTONS[buttonIndex]});
                }

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
                   ref: string, secureTextEntry: bool = false) {

        return (
            <View style={styles.rowMainStyle}>
                <Text style={styles.textStyle}>{title}</Text>
                <TextInput
                    ref={ref}
                    placeholderTextColor="rgba(120,120,120,1)"
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
        const logo2 = require('../../../source/img/login/register_logo.png')
        const back = require('../../../source/img/login/btn_back.png')
        const choice_click = require('../../../source/img/login/choice_click.png')
        const choice = require('../../../source/img/login/choice.png')
        return (
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode='interactive'>

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

                <View style={{backgroundColor:'white',marginTop:20}}>
                    {this._renderRowMain('用户名:', '请填入用户名',
                        (text) => this.setState({userName: text}), 'default', true, 16, "1"
                    )}
                    <View style={styles.line}/>
                    {this._renderRowMain('手机号:', '请填入手机号码',
                        (text) => this.setState({phone: text}), 'numeric', false, 11, "2"
                    )}

                    <View style={styles.line}/>
                    {this._renderRowMain('密码:', '请输入密码',
                        (text) => this.setState({password: text}), 'default', false, 50, "4", true
                    )}
                    <View style={styles.line}/>
                    {this._renderRowMain('确认密码:', '请再次确认密码',
                        (text) => this.setState({passwordAgain: text}), 'default', false, 50, "5", true
                    )}
                    <View style={styles.line}/>


                    <View style={{flexDirection:'row'}}>
                        {this._renderRowMain('验证码:', '输入您收到的验证码',
                            (text) => {
                                this.setState({ymCode: text})
                            },
                            'numeric'
                            , false, 6, "3"
                        )}

                        <BCButton containerStyle={styles.buttonContainerStyle}
                                  disabled={!codeEnable}
                                  loaded={this.state.timeLoad}
                            //styleDisabled={{fontWeight:'normal'}}
                                  onPress={this._onClickCode.bind(this)}
                                  style={{fontWeight:'400',fontSize:14,color:'black'}}
                        >
                            {this.state.time == 60 || this.state.time == 0 ? '获取验证码' :
                            this.state.time.toString() + '秒'}
                        </BCButton>
                    </View>
                    <View style={styles.line}/>
                    {this._renderRow('请选择所在城市:', this.state.clicked, (title) => {
                        this.showActionSheet(title, ["福州", "厦门"])
                    })}


                </View>
                <View style={styles.bottom}>
                    <TouchableWithoutFeedback onPress={()=>{
                        this.setState({choice:!this.state.choice})
                    }}>
                        <Image source={this.state.choice?choice_click:choice}/>
                    </TouchableWithoutFeedback>
                    <Text style={styles.protocolPre}>我已阅读并同意</Text>
                    <Button
                        onPress={this._gowebView}
                        style={styles.protocolSuf}>
                        《融资无忧用户服务条款》
                    </Button>
                </View>
                <BCButton
                    //disabled={!flag}
                    isLoad={this.props.state.loaded}
                    onPress={this._goRegist.bind(this)}
                    containerStyle={styles.buttonContainerStyle2}>
                    注册
                </BCButton>

            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },

    logo: {
        marginTop: 0,
        width: Dimensions.get('window').width,
        height: 130,
    },

    rowMainStyle: {

        flex: 1,
        height: 40,
        marginVertical: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        // backgroundColor:'red'
    },
    buttonContainerStyle: {
        marginRight: 15,
        marginLeft: -5,
        height: 35,
        marginVertical: 5,
        paddingHorizontal: 15,
        alignSelf: 'center',

        justifyContent: 'center',
        backgroundColor: '#eeeeee'
    },
    textStyle: {
        // flex: ,
        width: 120,
        fontSize: 14,
        color: 'rgb(120,120,120)',
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
        marginLeft: 29,
        marginRight: 29,
        marginTop: 80,
        marginBottom:80,
        height: 40,
        justifyContent: 'center',
    },

    protocolPre: {
        marginLeft:5,
        fontSize: 13,
        color: '#9e9e9e',
    },
    protocolSuf: {
        fontSize: 13,
        color: mainColor,
    },

    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:25,
    },
    row: {
        marginVertical: 5,
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
        color: 'rgb(120,120,120)',
    },
    arrowView: {
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderRightWidth: StyleSheet.hairlineWidth * 2,
        borderColor: '#8c8c85',
        transform: [{rotate: '45deg'}],
        marginRight: 10,
        marginBottom: 2,
        width: 10,
        height: 10,
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgb(200,200,200)',
        width: Dimensions.get('window').width - 50,
        alignSelf: 'center'
    }
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
        },
        pop: ()=> {
            dispatch(navigatePop())
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegPhone)
