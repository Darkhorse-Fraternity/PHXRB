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
    TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {renderNavRightButton} from '../../util/viewUtil'
import {refresh, pop} from '../../redux/nav'
//static displayName = AptDetail
import {ImagePicker, Button} from 'antd-mobile';


const data = [{
    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
    id: '2121',
}, {
    url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
    id: '2122',
}];

@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class AptDetail extends Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            files: data,
        }
    }


    static propTypes = {};
    static defaultProps = {};


    onChange(files, type, index) {
        console.log(files, type, index);
        this.setState({
            files,
        });
    }

    onAddImageClick() {
        this.setState({
            files: this.state.files.concat({
                url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
                id: '3',
            }),
        });
    }


    // shouldComponentUpdate(nextProps: Object) {
    //     return !immutable.is(this.props.data, nextProps.data)
    // }

    __tapRight() {
        pop()
    }

    componentDidMount() {

        const rightBtn = renderNavRightButton('保存', this.__tapRight)
        refresh({
            renderRightComponent: rightBtn,
            rightButtonDisabled: false,
            rightButtonIsLoad: false
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
                />
            </View>
        )
    }

    render(): ReactElement<any> {
        const {files} = this.state;
        return (
            <View style={[this.props.style,styles.wrap]}>
                {this.__renderInputRow()}
                <ImagePicker
                    files={files}
                    onChange={this.onChange.bind(this)}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    onAddImageClick={this.onAddImageClick.bind(this)}
                    selectable={files.length < 5}
                />
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
        marginTop:10,
        flexDirection:'row',
        backgroundColor:'white',
        height:40,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20,
    },
    textInputStyle: {
        // width:200,
        flex:1,
        marginLeft:10,
        textAlign: 'left',
        fontSize: 14,
        color: 'black',

    },
})