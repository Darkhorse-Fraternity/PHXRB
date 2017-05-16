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
    Platform,
    Dimensions,
    RefreshControl,
} from 'react-native'
import Swiper from 'react-native-swiper'
import * as immutable from 'immutable';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {placeholder} from '../../../source/'
import {push} from '../../redux/nav'
import {renderNavImageButton} from '../../util/viewUtil'
//static displayName = Home
import {Button, WhiteSpace} from 'antd-mobile';
import {icon_class} from '../../../source'
import {logo} from '../../../source'
import {phxr_app_home} from '../../request/qzapi'
import {request} from '../../redux/actions/req'
var DeviceInfo = require('react-native-device-info');
@connect(
    state =>({
        data: state.req.get('phxr_app_home'),
        isLogin: state.login.isLogin,
        userId: state.login.data.userId
    }),
    (dispatch, props) =>({
        //...bindActionCreators({},dispatch),
        load: ()=> {
            dispatch(async(dispatch, getState)=> {

                // const uid = getState().login.data.userId
                const params = phxr_app_home(DeviceInfo.getBuildNumber(), Platform.OS)
                await dispatch(request('phxr_app_home', params))

            })

        }
    })
)
export  default  class Home extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {
        load: PropTypes.func.isRequired,
    };
    static defaultProps = {
        data: immutable.fromJS({})
    };

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props.data, nextProps.data)
    }

    componentDidMount() {
        // const renderLeftComponent = renderNavImageButton(icon_class, 'left',
        //     ()=>push('PersonInfo'))
        // refresh({renderLeftComponent})
        // console.log('test:', 'load');
        this.props.load()
    }


    __renderclassifyArea(classifyArea, i) {
        // console.log('test:', this.props.userId);
        return (
            <TouchableOpacity
                onPress={()=>{
                    if(!this.props.isLogin){
                                    push('LoginView')
                                }else {
                                  push({key:'WebView',url:classifyArea.activityUrl,
                                  headers:{userId:this.props.userId+''}})
                               }
                     }}
                style={{marginLeft:25}}
                key={'key_'+i}>
                {classifyArea.ifRedShow == 1 && (<View style={styles.redTip}/>)}
                <Image
                    style={styles.classfyAreaImage}
                    source={{uri: classifyArea.logoUrl}}/>
                <View style={{flexDirection:'row', alignSelf: 'center',}}>
                    <Text style={styles.classfyAreaText}>
                        {classifyArea.activityName}
                    </Text>

                </View>
            </TouchableOpacity>
        )
    }

    __renderHotArea(classifyArea, i) {
        return (
            <TouchableOpacity
                style={{backgroundColor:'white',alignItems:'center'}}
                onPress={()=>{
                         push({key:'WebView',url:classifyArea.activityUrl})
                     }}
                key={'key_'+i}>
                {classifyArea.ifRedShow == 1 && (<View style={[styles.redTip,{top:-6,right:6,}]}/>)}
                <Image
                    style={[styles.hotAreaImage]}
                    source={{uri: classifyArea.logoUrl}}/>
                <View style={{flexDirection:'row', alignSelf: 'center',}}>
                    <Text style={styles.classfyAreaText}>
                        {classifyArea.activityName}
                    </Text>

                </View>
            </TouchableOpacity>
        )
    }

    __renderHeader(): ReactElement<any> {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>融资顾问</Text>
            </View>)
    }

    __renderNews(data): ReactElement<any> {
        // console.log('data:', data);
        return (
            <Swiper
                style={styles.news} height={50}
                showsPagination={false} autoplayTimeout={10}
                autoplay={true}>
                {data.map((obj, i)=> {
                    return (
                        <TouchableOpacity
                            onPress={()=>{
                                     push({key:'WebView',url:obj.activityUrl})
                                 }}
                            key={'key_'+i}
                            style={styles.newsSlide}>
                            <Image style={styles.newsImage} source={{uri: obj.logoUrl}}/>
                            <Text numberOfLines={1} style={styles.newsText}>{obj.activityName} </Text>
                        </TouchableOpacity>
                    )
                })}
            </Swiper>
        )
    }

    render(): ReactElement<any> {
        const data = this.props.data.toJS().data
        const load = this.props.data.toJS().load|| false


        if (!data) return ( <ScrollView
            style={{marginTop:100}}
                refreshControl={
              <RefreshControl

                refreshing={load}
                onRefresh={this.props.load}
                />
            }/>)

        const activeArealist = data.activeArealist
        const classifyArealist = data.classifyArealist
        const hotArealist = data.hotArealist
        const rollArealist = data.rollArealist


        return (
            <ScrollView
                refreshControl={
              <RefreshControl
                refreshing={load}
                onRefresh={this.props.load}
                />
            }
                style={[this.props.style, {backgroundColor:"#dcdcdc",}]}>

                <View style={styles.wrapper}>
                    {this.__renderHeader()}
                    <Swiper
                        style={styles.swiper} height={200}
                        activeDotColor="white"
                        dotColor="rgba(255,255,255,0.4)"
                        paginationStyle={{zIndex:100,bottom:5}}
                        dotStyle={{width:6,height:6,borderRadius:3}}
                        activeDotStyle={{width:6,height:6,borderRadius:3}}
                        showsPagination={true} autoplayTimeout={20}
                        removeClippedSubviews={false}
                        autoplay={true} >
                        {activeArealist.map((image, i)=> {
                            return (
                                <TouchableOpacity
                                    onPress={()=>{
                                    push({key:'WebView',url:image.activityUrl})
                                 }}
                                    key={'key_'+i}
                                    style={styles.slide}>
                                    <Image style={{flex:1}}
                                           source={{uri: image.logoUrl}}
                                    />
                                </TouchableOpacity>
                            )
                        })}
                    </Swiper>
                </View>

                {this.__renderNews(rollArealist)}
                <View style={{backgroundColor:'white'}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {classifyArealist.map((obj, i)=> {
                            return this.__renderclassifyArea(obj, i)
                        })}
                    </ScrollView>
                    <View style={styles.line}/>
                    <View style={[styles.hotArea]}>
                        {hotArealist.map((obj, i)=> {
                            return (
                                <View key={'key'+ i}
                                      style={styles.hotAreaItem}
                                >
                                    {this.__renderHotArea(obj, i)}
                                </View>

                            )

                        })}
                    </View>
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
        backgroundColor: '#dcdcdc',

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
    },
    wrapper: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 2},
        elevation: 5,
        zIndex: 10,
    },
    swiper:{
        backgroundColor: 'white',
    },
    slide: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#9DD6EB',
    },
    classfyAreaImage: {
        width: 60,
        height: 60,
        marginTop: 20,
    },
    classfyAreaText: {
        fontSize: 13,
        marginTop: 5,
    },
    line: {
        height: StyleSheet.hairlineWidth,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(200,200,200,0.2)',
        marginTop: 20,
    },
    redTip: {
        width: 6,
        height: 6,
        marginTop: 12,
        borderRadius: 23,
        backgroundColor: 'red',
        marginLeft: 5,
        zIndex: 10,
        top: 10,
        right: 5,
        position: 'absolute',
    },
    hotArea: {
        flexWrap: "wrap",
        flexDirection: 'row',
        width: Dimensions.get('window').width,

    },
    hotAreaItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (Dimensions.get('window').width) / 4,
        height: (Dimensions.get('window').width) / 4,
        borderColor: 'rgba(200,200,200,0.2)',
        borderWidth: StyleSheet.hairlineWidth,
    },
    hotAreaImage: {
        width: (Dimensions.get('window').width) / 8,
        height: (Dimensions.get('window').width) / 8,
    },
    header: {
        height:Platform.OS== 'ios'? 64:44,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        zIndex: 100,
        position: 'absolute',
        borderBottomColor: 'rgba(255,255,255,0.5)',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerText: {
        marginTop: 10,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    news: {
        backgroundColor: 'white',
        marginBottom: 10,
    },
    newsSlide: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,

    },
    newsImage: {
        width: 20,
        height: 20,

    },
    newsText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#006ddc',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width - 50,
    }
})
