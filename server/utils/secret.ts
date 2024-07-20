import crypto from 'node:crypto'
import type { H3Event } from 'h3'
// import * as jose from 'jose'
import jwt from 'jsonwebtoken'
import { setSignRule } from '~/utils/secret'

// // 生成token
// export const createToken = async (data: Record<string, any>) => {
//     const secret = new TextEncoder().encode('cc7e0d44fd473002')
//     const token = await new jose.SignJWT(data)
//         .setProtectedHeader({ alg: 'HS256' })
//         .sign(secret)
//     return token
// }

// // 解析token
// export const verifyToken = async <T>(token: string) => {
//     try {
//         const secret = new TextEncoder().encode('cc7e0d44fd473002')
//         const { payload } = await jose.jwtVerify<T>(token, secret)
//         return payload
//     } catch (error) {
//         return false
//     }
// }


// 生成token
export const createToken = (data: Record<string, any>) => {
    const token = jwt.sign(data, 'cc7e0d44fd473002',
        // {
        //     expiresIn: app.config.jwt.sign.expiresIn,
        // },
    )
    return token
}

// 解析token
export const verifyToken = <T>(token: string) => {
    try {
        const data = jwt.verify(token, 'cc7e0d44fd473002') as T
        return data
    } catch (error) {
        return false
    }
}


/**
 * 创建哈希值
 * @param text 要加密的文本
 * @param type 加密类型，可选值为 'md5'、'sha256'、'sha512',默认使用MD5
 * @returns 加密后的哈希值
 */
function createHash(text: any, type: 'md5' | 'sha256' | 'sha512' = 'md5') {
    const hash = crypto.createHash(type).update(text).digest('hex')
    return hash
}

/**
 * 密码设置
 */

/**
 * 用户密码设置加密，加密规则：md5加密两次（第二次加密取前8位后拼接`??`再进行加密）
 * @param password 用户明文密码
 * @returns string  加密后的密码字符串
 * @example
 * ```javascript
 * setEncryptPassword('123456')    // 0eb948223412170b50de9bb356d39e2b
 * ```
 */
export const setEncryptPassword = (password: string) => {
    const s = createHash(password, 'md5')
    // 取得前面8个字符在加密,拼接??
    const s2 = createHash(`${s.substring(0, 8)}??`, 'md5')
    return s2
}

/**
 * 签名验证
 * @param event defineEventHandler方法里的event参数
 * @returns Promise<{ sign, time } | undefined>
 */
export const useVerifySign =  (event: H3Event) => {
    const headers = getHeaders(event)
    // 获取请求头里的x-sign
    const signTimestamp = headers['x-sign']

    if (!signTimestamp) {
        // // 请求头没有x-sign时，获取params或body里的sign参数
        // const signParams = await getEventParams<{ sign: string }>(event)
        // if (!signParams?.sign) return undefined
        // signTimestamp = signParams.sign
        return undefined
    }

    const [sign, time] = signTimestamp.split('-')

    // 判断时间戳是否在1.5分钟内
    if (new Date().getTime() - Number(time) > 1.5 * 60 * 1000) return undefined

    if (sign === setSignRule(time)) {
        return { sign, time }
    } else {
        return undefined
    }
}

/**
 * token验证，用户登陆验证
 * @param event defineEventHandler方法里的event参数
 * @returns boolean | 用户信息
 */
export const useVerifyToken = (event: H3Event) => {
    // const headers = getHeaders(event)
    // // 获取请求头里的token
    // const token = headers['x-token']
    const token = getCookie(event, 'token')
    if (!token) return false
    return verifyToken<ILoginUserInfo>(token)
}
