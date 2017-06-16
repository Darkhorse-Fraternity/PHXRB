import {combineReducers} from 'redux'
// import {userManager} from '../../util/XGlobal'
import {
    TAB_SWITCH,
} from '../actions/tab'
//import {checkPhoneNum} from '../../util';
import {
    LOGIN_SUCCEED,
    LOGOUT,
} from '../actions/login'


//TODO:这边要做统一的tab 上 navBar 的管理，不让装载的view 做特殊处理。

/**
 * tabs:装载的view 的key
 * @type {Object}
 */

const menu_adviser = require('../../../source/img/tabs/menu_adviser.png');
const menu_adviser_click = require('../../../source/img/tabs/menu_adviser_click.png');
const menu_home = require('../../../source/img/tabs/menu_home.png');
const menu_home_click = require('../../../source/img/tabs/menu_home_click.png');
const menu_leader = require('../../../source/img/tabs/menu_leader.png');
const menu_leader_click = require('../../../source/img/tabs/menu_leader_click.png');
const menu_my = require('../../../source/img/tabs/menu_my.png');
const menu_my_click = require('../../../source/img/tabs/menu_my_click.png');
const menu_news = require('../../../source/img/tabs/menu_news.png');
const menu_news_click = require('../../../source/img/tabs/menu_news_click.png');

const unLoginTabs = [

    {key: 'Home', selectImage: menu_home, unSelectImage: menu_home_click, title: '首页'},
    {key: 'GW', selectImage: menu_adviser, unSelectImage: menu_adviser_click, title: '顾问'},
    {key: 'ZG', selectImage: menu_leader, unSelectImage: menu_leader_click, title: '机构'},
    {key: 'MSG', selectImage: menu_news, unSelectImage: menu_news_click, title: '消息'},
    {key: 'WD', selectImage: menu_my, unSelectImage: menu_my_click, title: '我的'},
]

const loginTabs = unLoginTabs

const initialTabState = {
    index: 0,
    tabs: unLoginTabs,
}

function tabState(state = initialTabState, action) {
    switch (action.type) {
        case TAB_SWITCH:
            // if (action.index == state.index) {
            //     return state
            // }
            return {
                ...state,
                index: action.index,
                navState: action.navState,
            }
        // case LOGIN_SUCCEED:
        //
        //     return {
        //         ...state,
        //         tabs: loginTabs,
        //         index:state.index ==0?0:2
        //     }
        case LOGOUT:
            return initialTabState

        default:
            return state;

    }


}


const tabReducers = combineReducers({
    tabState
})

export default tabReducers
