/**
 * Created by lintong on 2016/11/6.
 * @flow
 */
'use strict';

export const SHARE_TO_TIMELINE = 'SHARE_TO_TIMELINE'
export const SHARE_TO_SESSION = 'SHARE_TO_SESSION'
export const SHARE_TO_QQ = 'SHARE_TO_QQ'
export const Share_TO_ZONE = 'Share_TO_ZONE'
export const SHARE_TO_SINA = 'SHARE_TO_SINA'
import * as WeChat from 'react-native-wechat';
import * as QQAPI from 'react-native-qq';
import {Toast} from '../../util'

WeChat.registerApp('wxbd3fc96a076aec22')

export function shareTo(type: string,param:object):Function {

    return dispatch => {
        if(type ==SHARE_TO_TIMELINE || type == SHARE_TO_SESSION){
            dispatch(shareToWechat(type,param))
        }else if(type ==SHARE_TO_QQ || type == Share_TO_ZONE) {
            dispatch(shareToQQ(type,param))
        }else if(type == SHARE_TO_SINA) {
            dispatch(shareToWeibo(param))
        }
    }



}


export  function shareToWechat(type: string,param:object): Function {




    let Method = WeChat.shareToTimeline;
    if (type == SHARE_TO_SESSION) Method = WeChat.shareToSession

    return async(dispatch)=> {



        try {
            const res = await WeChat.isWXAppInstalled()
            if(!res){
                Toast.show('需要先安装微信!')
                return
            }
            const res2 = await WeChat.isWXAppSupportApi()
            if(!res2){
                Toast.show('当前版本微信不支持!')
                return
            }


            let result = await Method({
                type: 'news',
                title: param.title||'web image',
                webpageUrl: param.webpageUrl||'www.baidu.com',
                description: param.description||'share web image to time line',
                mediaTagName: 'email signature',
                messageAction: undefined,
                messageExt: undefined,
                imageUrl: param.imageUrl||'http://www.ncloud.hk/email-signature-262x100.png',
                thumbImage:param.thumbImage
            });
            console.log('share text message to time line successful:', result);
            return dispatch(()=> {
                type, result
            })
        } catch (e) {
            Toast.show(e.message)
            console.error('share text message to time line failed with:', e.message);
        }
    }


}

export function shareToQQ(type:string,param:object):Function{
    let Method = QQAPI.shareToQQ;
    if(type == Share_TO_ZONE)  Method = QQAPI.shareToQzone

    return async (dispatch)=> {

        try {
            await QQAPI.isQQInstalled()
            await QQAPI.isQQSupportApi()
            let result = await Method({
                type: 'news',
                title: param.title||'分享标题',
                description:  param.description||'描述',
                webpageUrl: param.webpageUrl||'网页地址',
                imageUrl: param.imageUrl||param.thumbImage||'http://www.ncloud.hk/email-signature-262x100.png',
            });
            console.log('share text message to time line successful:', result);
            return dispatch(()=> {
                type, result
            })
        } catch (e) {
            Toast.show('分享失败,请检查QQ是否安装,或者版本是否支持。')
            console.log('share text message to time line failed with:', e.message);
        }
    }
}

export  function shareToWeibo(param:object) :Function{
    return async    (dispatch)=> {
        try {
            let result = await WeiboAPI.share({
                type: 'news',
                text: '描述',
                imageUrl: '远程图片地址',
            });
            console.log('share text message to time line successful:', result);
            return dispatch(()=> {
                type:SHARE_TO_SINA, result
            })
        } catch (e) {
            console.error('share text message to time line failed with:', e.message);
        }
    }

}