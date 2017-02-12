/*@flow*/
'use strict'



import TabView  from './TabView'
import LoginView from '../../pages/Setting/LoginView';
import PersonCenter from '../../pages/PersonInfo/PersonCenter';
import PersonInfo from '../../pages/PersonInfo';
import BaseWebView from '../../components/Base/BaseWebView';
import Setting from '../../pages/Setting';
import FindPwd from '../../pages/Setting/FindPwd';
import RegPhone from '../../pages/Setting/RegPhone'
import Feedback from '../../pages/Setting/Feedback'
import AlterPwd from '../../pages/PersonInfo/AlterPwd'
import NickName from '../../pages/PersonInfo/NickName'
import Home from '../../pages/PHXR/Home'
import Financing from '../../pages/PHXR/Financing'
import Financed from '../../pages/PHXR/Financed'

import WidgetForm from '../../components/WidgetForm/WidgetForm'
import Account from '../../pages/PersonInfo/Account'
import UserInfo from '../../pages/PersonInfo/UserInfo'
import CreditInfo from '../../pages/PersonInfo/CreditInfo'
import AssetsInfo from '../../pages/PersonInfo/AssetsInfo'
import AssetsList from '../../pages/PersonInfo/AssetsList'
import FinanceDetail from '../../pages/PHXR/FinanceDetail'
import UserInfoDetail from '../../pages/PersonInfo/UserInfoDetail'
import Aptitude from '../../pages/PersonInfo/Aptitude'
export  const PageMap =
{
  Aptitude,
  UserInfoDetail,
  FinanceDetail,
  AssetsList,
  AssetsInfo,
  CreditInfo,
  UserInfo,
  Account,
  Financing,
  Financed,
  WidgetForm,
  Home,

  "WebView"             : BaseWebView,
  'TabView'             : TabView,

  'LoginView'           : LoginView,
  "PersonCenter"        : PersonCenter,
  "PersonInfo"          : PersonInfo,
  "Setting"             : Setting,
  "FindPwd"             : FindPwd,
  'Feedback'            : Feedback,
  "AlterPwd"            : AlterPwd,
  "NickName"            : NickName,
  // "PhoneContacts"       : PhoneContacts,
  'RegPhone'            : RegPhone,

}
