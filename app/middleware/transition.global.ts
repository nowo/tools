export default defineNuxtRouteMiddleware((to, from) => {
    // console.log(to)

    // if (to.params.id === '1') {
    //     return abortNavigation()
    // }
    // // 在实际应用中，你可能不会将每个路由重定向到 `/`
    // // 但是在重定向之前检查 `to.path` 是很重要的，否则可能会导致无限重定向循环
    // if (to.path !== '/') {
    //     return navigateTo('/')
    // }
    // 在服务器端跳过中间件
    // if (import.meta.server) return
    // 客户端生效中间件
    // if (import.meta.client) {
    if (to.path.startsWith(appAdminPath)) {
        // admin页面使用slide-right过渡
        to.meta.pageTransition = { name: 'slide-right', mode: 'out-in' }
        // const token = useSessionStorage('token', '')
        const token = useCookie('token')
        // console.log(token.value)
        // console.log('to', to.path)
        if (!token.value && to.path !== '/admin/login') { // 没token，不在登录页的时候，转到登录页
            return navigateTo('/admin/login')
        } else if (token.value && to.path === '/admin/login') { // 有token，在登录页的时候，转到后台首页
            return navigateTo('/admin')
        } else {

            // const currentItem = menuList.value.find(item => item.path === to.path)
            // console.log(currentItem)
            // // if (!currentItem) return abortNavigation('无权访问')  // 阻止跳转

            // if (!currentItem) return navigateTo('/', { redirectCode: 301 })
            // return navigateTo('/admin')
        }
    }

    // }

    // if (!document.startViewTransition) { return }

    // // 禁用内置的Vue过渡效果
    // to.meta.pageTransition = false
    // to.meta.layoutTransition = false
})
