import React from 'react';
import {Platform} from 'react-native';
import topView from 'rn-topview';
import ActionSheetAndroidContainer from './AndroidContainer';

let ActionSheetAndroid = {}

if (Platform.OS !== 'ios') {
    let instance;

    const saveInstance = (i) => {
        instance = i;
    };

    const onAnimationEnd = (visible) => {
        if (!visible) {
            topView.remove();
        }
    };

    ActionSheetAndroid = {
        showActionSheetWithOptions(config, callback) {
            topView.set(
                <ActionSheetAndroidContainer
                    visible
                    ref={saveInstance}
                    onAnimationEnd={onAnimationEnd}
                    config={config}
                    callback={callback}
                />,
            );
        },
        showShareActionSheetWithOptions(config: any) {
            topView.set(
                <ActionSheetAndroidContainer
                    visible
                    ref={saveInstance}
                    onAnimationEnd={onAnimationEnd}
                    config={config}
                    share
                />,
            );
        },
        close() {
            if (instance) {
                instance.close();
            }
        },
    };
}

export default ActionSheetAndroid;