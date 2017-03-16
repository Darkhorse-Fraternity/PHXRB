/**
 * Created by lintong on 2017/2/25.
 * @flow
 */
'use strict';

import React from 'react';
import topView from 'rn-topview';
import PopContainer from './PopContainer';
import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native'

let popupInstance;

const styles = StyleSheet.create({

    wrap: {
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        backgroundColor:"rgba(0,0,0,0.2)",
        alignItems:'center',
        justifyContent:'center',
    },
    text: {
        fontSize: 14,
        color: 'white',
        marginTop:20,
        fontWeight:'500'
    },
})

export default {
    show(text, options = {
        animationType: 'fade',
        maskClosable: false,
        onMaskClose() {
        },
    }) {
        topView.set(
            <PopContainer
                ref={i => popupInstance = i}
                animationType={options.animationType}
                maskClosable={options.maskClosable}
                onMaskClose={options.onMaskClose}
                onAnimationEnd={visible => { if (!visible) { topView.remove(); } }}
                visible
            >
                <View style={styles.wrap}>
                    <ActivityIndicator color="white" size="large"/>
                    <Text style={styles.text}>{text}</Text>
                </View>
            </PopContainer>,
        );
    },
    hide() {
        if (popupInstance) {
            popupInstance.hide();
        }
    },
};

