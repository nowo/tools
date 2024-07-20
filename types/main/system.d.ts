declare interface ILoginUserInfo {
    id: number // 用户id
    username: string // 用户名
    account: string // 昵称
}
declare interface ISystemInfoData {
    company: string // 公司名称
    logo: string // logo
    email: string // 邮箱
    phone: string // 联系电话
    address: string // 地址
    title: string // 标题
    keyword: string // 关键字
    description: string // 描述
    wx_code: string // 二维码
    icon: string // 网站图标
    is_en: boolean // 是否开启英文
    filing: string // 备案信息
    // copyright:string; // 版权信息

    company_en: string //
    address_en: string //
    filing_en: string //
    welcome: string //
    welcome_en: string //
    logo2: string
    public_code:string
    tel:string
}
/**
 * 修改系统信息请求参数
 */
declare interface ISystemEditParams {
    company: string // 公司名称
    logo: string // logo
    email: string // 邮箱
    phone: string // 联系电话
    tel:string
    address: string // 地址
    title: string // 标题
    keyword: string // 关键字
    description: string // 描述
    wx_code: string // 二维码
    public_code:string
    icon: string // 网站图标
    is_en: boolean // 是否开启英文
    filing: string // 备案信息
    // copyright:string; // 版权信息

    company_en: string //
    address_en: string //
    filing_en: string //
    welcome: string //
    welcome_en: string //
    logo2: string
}

type LanguageType = 'cn' | 'en'
