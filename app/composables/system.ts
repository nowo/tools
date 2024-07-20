// import type { Admin, Prisma } from "@prisma/client"
// import { filterTreeList,findTreeNodeItem } from '@cooj/utils'
/**
 * 设置用户登录信息，token相关
 * @returns user information
 */
export function useUserState() {
    // const token = useState<string>('token', () => {
    //     return process.client ? useSessionStorage('token', '') : ''
    // })
    const token = useCookie('token')

    const userInfo = useState<any>('userInfo', () => ({}))

    const setToken = (token: string) => {
        useSessionStorage('token', token)
        userInfo.value = {}
    }

    // 设置用户信息
    const setUserInfo = async () => {
        const res = await useServerFetch('/api/v1/user/info')
        if (res.code === 200) {
            userInfo.value = res.data
        } else {
            userInfo.value = {}
        }
    }

    return {
        token,
        userInfo,
        setToken,
        setUserInfo
    }
}

/**
 * 系统信息
 * @methods getSystemInfo 获取系统信息
 * @methods setSystemUpdate 更新系统信息
 */
export const useSystemState = async () => {
    const systemInfo = ref<ISystemInfoData>()
    if (!systemInfo.value) {
        const { data: info, error, status } = await useCustomFetch<ISystemInfoData>('/api/v1/system/info')
        // console.log(info, error, status)
        if (info.value?.code === 200) {
            systemInfo.value = info.value?.data
            // console.log(info.value?.data)
        }
    }
    // 获取系统信息
    const getSystemInfo = async () => {
        const res = await useServerFetch('/api/v1/system/info')
        if (res.code !== 200) {
            ElMessage.error(res.msg)
        } else {
            systemInfo.value = res.data
        }
        return systemInfo
    }

    // 更新系统信息
    const setSystemUpdate = async (data: ISystemEditParams) => {
        const res = await useServerFetch('/api/v1/system/edit', { method: 'post', body: data })
        if (res.code !== 200) {
            ElMessage.error(res.msg)
            return false
        } else {
            getSystemInfo()
            return true
        }
    }

    return {
        systemInfo,
        getSystemInfo,
        setSystemUpdate,
    }
}


export const useMenuState = async () => {
    const route = useRoute()
    const allList = useState<IMenuListItem[]>('allMenu', () => [])
    const menuList = useState<IMenuListItem[]>('menu', () => [])

    if (!allList.value.length) {
        const { data: info, error, status } = await useCustomFetch<{ list: IMenuListItem[] }>('/api/v1/page/menu')
        // console.log(info, error, status)
        if (info.value?.code === 200) {
            allList.value = info.value?.data.list
            // console.log(info.value?.data.list)
            menuList.value = filterTreeList(info.value?.data.list, 1, 'status', 'children')
        }
    }

    const getMenuList = async (update?: boolean) => {
        if (menuList.value.length) return menuList
        const { data, error } = await useCustomFetch<IMenuListItem[]>('/api/v1/page/menu', {
            method: 'post',
            body: {
                status: 1,
            },
        })

        // 接口发生错误时
        if (error.value) return menuList
        // await wait(800)
        if (data.value?.code === 200) {
            allList.value = data.value?.data
            // menuList.value =[]
            menuList.value = filterTreeList(data.value?.data, 1, 'status', 'children')
        } else {
            ElMessage.error('网络错误')
        }
        return menuList
    }

    // 一级菜单内容
    const activeMenu = computed<IMenuListItem | undefined>(() => {
        // [id].vue 的文件，不能直接拿route.path来进行比较
        const path = route.matched?.[0]?.path?.split('/:')[0] || ''

        let url = ''

        const strArr = path.split('/')
        if (path === '/' || path === '/en') {
            url = '/'
        } else if (path.startsWith('/en')) {
            if (strArr[2]) url = `/${strArr[2]}`
        } else {
            if (strArr[1]) url = `/${strArr[1]}`
        }

        // console.log(url) // 输出结果

        return allList.value.find(item => item.href === url || `/en${item.href}` === url)

        // return menuList.value.find(item => item.href === url)
    })

    // 当前页菜单内容
    const nowMenu = computed<IMenuListItem | undefined>(() => {
        // [id].vue 的文件，不能直接拿route.path来进行比较
        const path = route.matched?.[0]?.path.split('/:')[0]||''
        // return []
        return findTreeNodeItem(allList.value, path, 'href', 'children')
    })

    return {
        nowMenu,
        activeMenu,
        allList,
        menuList,
        getMenuList,
    }
}
