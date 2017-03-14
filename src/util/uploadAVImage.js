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
            uri: item.url,
            name: item.filename,
            type: "image/jpg",
            height: item.height,
            width: item.width,
        }
        body.append('file', file)
    })
    const url = "http://"+ "103.236.253.138:8088" + "/uploadImage"
   return  fetch(url, {
        method: 'POST',
        body,
    })

}