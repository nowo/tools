export type ToolPreview
    = | 'gradient'
        | 'shadow'
        | 'radius'
        | 'noise'
        | 'clip'
        | 'keypad'
        | 'json'
        | 'regex'
        | 'selector'

export interface ToolItem {
    /** 路由 id / 唯一标识,如 'gradient' */
    id: string
    /** 两位编号,展示用 '01' */
    no: string
    /** mono 技术标签,如 'gradient'、'box-shadow' */
    slug: string
    /** 中文名 */
    name: string
    /** 一句话描述 */
    desc: string
    /** 磁贴预览类型 */
    preview: ToolPreview
    /** 内部路由(与外链二选一) */
    to?: string
    /** 外链地址(正则工具跳转独立站点) */
    href?: string
}

export const tools: ToolItem[] = [
    {
        id: 'gradient',
        no: '01',
        slug: 'gradient',
        name: '渐变生成',
        desc: '颜色 / 透明度线性、径向渐变,实时预览并复制 CSS。',
        preview: 'gradient',
        to: '/tool/gradient',
    },
    {
        id: 'box-shadow',
        no: '02',
        slug: 'box-shadow',
        name: '盒子阴影',
        desc: '偏移、模糊、扩散、颜色滑块调节,所见即所得。',
        preview: 'shadow',
        to: '/tool/box-shadow',
    },
    {
        id: 'border-radius',
        no: '03',
        slug: 'border-radius',
        name: '边框圆角',
        desc: '四角独立控制,生成不规则圆角形状。',
        preview: 'radius',
        to: '/tool/border-radius',
    },
    {
        id: 'noise',
        no: '04',
        slug: 'noise',
        name: '噪音 / 纹理',
        desc: 'SVG feTurbulence 生成颗粒噪点背景。',
        preview: 'noise',
        to: '/tool/noise',
    },
    {
        id: 'clip-path',
        no: '05',
        slug: 'clip-path',
        name: '剪贴路径',
        desc: '拖拽节点自定义多边形 clip-path 裁剪。',
        preview: 'clip',
        to: '/tool/clip-path',
    },
    {
        id: 'calc',
        no: '06',
        slug: 'calc',
        name: '科学计算器',
        desc: '三角 / 对数 / 幂 / 阶乘,精确运算,支持键盘与粘贴。',
        preview: 'keypad',
        to: '/tool/calc',
    },
    {
        id: 'json',
        no: '07',
        slug: 'json',
        name: 'JSON 生成器',
        desc: '按模板批量生成随机测试数据。',
        preview: 'json',
        to: '/tool/json',
    },
    {
        id: 'regex',
        no: '08',
        slug: 'regex',
        name: '正则可视化',
        desc: '正则表达式铁路图,跳转独立站点。',
        preview: 'regex',
        href: 'https://nowo.github.io/regex/',
    },
    {
        id: 'selector',
        no: '09',
        slug: 'selector',
        name: '选择器速查',
        desc: 'jQuery / CSS 选择器语法大全对照。',
        preview: 'selector',
        to: '/tool/selector',
    },
]
