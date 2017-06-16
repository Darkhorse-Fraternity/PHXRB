/* @flow */
'use strict';
import React, {Component,PropTypes} from 'react';
import  {
    StyleSheet,
    Text,
    View,
    ScrollView,
    WebView as WebViewIOS,
    TouchableOpacity,
    Image,
    Platform,
    Linking
} from 'react-native';
import * as immutable from 'immutable';
import {navbarHeight,screenHeight} from '../../util';
// import {httpHeader} from '../../configure';
// import {userManager} from '../../util/XGlobal';
import ExceptionView, {ExceptionType} from '../ExceptionView';
import {connect} from 'react-redux';
import { navigatePush, navigatePop, navigateRefresh } from '../../redux/actions/nav';
// import Alipay from 'react-native-payment-alipay';
import {addParams} from '../../request/useMeth'

// import WebViewAndroid from './WebViewAndroid'
import {logout} from '../../redux/actions/login'

// console.log('WebViewAndroid:', WebViewAndroid);
const WebView = Platform.OS == 'ios'? WebViewIOS:WebViewIOS
// const WebView = WebViewIOS



const UIManager = require('UIManager');
const WEBVIEW_REF = 'webview';
import createInvoke from 'react-native-webview-invoke/native'
// const noWifi = require('../../../source/img/xy_nowifi/xy_nowifi.png');
@connect(
    state =>({
        userId: state.login.data.userId?state.login.data.userId+'':''
    }),
    (dispatch, props) =>({
        push:(key)=>{
            dispatch(navigatePush(key))
        },
        pop:(state)=>{
            dispatch(navigatePop(state))
        },
        refresh:(route)=>{
            dispatch(navigateRefresh(route))
        },
        share:()=>{

        },
        logout:()=>{
            dispatch(logout())
        }

    })
)
export  default class BaseWebView extends Component {

    constructor(props:Object){
        super(props);
        this.state = {
            status:"No Page Loaded",
            backButtonEnabled:false,
            forwardButtonEnabled:false,
            loading: true,
            scalesPageToFit:true,
        };
    }

    state: {
        status:string,
        backButtonEnabled:bool,
        forwardButtonEnabled:bool,
        loading:bool,
        scalesPageToFit:bool,
    };

    static propTypes = {
        url: PropTypes.string,
    };

    canGoBack:boolean = false;
    backEventHandle() {
        if (this.canGoBack) {
            this.webview.goBack();
        }else {
            this.props.pop();
        }
    }

    renderLeftComponent() {
        return (
            // onPress={props.onNavigateBack}
            <TouchableOpacity style={styles.buttonContainer} onPress={this.backEventHandle.bind(this)}>
                <View style={styles.arrowView}/>
            </TouchableOpacity>
        );
    }

    shouldComponentUpdate(nextProps: Object,nextState:Object) {
        return !immutable.is(this.props, nextProps) ||
            !immutable.is(this.state,nextState)
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.userId != this.props.userId){
            this.sendUserID(nextProps.userId)
        }
    }



    gologin = ()=>{
        this.props.push('LoginView')
    }

    webview: WebView
    invoke = createInvoke(() => this.webview)
    sendUserID:Function


    componentDidMount() {
        this.invoke.define('goBack', this.props.pop)
            .define('gologin', this.gologin)
            .define('logout', this.props.logout)
            .define('share', this.props.share)

        this.sendUserID = this.invoke.bind('sendUserID')
        // console.log('test:', this.props.userI);
        // console.log('this.props.userId:', this.props.userId);
        this.sendUserID(this.props.userId)

        if(this.props.scene){
            this.props.refresh({renderLeftComponent:this.renderLeftComponent.bind(this),title:'加载中。。'});
        }else {
            this.props.refresh({title:'加载中。。'});
        }

    }

    _onNavigationStateChange(state:Object){
        // console.log('state:',state);
        if(state.title && state.title.length > 0 && !state.title.startsWith('103.236.253') ){
            this && this.props.refresh({title:state.title});
        }
        this.canGoBack = state.canGoBack;
        this.props.onNavigationStateChange && this.props.onNavigationStateChange(state)
    }

    _onError(error:Object){
        this.webview.reload()
        // console.log("webError:",error);
    }
    _onLoadStart(event){
        // console.log("onloadStart:", event.nativeEvent);
    }
    _onLoad(){

    }
    _renderError(){
        return (
            // <ExceptionView exceptionType={ExceptionType.NetError} image={noWifi}/>
            <ExceptionView style={{height:screenHeight}} exceptionType={ExceptionType.NetError} />
        );
    }
    _renderLoading(){
        return (
            <ExceptionView style={{height:screenHeight}} exceptionType={ExceptionType.Loading}/>
        );
    }
    // let jsCode = `
    //         document.querySelector('#myContent').style.backgroundColor = 'red';
    //     `;
    //
    //
    /**
     * iOS
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    _onShouldStartLoadWithRequest(event:Object) {
        //Implement any custom loading logic here, don't forget to return!
        console.log("onShouldStartLoadWithRequest:", event.url);
        if(event.url.startsWith('http://') || event.url.startsWith('https://')) {
            return true;
        }else{
            Linking.canOpenURL(event.url)
                .then(supported => {
                    if(supported){
                        return Linking.openURL(url);
                        // return false;
                    }else{
                        return false;
                    }
                }).catch(err => {
                return false;
            })
        }

        return false;
    }




    webview: WebView
    invoke = createInvoke(() => this.webview)
    render() {
        //  console.log(this.props.scene);
        // console.log(this.props.scene .route.url);
        //  var header = Object.assign({}, httpHeader,{token:userManager.userData.user_token || ""})
        const headers = {userId: this.props.userId + ''}
        let  url = this.props.url || this.props.scene.route.url
        const data = {
            userId : this.props.userId,
            platform:Platform.OS,
        }
        url = addParams(url,data)
        // console.log('url:', url);
        return (
            <View style={[styles.container]}>
                <WebView
                    ref={w => {
                        this.webview = w
                        this.props.getWebView && this.props.getWebView(w)
                        {/*this.sendUserID(this.props.userID)*/}
                    }}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{uri: url,headers:headers}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest.bind(this)}
                    //javaScriptEnabled={false}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                    onError={this._onError}
                    onLoadStart={this._onLoadStart}
                    onLoad={this._onLoad} //
                    onMessage={this.invoke.listener}
                    //onMessage={()=>{}}
                    //onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest.bind(this)}//iOS,Android 咱么处理
                    //onLoadEnd
                    //injectedJavaScript=jsCode  //Sets the JS to be injected when the webpage loads.
                    renderLoading={this._renderLoading} //Function that returns a loading indicator.
                    renderError={this._renderError} //Function that returns a view to show if there's an error.
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfbfb',
    },
    webView: {
        flex:1,
        backgroundColor: '#fbfbfb',
        marginTop:navbarHeight,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width:100,
    },
    button: {
        margin: Platform.OS === 'ios' ? 14 : 16,
        //resizeMode: 'contain'
    },
    arrowView: {
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderRightWidth: StyleSheet.hairlineWidth * 2,
        borderColor: 'white',
        transform: [{rotate: '135deg'}],
        marginLeft: 15,
        width: 10,
        height: 10,
    },
});


