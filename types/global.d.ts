declare module 'element-plus/dist/locale/zh-cn.mjs';

// search搜索项 数据格式公共类型
declare interface CoFormToolProps<T = Record<string, any>> {
    data: T
    config: { column: CoSearchDataColumnItem<T>, placeholder?: string, width?: string, isHide?: boolean }[]
    hideBtn?: boolean
    showAll?: boolean
}

// type CoTableColumnProperty<T> = keyof T | `${keyof T}Header` | 'operate' | 'operateHeader' | ''

interface CoTableHeader<T> extends CoTableColumnCtx<T> {
    property: keyof T | 'operate' | ''
    // property: CoTableColumnProperty<T>
    label: string
    other?: {
        // slot?: boolean
        slotHeader?: boolean
        isHide?: boolean // 是否隐藏项
        isShow?: boolean // 是否显示字段
    }

}

type CoTableColumnProperty<T> = CoTableHeader<T>['property']
type CoTableColumnPropertyHeader<T> = `${keyof T}Header` | 'operateHeader'
// type CoTableColumnPropertyHeader<T> = `${keyof CoTableHeader<T>['property']}Header`

// table 数据格式公共类型
declare interface CoTableProps<T> {
    data: T[]
    tableHeader: CoTableHeader<T>[]
    pagination: { // 分页
        total: number
        page: number
        pageSize: number
        pageSizes: number[]
    }
    isTool?: boolean // 是否显示配置栏
    loading?: boolean // loading
}

/**
 * element-plus,DateTimePicker 日期时间选择器,v-model类型
 */
declare type DateRangeType = [Date, Date] | [string, string]

/**
 * 分页设置
 */
declare interface IListPage {
    isPage?: boolean
    page?: number
    pageSize?: number
}

declare type DialogOperate = 'add' | 'edit' // |'view'|'delete'
declare type PermissionType = 'add' | 'edit' | 'del' // |'view'|'delete'
