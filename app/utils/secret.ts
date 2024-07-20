// import * as jose from 'jose'

// 前后端共用签名加密方式   //////////////////////////////////
/**
 * 签名加密 加密规则： 使用字符串中的数字转
 * @param {string} str 用于混入密钥的字符串（一般用时间戳）
 * @returns 加密后的字符串
 * @example
 * ```javascript
 * setSignRule(new Date().getTime().toString())    // 50m1mr0k7505976d
 * ```
 */
export const setSignRule = (str: string|number) => {

    // 去除非数字字符
    let numStr = str.toString().replace(/\D+/g, '').trim()
    // 控制数字长度在13位（避免转数字类型时精度丢失），
    let numStr2 = numStr.padEnd(13, '5').slice(0, 13)

    // 将字符串反转（时间戳前面部分是同样的，进行反转能减少相似），然后转成数字类型
    let num = Number(numStr2.split('').reverse().join(''))

    //    加密，使用数字对应的32进制+16进制
    let s = `${num.toString(32)}${num.toString(16)}`
    // console.log('s :>> ', s);
    // console.log('s00 :>> ', s.substring(0, 16));
    // 返回一个16位数的字符串
    return s.substring(0, 16)
}
