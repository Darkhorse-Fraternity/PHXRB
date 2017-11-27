
import  {send} from'../request'
import {pushInstallation} from '../request/leanCloud'
import {Toast} from '../util'
import  PushNotification from 'react-native-push-notification'
import {push} from '../redux/nav'
import DeviceInfo from 'react-native-device-info'
import {Platform ,
    DeviceEventEmitter,
    Alert,
    NativeModules,} from 'react-native'

export default  function pushConfig(){


    if(Platform.OS == 'ios'){
        PushNotification.configure({

            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(value) {
                console.log('tokenValue:',value)
                const param = pushInstallation(value.os,value.token)
                send(param).then((response)=>{
                    console.log('push Registe Success:',response)
                })
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                // console.log( 'NOTIFICATION:', notification );
                const data = notification.data
                if(notification.foreground){
                    // Toast.show(notification.message)
                    Alert.alert(
                        data.title||'标题',
                        notification.message||"",
                        [
                            {text: '取消', onPress: () => {}},
                            {text: '确定', onPress: () =>{
                                push({key:'WebView',url:data.webUrl})
                            }},
                        ])
                }else {
                    push({key:'WebView',url:data.webUrl})
                }


            },

            // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "YOUR GCM SENDER ID",

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true,
        });
    }else{



        const LeanCloudPushNative = NativeModules.LeanCloudPush;

        LeanCloudPushNative.getInstallationId().then(id=>{
            const param = pushInstallation(Platform.OS,id)
            send(param).then((response)=>{
                console.log('response:',response)
            })

        })


        LeanCloudPushNative.getInitialNotification().then((res)=>{
            // console.log('InitialNotification:',res)
            const data = JSON.parse(res.data)
            push({key:'WebView',url:data.webUrl})
            Toast.show(data.alert)
            Alert.alert(
                data.title||'标题',
                data.alert||"",
                [
                    {text: '取消', onPress: () => {}},
                    {text: '确定', onPress: () =>{
                        push({key:'WebView',url:data.webUrl})
                    }},
                ])
        }).catch((err)=>{
            console.log('message:',err.message)
        })

        DeviceEventEmitter.addListener(LeanCloudPushNative.ON_RECEIVE, (res) => {

            const data = JSON.parse(res.data)
            Toast.show(data.alert)
            // console.log('ON_RECEIVE:',data)
            push({key:'WebView',url:data.webUrl})
            // Alert.alert(
            //     data.title||'标题',
            //     "",
            //     [
            //         {text: '取消', onPress: () => {}},
            //         {text: '确定', onPress: () =>{
            //             push({key:'WebView',url:data.webUrl})
            //         }},
            //     ])
        });
        DeviceEventEmitter.addListener(LeanCloudPushNative.ON_ERROR, (res) => {
            console.log('ON_ERROR:',res)
        });

    }

}