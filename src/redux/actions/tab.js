/* @flow */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict'

/**
 * 这类项目 在第二个页面是被隐藏的，
 * 所以只需要一个Route栈来做管理就可以了。
 * 所以这边的tab和TabView就是一个普通的View.
 */


export const TAB_SWITCH = 'TAB_SWITCH'
import {renderNavImageButton} from '../../util/viewUtil'
import {icon_search} from '../../../source'
import {navigateRefresh,navigatePush} from './nav'

/**
 * 切换tab 的index 这边和传统的ios一直 用number 来控制。
 * @param  {[type]} Param:Object [description]
 * @return {[type]}              [description]
 */

export function tabSwitch(index: number):Function {

    return (dispatch,getState)=>{
        if(index != 4){
            // const renderLeftComponent = renderNavImageButton(icon_search, 'left',
            //     ()=>dispatch(navigatePush('PersonInfo')))
            // dispatch(navigateRefresh({renderLeftComponent}))
        }else{
            // dispatch(navigateRefresh({renderLeftComponent:null}))
            // 判断是否登录，没有登录则去登录
            // const isLogin = getState().login.isLogin
            // if(!isLogin){
            //     //去登录
            //     dispatch(navigatePush('LoginView'))
            //     return
            // }

        }

        return dispatch(tabSwitchResult(index))
    }
}

//记录下navBar的状态。
function tabSwitchResult(index) {
    return {
        type: TAB_SWITCH,
        index,
    }
}