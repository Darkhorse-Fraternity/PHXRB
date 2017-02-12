/*@flow*/
'use strict'


/**
 * 和page 分开写是为了避免循环引用，所以这边需要记得保持key的一致性。
 */



export const pageConfig = {
    'TabView': {
        title: '普惠信融', hideBackBtn: true, gestureResponseDistance: 0.0001,
    },
    'LoginView': {
        title: '登录', hideNavBar: true, gestureResponseDistance: 0.0001,
        direction: 'vertical'
    },
    "Financing": {title: '我要融资'},
    'Financed': {title: '我的融资'},
    "PersonCenter": {hideNavBar: true},
    "BaseWebView": {title: "加载中。。", gestureResponseDistance: 0.0001},
    "CourseInfoView": {title: "课程详情",},
    "LessonEvaluateView": {title: "课程评价",},
    "PersonInfo": {title: "设置",},
    "MyOrder": {title: "我的订单",},
    "Setting": {title: "设置",},
    "FindPwd": {title: "找回密码",},
    'Feedback': {title: "意见反馈",},
    "ClassRecord": {title: "课时流水",},
    "AlterPwd": {title: "修改密码",},
    "NickName": {title: "修改昵称",},
    "PhoneContacts": {title: "修改手机号",},
    'RegPhone': {title: '注册'},
    'Contribute': {title: '创意服务'},
    'Intro': {title: '介绍', hideNavBar: true, gestureResponseDistance: 100},
    'IdeaList': {title: '创意列表'},
    'iShowList': {title: '我的发布'},
    'iShowDetail': {title: ''},
    'Comment': {title: '评论'},
    'AddComment': {title: '写评论'},
    'Submit': {title: '选择类型'},
    'Normal': {title: '创意服务'},
    'iCommit': {title: '购买'},
    'iServe': {title: '我的服务'},
    'iPurchase': {title: ''},
    'iReply': {title: '回复'},
    'iRate': {title: '评价'},
    'introDetail': {title: '回复'},
    'About': {title: '关于我们'},
    'Home': {title: "普汇信融", direction: 'vertical'},
    "Account": {title: '账户信息'},
    "UserInfo": {title: '我的信息'},
    "CreditInfo": {title: '信用信息'},
    "AssetsInfo": {title: "资产信息"},
    "AssetsList": {title: "资产列表"},
    "FinanceDetail": {title: "融资详情"},
    "UserInfoDetail": {title: '修改个人资料'},
    "Aptitude": {title: '我的资料'},
    "AptDetail": {title: '新增资料'},
    "Business": {title:"需求确认"},
    "BusinessList":{title:'业务列表'},
    "MemberList":{title:'会员列表'},
    "MemberInfo":{title:'会员信息'},
}

export function config(key: string): Object {

    return {
        key: key,
        ...(pageConfig[key] || {title: key}),
    }
}

function defaultConfig() {
    return {}
}