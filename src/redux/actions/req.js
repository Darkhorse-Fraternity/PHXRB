/**
 * Created by lintong on 10/19/16.
 * @flow
 */
'use strict';
import {send} from '../../request'
export const REQUEST_LOAD = 'REQUEST_LOAD'
export const REQUEST_SUCCEEED = 'REQUEST_SUCCEEED'
export const REQUEST_FAILED = 'REQUEST_FAILED'
export const REQUESR_CHANGE_DATA = 'REQUESR_CHANGE_DATA'
import {Toast} from '../../util'
export function request(key: string, params: Object,callbacll:Function): Function {

    return (dispatch) => {
        dispatch(requestStart(key));//当page 不为0 的时候则表示不是加载多页。
        send(params).then(response => {
            callbacll && callbacll(response)
            console.log('response:',response);
            if(response.rspCode == "0000"){
                console.log('test:', response.rspCode == '0000');
                dispatch(requestSucceed(key, response.result))
            }else{
                Toast.show(response.rspMsg+"")

                dispatch(requestFailed(key, response.rspMsg))
            }

        }).catch(e => {
            Toast.show(e.message)
            dispatch(requestFailed(key, e.message))
        })
    }
}

function requestSucceed( key: string,data: Object): Object {
    return {
        type: REQUEST_SUCCEEED,
        load: false,
        payload: data,
        key,
    }

}


/**
 * 请求失败
 * @param  {[type]} response:Object [description]
 * @return {[type]}                 [description]
 */
function requestFailed(key: string, err: any): Object {
    return {
        type: REQUEST_FAILED,
        load: false,
        key,
        err,
    }
}

/**
 * 开始请求，使得loaded 变动。
 * @param  {[type]} response:Object [description]
 * @return {[type]}                 [description]
 */
function requestStart(key: string): Object {
    return {
        type: REQUEST_LOAD,
        load: true,
        key,
    }
}

export function reqChangeData(key: string, data: Object): Object {
    return {
        type: REQUESR_CHANGE_DATA,
        payload: data,
        key,
    }
}