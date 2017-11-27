/*!
 *
 * https://leancloud.cn/docs/leanstorage_guide-js.html#从本地路径构建文件
 * 上传image 到leanCloud
 * @flow
 */

'use strict';

import {defaultHost} from '../configure'

export function uploadPHXRImage(files) {
    const body = new FormData()
    files.map((item)=> {
        const file = {
            uri: item.uri,
            name: item.filename||( Math.random()*700 + Date.parse(new Date()) + "_IMG.JPG"),
            type: "image/jpg",
        }
        body.append('file', file)
    })
    const url = "http://"+ "103.236.253.138:8088" + "/uploadImage"
   return  fetch(url, {
        method: 'POST',
        body,
    })

}


export function uploadImage(url,files) {
    const body = new FormData()
    files.map((item)=> {
        const file = {
            uri: item.uri,
            name: item.filename||( Math.random()*700 + Date.parse(new Date()) + "_IMG.JPG"),
            type: "image/jpg",
        }
        body.append('file', file)
    })
    // const url = "http://"+ "103.236.253.138:8088" + "/uploadImage"
    return  fetch(url, {
        method: 'POST',
        body,
    })

}