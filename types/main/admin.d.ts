// 修改密码
declare interface IAdminPasswordUpdate {
    account?: string
    password: string
    newPassword: string
}


declare interface IAdminListParams extends IListPage{
    account: string
    username: string
    status: string
}