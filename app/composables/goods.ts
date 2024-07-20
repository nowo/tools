// 获取商品分类
export const useGoodsClassifyState = async () => {
    // const route = useRoute()
    const classifyList = useState<IClassifyListResponse[]>('classifyList', () => [])

    if (!classifyList.value.length) {
        const { data: info, error } = await useCustomFetch<{ list: IClassifyListResponse[] }>('/api/v1/page/classify', {
            method: 'post',
            body: {
                // isP
                // type: 1,
            },
        })

        if (info.value?.code === 200) {
            classifyList.value = info.value?.data.list
        }
    }

    const getClassify = async (update?: boolean) => {
        if (!update && classifyList.value.length) return classifyList
        const { data, error } = await useCustomFetch<{ list: IClassifyListResponse[] }>('/api/v1/page/classify', {
            method: 'post',
            body: {
                // isP
                // type: 1,
            },
        })

        // 接口发生错误时
        if (error.value) return classifyList
        // await wait(800)
        if (data.value?.code === 200) {
            classifyList.value = data.value.data.list
        } else {
            ElMessage.error('网络错误')
        }
        return classifyList
    }

    return {
        classifyList,
        getClassify,
    }
}



/**
 * 进入商品页面方法
 */
export const linkGoodsList = (params: GoodsListParams, url?: string) => {
    url = url || '/product'
    const route = useRoute()
    const query = route.query as GoodsListParamsQuery

    const data = params.query
    if (params.relate) { // 获取
        // keyword不存在params对象里面时,并且路由里面存在keyword字段时
        if (!('keyword' in params.query) && 'keyword' in query) data.page = query.page

        // c不存在params对象里面时,并且路由里面存在数字类型cid时
        if (!('cid' in params.query) && !Number.isNaN(Number(query.cid))) {
            data.cid = Number(query.cid)
        }

        // c不存在params对象里面时,并且路由里面存在数字类型cid时
        // if (!('bid' in params.query) && 'bid' in query) data.bid = query.bid
    }

    // 返回地址的形式, /goods/list?cid=1
    if (params.url) {
        const list = Object.keys(data).map(i => `${i}=${encodeURIComponent(data[i as keyof GoodsListParamsQuery] || '')}`)
        return list.length > 0 ? `${url}?${list.join('&')}` : url
    } else {
        navigateTo({
            path: url,
            query: data as any,
            // replace: true,
        })
        return ''
    }

    // return navigateTo({
    //   path: '/goods/list',
    //   query: {
    //     page: 1,
    //     sort: 'asc',
    //   },
    // })
}
