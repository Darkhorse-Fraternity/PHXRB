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
import createInvoke from 'react-native-webview-invoke/native'
import BaseWebView from '../../components/Base/BaseWebView'
import {mainColor} from '../../configure'
const WEBVIEW_REF = 'webview';
@connect(
    state =>({
        //state:state.util.get()
        userId: state.login.data.userId + ""
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
        refresh: (route)=> {
            dispatch(navigateRefresh(route))
        },
        push: (key)=> {
            dispatch(navigatePush(key))
        },
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
            title: '加载中。。',
            canGoBack: false
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
        userId: PropTypes.string,
    };

    static defaultProps = {
        userId: '',
    };

    canGoBack: boolean = false;

    backEventHandle = ()=> {
        // console.log('canGoBack:', this.canGoBack);
        if (this.state.canGoBack) {
            this.webview.goBack();
        }
    }


    componentDidMount() {


    }

    _onNavigationStateChange(state: Object) {
        // console.log('state:',state);
        if (state.title && state.title.length > 0 && !state.title.startsWith('103.236.253')) {
            // this && this.props.refresh({title: state.title});
            this.setState({title: state.title, canGoBack: state.canGoBack})
        }
        this.canGoBack = state.canGoBack;

    }

    renderBack() {
        if (this.state.canGoBack) {
            return (<TouchableOpacity
                onPress={this.backEventHandle}
                style={{width:100,height:40,justifyContent:'center'}}>
                <View style={styles.arrowView}/>

                {/*<Text style={styles.title}>{this.state.title}</Text>*/}
            </TouchableOpacity>)
        }
        return (
            <View style={{width:100}}/>
        )
    }


    render() {
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
                <BaseWebView
                    //ref={w => this.webview = w}
                    getWebView={w => this.webview = w}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    {...this.props}
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
        fontSize: 17,
        color: "white",
        fontWeight: 'bold'
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
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        backgroundColor: mainColor,
        height: Platform.OS === 'ios' ? 64 : 48,
        //borderBottomWidth: 1,
        alignItems: 'center',
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})


@connect(
    state =>({
        userType: state.login.data.userType
    }),
    dispatch =>({})
)

export class GW extends Component {
    render(): ReactElement<any> {
        const gwUrl = 'http://103.236.253.138:9090/phxrProject/gw/h5/gw-gw.html'
        const zggwUrl = 'http://103.236.253.138:9090/phxrProject/zggw/h5/gw-gw.html'
        return (             <PHXRWebView url={this.props.userType === 1 ?gwUrl:zggwUrl}/>         );
    }
}
@connect(
    state =>({
        userType: state.login.data.userType
    }),
    dispatch =>({})
)

export class MSG extends Component {
    render(): ReactElement<any> {
        const gwUrl = 'http://103.236.253.138:9090/phxrProject/gw/h5/gw-xx.html'
        const zggwUrl = 'http://103.236.253.138:9090/phxrProject/zggw/h5/gw-xx.html'
        return (             <PHXRWebView url={this.props.userType === 1 ?gwUrl:zggwUrl}/>         );
    }
}
@connect(
    state =>({
        userType: state.login.data.userType
    }),
    dispatch =>({})
)

export class ZG extends Component {
    render(): ReactElement<any> {
        const gwUrl = 'http://103.236.253.138:9090/phxrProject/gw/h5/gw-jg.html'
        const zggwUrl = 'http://103.236.253.138:9090/phxrProject/zggw/h5/gw-jg.html'
        return (             <PHXRWebView url={this.props.userType === 1 ?gwUrl:zggwUrl}/>         );
    }
}
@connect(
    state =>({
        userType: state.login.data.userType
    }),
    dispatch =>({})
)

export class WD extends Component {
    render(): ReactElement<any> {
        const gwUrl = 'http://103.236.253.138:9090/phxrProject/gw/h5/gw-wd.html'
        const zggwUrl = 'http://103.236.253.138:9090/phxrProject/zggw/h5/gw-wd.html'
        return (             <PHXRWebView url={this.props.userType === 1 ?gwUrl:zggwUrl}/>         );
    }
}

