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
    Alert,
    Platform
} from 'react-native'
import {OS} from '../../util/';

import {BCButton} from '../../components/Base/WBButton'
import Button from 'react-native-button'
import {request} from '../../request'
import {phxr_verification_code} from '../../request/qzapi'
import {deepFontColor, backViewColor, blackFontColor, mainColor} from '../../configure'
import {connect} from 'react-redux'
import {navigateReplaceIndex, navigatePush} from '../../redux/actions/nav'
import {iForgot} from '../../redux/actions/login'
import {checkPhoneNum, checkIDCard,Toast} from '../../util'

const webUrl = 'https://static.dayi.im/static/fudaojun/rule.html?version=20160603182000';
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
            idCardNo:''
        };
    }

    state: {
        phone:string,
        time:number,
        codeName:string,
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
        const param = phxr_verification_code(this.state.phone,'8')
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
            }else{
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

    _goRegist=()=> {
        // 判断手机号的正则
        if (this.state.phone.length == 0) {
            Toast.show('用户名或手机号码不能为空');
            this.refs['0'].focus();
            return;
        }


        // if(this.state.idCardNo.length == 0){
        //    const msg = "因为您没有登记身份证信息，无法使用该功能，如需要找回密码，请拨打服务热线：0591-87668360"
        //
        //     if(Platform.OS == 'ios'){
        //        alert(msg)
        //     }else {
        //         Alert.alert(
        //             '提示',
        //             msg,
        //             [
        //                 {text: '确定', onPress: () =>{
        //                 }},
        //             ])
        //     }
        //     return;
        // }


        // if(!checkIDCard(this.state.idCardNo)){
        //     Toast.show('不是正确的身份证验证码');
        //     this.refs['2'].focus();
        //     return;
        // }
        //判断验证码的正则
        const reg = /^\d{6}$/;
        const flag = reg.test(this.state.ymCode)
        if (!flag) {
            Toast.show('不是正确验证码');
            this.refs['1'].focus();
            return;
        }

        this.props.mRegister(this.state);

    }


    componentWillUnmount() {
        this.id && clearInterval(this.id);
        this.requestHandle && this.requestHandle.next();
    }


    focusNextField(nextField: string) {

        if (nextField == '0') {
            this.refs['1'].focus();
        } else if (nextField == '1') {
            this._goRegist()
        }
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

    render() {
        var codeEnable = this.state.phone.length > 0 &&
            this.state.time == 60 && !this.state.isTap;
        const reg = /^\d{6}$/;
        const flag = reg.test(this.state.ymCode) &&
            this.state.phone.length > 0
        return (
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode='on-drag'>

                {this._renderRowMain('手机号:', '请填入手机号码或用户名',
                    (text) => this.setState({phone: text}), 'default', true, 11, "0"
                )}


                <View style={{flexDirection:'row'}}>
                    {this._renderRowMain('验证码:', '输入您收到的验证码',
                        (text) => {
                            this.setState({ymCode: text})
                        },
                        'numeric'
                        , false, 6, "1"
                    )}

                    <BCButton containerStyle={styles.buttonContainerStyle}
                              disabled={!codeEnable}
                              loaded={this.state.timeLoad}
                        //styleDisabled={{fontWeight:'normal'}}
                              onPress={this._onClickCode.bind(this)}
                              style={{fontWeight:'400',fontSize:14}}
                    >
                        {this.state.time == 60 || this.state.time == 0 ? '获取验证码' :
                        this.state.time.toString() + '秒'}
                    </BCButton>
                </View>

                {/*{this._renderRowMain('身份证:', '请填入身份证',*/}
                    {/*(text) => this.setState({idCardNo: text}), 'numeric', false, 50, "2"*/}
                {/*)}*/}

                <BCButton
                    disabled={!flag}
                    isLoad={this.props.state.loaded}
                    onPress={this._goRegist}
                    containerStyle={styles.buttonContainerStyle2}>
                    确定
                </BCButton>


                {/*<View style={styles.bottom}>*/}
                    {/*<Text style={styles.protocolPre}>点击注册,即表示已阅读并同意</Text>*/}
                    {/*<Button*/}
                        {/*onPress={this._gowebView}*/}
                        {/*style={styles.protocolSuf}>*/}
                        {/*《普汇信融用户服务条款》*/}
                    {/*</Button>*/}
                {/*</View>*/}
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
        push: ()=> {
            //index 为空 则为当前index
            dispatch(navigateReplaceIndex('TabView'));
        },
        mRegister: (state)=> {
            dispatch(iForgot(state));
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
