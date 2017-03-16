/**
 * Created by lintong on 2017/2/13.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {renderNavRightButton} from '../../util/viewUtil'
import {refresh, pop} from '../../redux/nav'
//static displayName = AptDetail
import {ImagePicker, Button} from 'antd-mobile';

import {phxr_deal_files, phxr_query_files_list} from '../../request/qzapi'
import {Toast} from '../../util'
import {uploadPHXRImage} from '../../util/uploadAVImage'
import {send} from '../../request'
import {ActionSheet} from 'antd-mobile';
import {documentaryFiles} from '../../configure/phxr'
import {listLoad, listLoadMore} from '../../redux/actions/list'
import {deepFontColor, backViewColor, blackFontColor, mainColor} from '../../configure'
import {request} from '../../redux/actions/req'
import ImageSelectView from '../../components/ImageSelectView'
import LoadToast from '../../components/Pop/LoadToast'
// import {showSelector} from '../../components/Selector'
import ActionSheetAndroid  from '../../components/ActionSheetLoacal'
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
        upload: async(files, fileName)=> {
            dispatch(async(dispatch, getState)=> {
                try {
                    const res = await uploadPHXRImage(files)
                    const data = await res.text()
                    if (res) {
                        const userID = getState().login.data.userId
                        const params = phxr_deal_files(userID, '1', fileName, undefined, "0",
                            "文件类型描述", data, userID)
                        // console.log('test:', params);
                        LoadToast.show("文件上传中")
                        // console.log('test:', LoadToast);
                        const res = await send(params)

                        if (res.rspCode == '0000') {
                            const params = phxr_query_files_list(userID)
                            dispatch(listLoad("fiels_listKey", params))
                            Toast.show("提交成功")
                            LoadToast.hide()
                            pop()
                        }
                    }
                } catch (e) {
                    Toast.show(e.message)
                }


            })

        }
    })
)
export  default  class AptDetail extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            files: [],
            fileName: "",
            fileNameShow: "",
        }
    }


    static propTypes = {};
    static defaultProps = {};


    onChange(files) {
        // if(this.state.files.length ==)
        this.setState({
            files,
        });
    }


    // shouldComponentUpdate(nextProps: Object) {
    //     return !immutable.is(this.props.data, nextProps.data)
    // }

    __tapRight = ()=> {
        if (this.state.files.length == 0) {
            Toast.show("图片不能为空")
            return
        }

        if (this.state.fileName.length == 0) {
            Toast.show("文件类型不能为空")
            return
        }


        this.props.upload(this.state.files, this.state.fileName);
        // pop()
    }

    componentDidMount() {

        const rightBtn = renderNavRightButton('保存', this.__tapRight)
        refresh({
            renderRightComponent: rightBtn,
            rightButtonDisabled: false,
            rightButtonIsLoad: false
        });
    }


    showActionSheet(message: string, op: any) {
        const wrapProps = {onTouchStart: e => e.preventDefault()}
        const BUTTONS = op.concat('取消')

        const Action = Platform.OS == 'ios' ? ActionSheet : ActionSheetAndroid

        Action.showActionSheetWithOptions({
                options: BUTTONS,
                // title: '标题',
                cancelButtonIndex: BUTTONS.length - 1,
                message,
                maskClosable: true,
                'data-seed': 'logId',
                wrapProps,
            },
            (buttonIndex) => {
                if (buttonIndex != BUTTONS.length - 1) {
                    const key = Object.keys(documentaryFiles)
                    this.setState({fileNameShow: BUTTONS[buttonIndex], fileName: key[buttonIndex]});
                }

            });


    }

    __renderInputRow(): ReactElement<any> {
        return (
            <View style={styles.row}>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder="请输入资料名称"
                    //keyboardType='numeric'
                    underlineColorAndroid='transparent'
                    clearButtonMode='while-editing'
                    enablesReturnKeyAutomatically={true}
                    onSubmitEditing={() => {}}
                    onChangeText={(fileName)=>{this.setState({fileName})}}
                />
            </View>
        )
    }


    _renderRow(title: string, dex: string, onPress: Function) {
        return (
            <TouchableOpacity onPress={()=>onPress(title)}>
                <View style={styles.rowx}>
                    <Text style={[styles.rowText,{marginRight:15}]}>
                        {title}
                    </Text>
                    <View style={styles.row2}>
                        <Text style={styles.dex}>{dex}</Text>
                        <View style={styles.arrowView}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render(): ReactElement<any> {
        const {files} = this.state;
        const names = Object.values(documentaryFiles)
        return (
            <View style={[this.props.style,styles.wrap]}>
                {/*{this.__renderInputRow()}*/}
                {this._renderRow("选择文件类型", this.state.fileNameShow, (title)=> {
                    this.showActionSheet(title, names)
                })}
                {/*<ImagePicker*/}
                {/*files={files}*/}
                {/*onChange={this.onChange.bind(this)}*/}
                {/*onImageClick={(index, fs) => console.log(index, fs)}*/}
                {/*onAddImageClick={this.onAddImageClick.bind(this)}*/}
                {/*selectable={files.length < 2}*/}
                {/*/>*/}
                ImageSelectView
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        padding: 15,
    },
    row: {
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    textInputStyle: {
        // width:200,
        flex: 1,
        marginLeft: 10,
        textAlign: 'left',
        fontSize: 14,
        color: 'black',

    },
    rowx: {
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,

    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowText: {
        fontSize: 14,
        // fontWeight: '500',
        color: blackFontColor,
    },
    arrowView: {
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderRightWidth: StyleSheet.hairlineWidth * 2,
        borderColor: '#8c8c85',
        transform: [{rotate: '315deg'}],
        marginLeft: 5,
        width: 10,
        height: 10,
    },
})
