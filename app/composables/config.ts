// 主题配置
export function useThemeState() {
    const config: IThemeConfig = {

        /**
         * 全局主题
         */
        // 默认 primary 主题颜色
        primary: '#409eff',
        // 是否开启深色模式
        isIsDark: false,

        /**
         * 顶栏设置
         */
        // 默认顶栏导航背景颜色
        topBar: '#ffffff',
        // 默认顶栏导航字体颜色
        topBarColor: '#606266',
        // 是否开启顶栏背景颜色渐变
        isTopBarColorGradual: false,

        /**
         * 菜单设置
         */
        // 默认菜单导航背景颜色
        menuBar: '#545c64',
        // 默认菜单导航字体颜色
        menuBarColor: '#eaeaea',
        // 默认菜单高亮背景色
        menuBarActiveColor: 'rgba(0, 0, 0, 0.2)',
        // 是否开启菜单背景颜色渐变
        isMenuBarColorGradual: false,

        /**
         * 分栏设置
         */
        // 默认分栏菜单背景颜色
        columnsMenuBar: '#2f2f2f',
        // 默认分栏菜单字体颜色
        columnsMenuBarColor: '#e6e6e6',
        // 是否开启分栏菜单背景颜色渐变
        isColumnsMenuBarColorGradual: false,
        // 是否开启分栏菜单鼠标悬停预加载(预览菜单)
        isColumnsMenuHoverPreload: false,

        /**
         * 界面设置
         */
        // 是否开启菜单水平折叠效果
        isCollapse: false,
        // 是否开启菜单手风琴效果
        isUniqueOpened: true,
        // 是否开启固定 Header
        isFixedHeader: true,
        // 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
        isFixedHeaderChange: false,
        // 是否开启经典布局分割菜单（仅经典布局生效）
        isClassicSplitMenu: false,
        // 是否开启自动锁屏
        isLockScreen: false,
        // 开启自动锁屏倒计时(s/秒)
        lockScreenTime: 30,

        /**
         * 界面显示
         */
        // 是否开启侧边栏 Logo
        isShowLogo: false,
        // 初始化变量，用于 el-scrollbar 的高度更新，请勿删除
        isShowLogoChange: false,
        // 是否开启 Breadcrumb，强制经典、横向布局不显示
        isBreadcrumb: true,
        // 是否开启 Breadcrumb 图标
        isBreadcrumbIcon: false,

        // 是否开启 TagsView
        isTagsView: true,
        // 是否开启 TagsView 图标
        isTagsViewIcon: false,
        // 是否开启 TagsView 缓存
        isCacheTagsView: false,
        // 是否开启 TagsView 拖拽
        isSortableTagsView: true,
        // 是否开启 TagsView 共用
        isShareTagsView: false,
        // 是否开启 Footer 底部版权信息
        isFooter: false,
        // 是否开启灰色模式
        isGrayscale: false,
        // 是否开启色弱模式
        isInvert: false,
        // 是否开启水印
        isWatermark: false,
        // 水印文案
        watermarkText: '水印文字',

        /**
         * 其它设置
         */
        // Tagsview 风格：可选值"<tags-style-one|tags-style-four|tags-style-five>"，默认 tags-style-five
        // 定义的值与 `/src/layout/navBars/tagsView/tagsView.vue` 中的 class 同名
        tagsStyle: 'tags-style-five',
        // 主页面切换动画：可选值"<slide-right|slide-left|opacity>"，默认 slide-right
        animation: 'slide-right',
        // 分栏高亮风格：可选值"<columns-round|columns-card>"，默认 columns-round
        columnsAsideStyle: 'columns-card',
        // 分栏布局风格：可选值"<columns-horizontal|columns-vertical>"，默认 columns-horizontal
        columnsAsideLayout: 'columns-vertical',

        /**
         * 布局切换
         * 注意：为了演示，切换布局时，颜色会被还原成默认，代码位置：/@/layout/navBars/topBar/setings.vue
         * 中的 `initSetLayoutChange(设置布局切换，重置主题样式)` 方法
         */
        // 布局切换：可选值"<defaults|classic|transverse|columns>"，默认 defaults
        // layout: 'classic',
        layout: 'basic',

        /**
         * 后端控制路由
         */
        // 是否开启后端控制路由
        isRequestRoutes: false,

        /**
         * 全局网站标题 / 副标题
         */
        // 网站主标题（菜单导航、浏览器当前网页标题）
        globalTitle: 'vue-admin',
        // 网站副标题（登录页顶部文字）
        globalViceTitle: '后台管理系统',
        // 网站副标题（登录页顶部文字）
        globalViceTitleMsg: '专注、免费、开源、维护、解疑',
        // 默认初始语言，可选值"<zh-cn|en|zh-tw>"，默认 zh-cn
        globalI18n: 'zh-cn',
        // 默认全局组件大小，可选值"<large|'default'|small>"，默认 'large'
        globalComponentSize: 'default',
    }

    const themeConfig = useState<IThemeConfig>('themeConfig', () => config)

    // 是否打开布局配置弹窗
    const isDrawer = useState('isDrawer', () => false)
    // 是否当前页半全屏状态
    const isCurrentFullscreen = useState('isCurrentFullscreen', () => false)

    /**
     * 设置布局，更新状态
     * @param value {IThemeConfig} 值
     */
    const setThemeConfig = (value: IThemeConfig) => {
        themeConfig.value = value
    }

    /**
     * 保存布局配置到缓存中
     * @param value
     */
    const saveThemeConfig = (value: IThemeConfig) => {
        useLocalStorage<IThemeConfig>('themeConfig', value || themeConfig.value)
    }

    return {
        themeConfig,
        isDrawer,
        isCurrentFullscreen,
        setThemeConfig,
        saveThemeConfig,
    }
}
