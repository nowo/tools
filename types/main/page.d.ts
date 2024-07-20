
/**
 *  创建banner  - 请求
 */
declare interface BannerCreateParam {

    title: string // 菜单名称
    title_en: string // 菜单名称（英文）
    href: string // 链接地址
    sort: number // 排序
    img: string // 图片地址

}


/**
 *  修改banner   - 请求
 */
declare interface BannerCreateParamEdit extends BannerCreateParam {
    id: number
}




/**
 * 商品页面参数
 */
declare interface GoodsListParams<T = Record<string, any>> {
    query: T // 参数
    relate?: boolean // 是否携带浏览器地址上的参数
    url?: boolean // 返回地址的形式
}

declare interface GoodsListParamsQuery {
    page?: string | number // 关键字
    cid?: string | number // 商品分类id   类别
    // bid?: string | number // 商品品牌id
    search?: string
}



declare type IOtherType = 'about' | 'organization' | 'culture' | 'recruit-person' | 'recruit-notice' | 'recruit-cultivate' | 'service-mend' | 'message'


/**
 * 修改关于我们、联系我们 - 请求参数
 */
declare interface IOtherInfoUpdate {

    // id?: number,
    title?: string,  // 标题
    title_en?: string,  // 标题
    subtitle?: string,  // 标题
    subtitle_en?: string,  // 标题
    img: string; // 图片地址

    content: string; // 内容
    content_en: string; // 内容

    // type: number | string;    // 类型 1:关于我们，2：联系我们
    key?: string

}
