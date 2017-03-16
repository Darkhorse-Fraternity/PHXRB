// import variables from '../../style/themes/default';
import { StyleSheet } from 'react-native';

// export const vars = variables;

export default StyleSheet.create({
    container: {
        zIndex: 1000,
    },
    wrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    content: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
    },
    mask: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, .4)',
    },
    title: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15,
    },
    titleText: {
        fontWeight: '500',
    },
    message: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        marginBottom: 15,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: 'white',
    },
    cancelBtn: {
        marginTop: 9,
        position: 'relative',
    },
    cancelBtnMask: {
        position: 'absolute',
        top: -9,
        left: 0,
        right: 0,
        height: 9,
        backgroundColor: '#F7F7F7',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    destructiveBtn: {
        color: '#f4333c',
        fontSize: 17,
    },
});