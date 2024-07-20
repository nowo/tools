import { createRouter, defineEventHandler, useBase } from 'h3'
import { setDeleteFile, setSaveFile } from '~~/server/controller/common'

const router = createRouter()

router.use('/file/upload', setSaveFile) // 文件上传保存
router.use('/file/delete', setDeleteFile) // 文件删除



/**
 * 获取用户权限菜单
 */
router.use('/auth', defineEventHandler(async (event) => {
    const list = [
        {
            // id: 1,
            name: 'index',
            path: '/',
            // icon: 'home',
            redirect: '/home',
            meta: {
                title: '首页',
                icon: 'i-ep-home-filled',
            },
            children: [
                {
                    name: '首页',
                    path: '/home',
                    meta: {
                        title: '首页',
                        icon: 'i-ep-home-filled',
                    },
                },
            ],
        },
        {
            path: '/system',
            name: 'system',
            meta: {
                layout: 'classic',
                title: '系统设置',
            },
            props: {
                default: false,
            },
            children: [
                {
                    path: '/system/info',
                    name: 'info',
                    meta: {
                        title: '系统信息',
                    },
                    props: {
                        default: false,
                    },
                },
            ],
            instances: {},
            leaveGuards: {},
            updateGuards: {},
            enterCallbacks: {},
            components: {},
        },
    ]

    return list
}))



export default useBase('/api/v1', router.handler)
