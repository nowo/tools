import { ElMessage } from 'element-plus'
import type { FormInstance, TableColumnCtx, TableInstance } from 'element-plus'
import type { Ref } from 'vue'
import { ref } from 'vue'

// import { wait } from '@/utils/common'



/**
 * vue路由获取Param类型的参数   /goods/list/1
 * @param name 名称 （必须）
 * @param init 默认值
 * @returns
 */
export function useRouteParam<T = string>(name: string, init = '' as T) {
    const route = useRoute()
    return computed(() => (route.params as any)[name] as T ?? init)
}
/**
 * vue路由获取query参数（获取？后面的参数）   /goods/list?name=foo&price=10
 * @param name 名称 （必须）
 * @param init
 * @returns
 */
export function useRouteQuery<T = string>(name: string, init = '' as T) {
    const route = useRoute()
    // return computed({
    //     get: () => route.query[name] as T ?? init,
    //     set: () => { },
    // })
    return computed(() => route.query[name] as T ?? init)
}




type AutoLoadingResult = [
    <T>(requestPromise: Promise<T>) => Promise<T>,
    Ref<boolean>,
]

/* 在给run方法传入一个promise，会在promise执行前或执行后将loading状态设为true，在执行完成后设为false */
export function useLoadingSubmit(defaultLoading = false): AutoLoadingResult {
    const loading = ref(defaultLoading)

    async function run<T>(requestPromise: Promise<T>): Promise<T> {
        loading.value = true
        try {
            return await requestPromise
        } finally {
            loading.value = false
        }
    }

    return [run, loading]
}

/**
 * 验证el-form组件表单验证
 * @param formEl
 * @returns boolean true-验证通过，false-验证不通过
 */
export const useFormVerify = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
        ElMessage.error('未获取到对应的组件,formEl为空')
        return false
    }
    let isVerify = false
    await formEl.validate((valid, fields) => {
        if (valid) {
            isVerify = true
            // return true
        } else {
            console.warn(fields)
            const obj: any = fields
            const firstKey = Object.keys(obj)[0]
            if (firstKey) {
                const text = obj[firstKey][0].message
                ElMessage.error(text)
            }
            isVerify = false
            // return false
        }
    })
    return isVerify
}

/**
 * element-plus table组件合计方法
 * @param param 原有element-plus合计计算方法返回的参数
 * @param param.columns 原有element-plus合计计算方法返回的参数
 * @param param.data 原有element-plus合计计算方法返回的参数
 * @param option 合计的数据选项，需要合计的字段、保留小数位数、合计文字显示等等
 * @returns string[]
 */
export const useTableSummaries = <T = any>(param: {
    columns: TableColumnCtx<T>[]
    data: T[]
}, option: TableSummaryContent<T>) => {
    const { columns } = param
    const data = ref(param.data)
    const sums: string[] = []
    const num = option.countText?.[0] ?? 0
    const countText = option.countText?.[1] ?? '合计'
    columns.forEach((column, index) => {
        if (index === num) return sums[index] = countText

        const textArr = Object.keys(option.data)
        const key = column.property as keyof T
        if (textArr.includes(key as string)) {
            let count = 0
            if (option.data[key]?.text) {
                return sums[index] = option.data[key]?.text || ''
            } else if (option.data[key]?.value || Number(option.data[key]?.value) === 0) {
                count = Number(option.data[key]?.value) ?? 0
            } else {
                const values = data.value.map((item: any) => Number(item[key]))
                count = values.reduce((prev, curr) => {
                    const value = Number(curr)
                    return Number.isNaN(value) ? prev : prev + curr
                }, 0)
            }
            let num = option.precision ?? 2 // 默认保留两位小数
            if (typeof (option.data[key]?.precision) === 'number') num = option.data[key]?.precision ?? 0

            return sums[index] = `${count.toFixed(num)}`
        }
        return sums[index] = ''
    })
    return sums
}

/**
 * element-plus table组件缓存滚动位置不对的情况
 * @param tableRef table组件对象
 * @returns string[]
 */
export const useTableScrollbarLoad = async (tableRef?: TableInstance) => {
    if (!tableRef) return
    // const scrollBarRef = tableRef?.scrollBarRef
    // console.log(scrollBarRef)
    // scrollBarRef.handleScroll()
    // scrollBarRef.wrapRef.scrollLeft
    // scrollBarRef.update()
    // tableRef.value?.doLayout()

    function getTranslateValue(translateString: string) {
        const reg = /[1-9]\d*\.?\d*/g
        const matchArr = translateString.match(reg)
        if (!matchArr?.[0]) return 0

        return Number(matchArr?.[0]) * 0.01
    }

    // await wait(150)
    nextTick(() => {
        // 获取y轴滚动距离
        const vertical = tableRef.$el.querySelector('.el-scrollbar__bar.is-vertical')
        // console.log(vertical)
        // console.log(vertical.offsetHeight)
        // console.log(vertical.clientHeight)
        const y = vertical.querySelector('.el-scrollbar__thumb').style.transform
        // console.log('y :>> ', y);
        const translateY = getTranslateValue(y)

        const numY = translateY ? vertical.offsetHeight * translateY : 0

        // 获取x轴滚动距离
        const horizontal = tableRef.$el.querySelector('.el-scrollbar__bar.is-horizontal')
        // console.log(horizontal)
        // console.log('horizontal.offsetWidth :>> ', horizontal.offsetWidth)
        const x = horizontal.querySelector('.el-scrollbar__thumb').style.transform
        // console.log('x :>> ', x)
        const translateX = getTranslateValue(x)
        // console.log('translateX :>> ', translateX)

        const numX = translateX ? horizontal.offsetWidth * translateX : 0
        // console.log({
        //     left: numX,
        //     top: numY,
        // })
        tableRef.scrollTo({
            left: numX,
            top: numY,
        })
    })
}


export const showErrorPage = () => {
    throw createError({ statusCode: 404, message: '页面不存在' })
}
