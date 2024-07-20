import { defu } from 'defu'
import type { UseFetchOptions } from 'nuxt/app'
import type { NitroFetchRequest } from 'nitropack'

interface ResponseDataType<T> {
    code: number
    data: T
    msg: string
}

/**
 * useFetch二次封装，增加token和签名
 * @param url   请求地址
 * @param options   请求配置
 * @returns useFetch
 */
export async function useCustomFetch<T=any>(url: NitroFetchRequest, options: UseFetchOptions<ResponseDataType<T>> = {}) {
    const time = Date.now().toString()
    const sign = setSignRule(time)
    const headers: HeadersInit = { 'x-sign': `${sign}-${time}` }

    // cookie会自动发送到后端，所以这里不传token也可以
    // const token = useCookie('token')
    // if (token.value) headers.Authorization = `Bearer ${token.value}`

    const defaults: UseFetchOptions<ResponseDataType<T>> = {
        // cache request
        key: url as string,
        // set user token if connected
        headers,
        onResponse(_ctx) {
            // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
        },
        onResponseError(_ctx) {
            // throw new myBusinessError()
        },
    }

    // for nice deep defaults, please use unjs/defu
    const params = defu(options, defaults)

    return useFetch<ResponseDataType<T>>(url, params)
}

/**
 * $fetch二次封装，增加token和签名
 * @param arg $fetch $fetch(url, options)的参数
 * @returns $fetch
 */
export async function useServerFetch<T = any>(...arg: Parameters<typeof $fetch>) {
    const [url, options] = arg
    const time = Date.now().toString()
    const sign = setSignRule(time)

    const defaults: typeof options = {
        // baseURL: config.public.apiBase ?? 'https://api.nuxtjs.dev',
        // cache request
        // key: url as string,

        // set user token if connected
        headers: {
            'x-sign': `${sign}-${time}`,
        },
        // onResponse(_ctx) {
        //     // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
        // },
        // onResponseError(_ctx) {
        //     // throw new myBusinessError()
        // },
    }

    // for nice deep defaults, please use unjs/defu
    const params = defu(options, defaults)

    return $fetch<ResponseDataType<T>>(url, params)
}
