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
import AssetsInfo from '../../pages/PersonInfo/AssetsInfo'
import AssetsList from '../../pages/PersonInfo/AssetsList'
import FinanceDetail from '../../pages/PHXR/FinanceDetail'
import UserInfoDetail from '../../pages/PersonInfo/UserInfoDetail'
import Aptitude from '../../pages/PersonInfo/Aptitude'
import AptDetail from '../../pages/PersonInfo/AptDetail'
import MemberList from '../../pages/PHXR/MenberList'
import MemberInfo from '../../pages/PHXR/MemberInfo'
import Business from '../../pages/PHXR/Business'
import BusinessList from '../../pages/PHXR/BusinessList'
import Information from '../../pages/PHXR/Information'
import Demand from '../../pages/PHXR/Demand'
import Credit from '../../pages/PHXR/Credit'
import InfoUpLoad from '../../pages/PHXR/InfoUpLoad'
import AddCar from '../../pages/PHXR/AddCar'
import AddHouse from '../../pages/PHXR/AddHouse'
import MemberUserInfo from '../../pages/PHXR/MemberUserInfo'
import MemberUserInfoDetail from '../../pages/PHXR/MemberUserInfoDetail'
import FinanceTip from '../../pages/PHXR/FinanceTip'
import FilesScan from '../../pages/PHXR/FilesScan'

import {GW,MSG,ZG,WD} from '../../pages/PHXR/PHXRWebView'
export  const PageMap =
{
  WD,
  GW,
  MSG,
  ZG,
  FilesScan,
  FinanceTip,
  MemberUserInfoDetail,
  MemberUserInfo,
  AddHouse,
  AddCar,
  InfoUpLoad,
  Credit,
  Demand,
  Information,
  BusinessList,
  Business,
  MemberInfo,
  MemberList,
  AptDetail,
  Aptitude,
  UserInfoDetail,
  FinanceDetail,
  AssetsList,
  AssetsInfo,
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
