/**
 * 布局配置
 */
declare type GlobalComponentSize = 'large' | 'default' | 'small'
declare type LayoutConfig = 'default' | 'classic' | 'transverse' | 'columns' | 'basic'
// declare type LayoutConfig = 'default' | 'classic' | 'transverse' | 'columns' | LayoutKey
// type GreetParams = Parameters<typeof definePageMeta>
// declare type LayoutConfig = GreetParams[0]['layout']

declare type LayoutAnimation = 'slide-right' | 'slide-left' | 'opacity'
declare interface IThemeConfig {
    primary: string
    topBar: string
    topBarColor: string
    isTopBarColorGradual: boolean
    menuBar: string
    menuBarColor: string
    menuBarActiveColor: string
    isMenuBarColorGradual: boolean
    columnsMenuBar: string
    columnsMenuBarColor: string
    isColumnsMenuBarColorGradual: boolean
    isColumnsMenuHoverPreload: boolean
    isCollapse: boolean
    isUniqueOpened: boolean
    isFixedHeader: boolean
    isFixedHeaderChange: boolean
    isClassicSplitMenu: boolean
    isLockScreen: boolean
    lockScreenTime: number
    isShowLogo: boolean
    isShowLogoChange: boolean
    isBreadcrumb: boolean
    isBreadcrumbIcon: boolean
    isTagsView: boolean
    isTagsViewIcon: boolean
    isCacheTagsView: boolean
    isSortableTagsView: boolean
    isShareTagsView: boolean
    isFooter: boolean
    isGrayscale: boolean
    isInvert: boolean
    isIsDark: boolean
    isWatermark: boolean
    watermarkText: string
    tagsStyle: string
    animation: LayoutAnimation
    columnsAsideStyle: 'columns-round' | 'columns-card'
    columnsAsideLayout: 'columns-horizontal' | 'columns-vertical'
    layout: LayoutConfig
    isRequestRoutes: boolean
    globalTitle: string
    globalViceTitle: string
    globalViceTitleMsg: string
    globalI18n: string
    globalComponentSize: GlobalComponentSize
}
