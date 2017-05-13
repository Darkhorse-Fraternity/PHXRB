/**
 * Created by lintong on 2017/5/12.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    WebView,
    TouchableOpacity,
    Image,
    Platform,
    Linking,
    NavigationExperimental
} from 'react-native'
const {
    Header: NavigationHeader,
} = NavigationExperimental;
import {connect} from 'react-redux'
import {navbarHeight, screenHeight} from '../../util'
import {bindActionCreators} from 'redux';
//static displayName = PHXRWebView
import {navigatePush, navigatePop, navigateRefresh} from '../../redux/actions/nav';
import ExceptionView, {ExceptionType} from '../../components/ExceptionView';
const WEBVIEW_REF = 'webview';
@connect(
    state =>({
        //state:state.util.get()
        userId: state.login.data.userId
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
        refresh: (route)=> {
            dispatch(navigateRefresh(route))
        }
    })
)
export  default  class PHXRWebView extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            status: "No Page Loaded",
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true,
            title:'加载中。。',
            canGoBack:false
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

    canGoBack: boolean = false;

    backEventHandle() {
        if (this.canGoBack) {
            this.refs[WEBVIEW_REF].goBack();
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

    componentDidMount() {
        // this.props.refresh({,title:'加载中。。'});

    }

    _onNavigationStateChange(state: Object) {
        // console.log('state:',state);
        if (state.title && state.title.length > 0) {
            // this && this.props.refresh({title: state.title});
            this.setState({title:state.title,canGoBack:state.canGoBack})
        }
        this.canGoBack = state.canGoBack;

    }

    _onError(error: Object) {
        console.log("webError:", error);
    }

    _onLoadStart(event) {
        console.log("onloadStart:", event.nativeEvent);
    }

    _onLoad() {

    }

    _renderError() {
        return (
            // <ExceptionView exceptionType={ExceptionType.NetError} image={noWifi}/>
            <ExceptionView style={{height:screenHeight}} exceptionType={ExceptionType.NetError}/>
        );
    }

    _renderLoading() {
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
    _onShouldStartLoadWithRequest(event: Object) {
        //Implement any custom loading logic here, don't forget to return!
        console.log("onShouldStartLoadWithRequest:", event.url);
        if (event.url.startsWith('http://') || event.url.startsWith('https://')) {
            return true;
        } else {
            Linking.canOpenURL(event.url)
                .then(supported => {
                    if (supported) {
                        return Linking.openURL(url);
                        // return false;
                    } else {
                        return false;
                    }
                }).catch(err => {
                return false;
            })
        }

        return false;
    }

    renderBack() {
        if (this.state.canGoBack) {
            return (<TouchableOpacity
                onPress={this._backEvent}
                style={{width:100,height:40,justifyContent:'center'}}>
                <View style={styles.arrowView}/>

                <Text style={styles.title}>{this.state.title}</Text>
            </TouchableOpacity>)
        }
        return (
            <View style={{width:100}}/>
        )
    }

    render() {
        //  console.log(this.props.scene);
        // console.log(this.props.scene .route.url);
        //  var header = Object.assign({}, httpHeader,{token:userManager.userData.user_token || ""})
        const url = !this.props.scene ? this.props.url : this.props.scene.route.url
        const headers = {userId: this.props.userId + ''}
        return (
            <View style={[styles.container]}>
                <View
                    {...this.props}
                    //renderTitleComponent={this._renderTitleComponent}
                    style={[styles.navigationHeader]}
                    //renderLeftComponent={this._renderBackButton}
                    //onNavigateBack={this.backEventHandle}
                >
                    {this.renderBack()}
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableOpacity style={{width: 100}}/>
                </View>
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{uri: url,headers:headers}}
                    // javaScriptEnabled={false}
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
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfbfb',
    },
    webView: {
        flex: 1,
        backgroundColor: '#fbfbfb',
        marginTop: navbarHeight,
    },
    appbar: {
        alignItems: 'center',
        backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
        borderBottomColor: 'rgba(0, 0, 0, .15)',
        borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    title: {
        fontSize:17,
        color:"white",
        fontWeight:'bold'
    },

    left: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
    },

    right: {
        bottom: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 100,
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
    navigationHeader: {
        paddingTop:Platform.OS === 'ios'?20:0,
        backgroundColor: '#0085d9',
        height: Platform.OS === 'ios' ? 64 : 48,
        //borderBottomWidth: 1,
        alignItems: 'center',
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

export class GW extends Component {
    render(): ReactElement<any> {
        return (
            <PHXRWebView url="http://103.236.253.138:9090/phxrProject/gw/h5/gw-gw.html"/>
        );
    }
}

export class MSG extends Component {
    render(): ReactElement<any> {
        return (
            <PHXRWebView url="http://103.236.253.138:9090/phxrProject/gw/h5/gw-xx.html"/>
        );
    }
}

export class ZG extends Component {
    render(): ReactElement<any> {
        return (
            <PHXRWebView url="http://103.236.253.138:9090/phxrProject/gw/h5/gw-zg.html"/>
        );
    }
}