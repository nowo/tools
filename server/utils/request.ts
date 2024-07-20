import type { H3Event } from 'h3'

// type $FetchType = typeof $fetch
// export type ReqOptions = Parameters<$FetchType>[1]
// // (...args: Parameters<typeof $fetch>)
// /**
//  * 服务器端请求接口,默认请求头增加sign处理
//  * @param url
//  * @param options
//  * @returns $fetch
//  */
// export async function useServerFetch<T = any>(url: NitroFetchRequest, options: ReqOptions = {}) {

//     const time = Date.now().toString()
//     const sign = setSignRule(time)

//     const defaults: ReqOptions = {
//         // baseURL: config.public.apiBase ?? 'https://api.nuxtjs.dev',
//         // cache request
//         // key: url as string,

//         // set user token if connected
//         headers: {
//             'x-sign': `${sign}-${time}`,
//         },

//         // onResponse(_ctx) {
//         //     // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
//         // },

//         // onResponseError(_ctx) {
//         //     // throw new myBusinessError()
//         // },
//     }

//     // for nice deep defaults, please use unjs/defu
//     const params = defu(options, defaults)

//     return $fetch<T>(url, params)
// }

/**
 * 获取接口参数方法，整合get、post请求类型统一获取参数
 * @param event defineEventHandler方法里的event参数
 * @returns T
 */
export const getEventParams = async <T = any>(event: H3Event) => {
    const method = event.method

    const contentType = getHeader(event, 'content-type')

    // let param: any = {}
    let param: any = {}

    // 判断是否为formData类型的参数
    if (contentType?.includes('multipart/form-data')) {
        const formData = (await readMultipartFormData(event)) || []
        formData.forEach((item) => {
            if (item.type) {
                param[item.name!] = item
            } else {
                param[item.name!] = Buffer.from(item.data).toString() // eslint-disable-line node/prefer-global/buffer
            }
        })
    } else if (method === 'GET') {
        param = getQuery(event) as unknown as T
    } else {
        param = await readBody<T>(event)
    }

    // const query = getQuery(event) as unknown as T
    // const body = await readBody<T>(event)
    // const param = method === 'GET' ? query : body

    return param as T | undefined
}
