import type { RouteRecordNormalized } from '#vue-router'

/**
 * 系统信息
 * @methods getSystemInfo 获取系统信息
 * @methods setSystemUpdate 更新系统信息
 */
export const useAdminMenuState = () => {
    const route = useRoute()
    const routes = useRouter().getRoutes()
    const { isCurrentFullscreen } = useThemeState()
    // 后台页面路由列表
    const adminRoutes = computed(() => {
        const list = routes.filter((item) => {
            // console.log(item.path, 'startStr.startsWith(item.path) :>> ', item.path.startsWith(startStr));
            if (item.path.startsWith(appAdminPath) && !item?.meta?.isHide) {
                return true
            } else {
                return false
            }
        }).map((item) => { // 处理标题和排序字段
            item.meta.title = item.meta.title || item.name as string
            item.meta.sort = item.meta.sort || 0
            return item
        }).sort((a, b) => { // 排序
            return (a.meta?.sort || 0) - (b.meta?.sort || 0) // 从小到大排序
        })

        return list
    })

    const storageMenuList = useSessionStorage<string[]>('adminMenu', [])
    // storage数据处理，保证是数组
    if (Array.isArray(storageMenuList.value)) {
        storageMenuList.value = [...new Set(storageMenuList.value)]
        if (!storageMenuList.value.includes(appAdminPath)) {
            storageMenuList.value.unshift(appAdminPath)
        }
    } else {
        storageMenuList.value = [appAdminPath]
    }
    // 当前路由不存在是也加入进去
    if (adminRoutes.value.find(v => v.path === route.path) && !storageMenuList.value.includes(route.path)) {
        storageMenuList.value.push(route.path)
    }

    // 后台标签页菜单列表
    // const tagMenuList = ref<RouteRecordNormalized[]>([])
    const tagMenuList = computed(() => {
        // 按缓存里的顺序取得路由数据
        const list = Array.isArray(storageMenuList.value) ? storageMenuList.value : []
        const arr: RouteRecordNormalized[] = []
        list.forEach((item) => {
            const node = adminRoutes.value.find(v => v.path === item)
            if (node) arr.push(node)
        })
        return arr
    })

    /**
     * 更新标签页面菜单列表
     * @param row 当前触发的路由对象
     * @param type 1：添加，2：移除
     */
    const updateStoreMenuList = (row: RouteRecordNormalized, type: 1 | 2) => {
        // const index = tagMenuList.value.findIndex(v => v.path === row.path)
        const storageIndex = storageMenuList.value.findIndex(v => v === row.path)

        if (type === 2) { // 移除
            // if (index >= 0) tagMenuList.value.splice(index, 1)
            if (storageIndex >= 0) storageMenuList.value.splice(storageIndex, 1)
        } else {
            // if (index < 0) tagMenuList.value.push(row)
            if (storageIndex < 0) storageMenuList.value.push(row.path)
        }
        if (!storageMenuList.value.includes(route.path)) {
            if (storageIndex < storageMenuList.value.length - 1) {
                navigateTo(tagMenuList.value[storageIndex])
            } else {
                const node = tagMenuList.value[tagMenuList.value.length - 1]
                navigateTo(node)
            }
        }
    }

    const mainLoad = inject<() => void>('reload')

    /**
     * 设置标签页面菜单列表
     * @param type 1：刷新页面，2：关闭页面，3：关闭其他页面，4：全部关闭，5：当前页全屏
     * @param row 当前触发的路由对象
     */
    const setStoreMenuList = (type: 1 | 2 | 3 | 4 | 5, row: RouteRecordNormalized) => {
        if (!Array.isArray(storageMenuList.value)) storageMenuList.value = []
        const storageIndex = storageMenuList.value.findIndex(v => v === row.path)
        // 固定的标签数组
        const fixArr = tagMenuList.value.filter(item => item.meta?.isAffix).map(v => v.path)
        if (type === 1) { // 刷新
            // console.log(mainLoad)
            if (route.path === row.path) {
                mainLoad?.()
            } else {
                navigateTo(row)
            }
        } else if (type === 2) { // 关闭
            if (storageIndex >= 0) storageMenuList.value.splice(storageIndex, 1)
        } else if (type === 3) { // 关闭其他
            if (!fixArr.includes(row.path)) fixArr.push(row.path)
            storageMenuList.value = fixArr
            // 跳转至当前页
            navigateTo(row)
        } else if (type === 4) { // 全部关闭
            storageMenuList.value = fixArr
            // 跳转固定页或首页
            const node = tagMenuList.value[tagMenuList.value.length - 1]
            navigateTo(node)
        } else if (type === 5) { // 半全屏
            // 跳转至当前页
            navigateTo(row)
            isCurrentFullscreen.value = true
        }
    }

    return {
        tagMenuList,
        adminRoutes,
        storageMenuList,
        updateStoreMenuList,
        setStoreMenuList,
    }
}

/**
 * 检查用户是否拥有权限
 */
export function checkPermission(permissionName: PermissionType): boolean {
    const { userInfo } = useUserState()
    // console.log(userInfo)
    // 超级管理员，拥有所有权限
    if (userInfo.value?.id===1|| userInfo.value?.role === 1) return true
    const route = useRoute()
    const key = route.name as string

    const permission = JSON.parse(userInfo.value?.permission ?? '[]') as { name: string, permission: PermissionType[] }[]
    const permissionNode = permission.find(i => i.name === key)
    const list = permissionNode?.permission ?? []
    // 检查用户是否拥有权限的逻辑
    return list.includes(permissionName)
}
