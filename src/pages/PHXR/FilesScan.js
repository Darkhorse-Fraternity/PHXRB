/**
 * Created by lintong on 2017/3/14.
 * @flow
 */
'use strict';

import * as immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import FitImage from 'react-native-fit-image';
import {bindActionCreators} from 'redux';

//static displayName = FilesScan
@connect(
    state =>({
        //state:state.util.get()
    }),
    dispatch =>({
        //...bindActionCreators({},dispatch),
    })
)
export  default  class FilesScan extends Component {
    constructor(props: Object) {
        super(props);
    }

    static propTypes = {};
    static defaultProps = {};

    shouldComponentUpdate(nextProps: Object) {
        return !immutable.is(this.props, nextProps)
    }

    render(): ReactElement<any> {
        return (
            <ScrollView style={[this.props.style,styles.wrap]}>
                <FitImage style={styles.image} source={{uri:this.props.scene.route.url}}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    image:{
        marginTop:20,
        flex:1,
    }
})
