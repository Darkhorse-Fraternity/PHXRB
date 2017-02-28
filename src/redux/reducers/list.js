/**
 * Created by lintong on 10/19/16.
 * @flow
 */
'use strict';
import {
    LIST_START,
    LIST_FAILED,
    LIST_SUCCEED,
    LIST_SELECT
} from '../actions/list'

import * as immutable from 'immutable';
const initialState = immutable.fromJS({});

export default function listState(state: immutable.Map<string,any> = initialState, action: Object) {
    switch (action.type) {

        case LIST_FAILED:
        case LIST_START:{
            if(action.loadStatu == "LIST_FIRST_JOIN"){
                return state.set(action.key,immutable.fromJS({
                    loadStatu:action.loadStatu,
                    page:0,
                    listData:{},
                }));
            }
            return state.setIn([action.key, 'loadStatu'], action.loadStatu);
        }

        case LIST_SUCCEED:{

            return   state.updateIn([action.key],(oldObj)=>{

                const listData = {
                    loadStatu:action.loadStatu,
                    page:action.page,
                    listData:action.data,
                }
                return immutable.fromJS(listData)
            })
        }

        case LIST_SELECT:
            return state.setIn([action.key, 'index'], action.index);
        default:
            return state;
    }
}

