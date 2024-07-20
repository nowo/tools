<script lang="ts" setup  generic="T">
import { computed, reactive, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { ComponentSize, RenderRowData, TableInstance } from 'element-plus'
// import { wait } from '@/utils/common'

// props数据类型结构，element-plus table props类型中的data重写
// interface PropsDataType extends Omit<TableProps<T>, 'data'> {
//     data: CoTableProps<T>
// }
interface PropsDataType {
    option: CoTableProps<T>
    size?: ComponentSize
    autoHeight?: boolean // 表格设置自动高度(跟随内容)
}

// 插槽数据类型结构
type SlotsDataItemType<U> = { default: any } & { [K in CoTableColumnPropertyHeader<U>]?: any } & {
    [K in CoTableColumnProperty<U>]?: (props: RenderRowData<U>) => void;
}

const props = defineProps<PropsDataType>()
// useUtils<T>
const emits = defineEmits<{
    (e: 'update:option', param: CoTableProps<T>): void
    (e: 'pagination', param: CoTableProps<T>['pagination']): void
    (e: 'refresh'): void // 刷新
}>()

// const slots = defineSlots<{
//     // str(props: { scopes: T }): any
//     [K in keyof CoTableHeader<T>['property']]:(props: { scopes: T })=>any
// } & Record<CoTableColumnProperty<T>, (props: { scopes: CoTableColumnScopes }) => any>>()

// defineSlots<{ default: any } & { [K in CoTableColumnPropertyHeader<T>]?: any } & {
//     // [K in CoTableColumnProperty<T>]: (props: {
//     //     scopes: CoTableColumnScopes
//     // }) => any;
//     [K in CoTableColumnProperty<T>]?: (props: CoTableColumnScopes) => void;
// }>()

defineSlots<SlotsDataItemType<T>>()

const { themeConfig } = useThemeState()

const tableRef = ref<TableInstance>()
const tablePageRef = ref<HTMLDivElement>()
const toolRef = ref<HTMLDivElement>()
const pageRef = ref<ComponentInstance['ElPagination']>()
const { height: tHeight } = useElementSize(tablePageRef)

const tableHeight = computed(() => {
    if (props.autoHeight) return 'unset'

    const toolHeight = toolRef.value?.clientHeight || 0 // table工具栏高度
    const pageHeight = pageRef.value?.$el?.clientHeight || 0 // 分页高度
    const hei = tHeight.value - toolHeight - pageHeight
    return hei > 200 ? Math.floor(hei) : 200
})

const propsData = computed({
    get: () => {
        return props.option
    },
    set: (val) => {
        emits('update:option', val)
    },
})
// table表头配置
const headerList = computed({
    get: () => {
        // 过滤隐藏项
        const tableHeader = props.option.tableHeader.filter(item => !item?.other?.isHide).map((item) => {
            // 设置默认显示
            const other = item.other || {}
            other.isShow = item.other?.isShow === undefined ? true : item.other?.isShow
            return {
                ...item,
                other,
            }
        })
        return tableHeader
    },
    set: (val) => {
        propsData.value.tableHeader = val
    },
})

const size = ref(props?.size || 'default')

// 默认数据列表
const defData = reactive({
    visible: false,
    pagination: props.option.pagination,
    time: 0, // 用于分页和分页数量同时改变时，更新数据判断
    isRefresh: false, // 是否正在刷新
    sizeList: { // table尺寸
        large: '宽松',
        default: '默认',
        small: '紧凑',
    },
})

// 获取全局组件大小
const smallSize = computed(() => {
    return themeConfig.value.globalComponentSize === 'small' || size.value === 'small'
})

// 属性透传，去除id、class、style，不传入el-table组件
const attrs = useAttrs()
const newAttrs = computed(() => {
    const { class: a, id, style, ...att } = attrs // eslint-disable-line unused-imports/no-unused-vars

    // const { data, ...att } = props // eslint-disable-line unused-imports/no-unused-vars

    // if (att.style) delete att.style;
    // if (att.class) delete att.class;
    // if (att.id) delete att.id;
    return att
})

const setColumnAttrs = (item: CoTableHeader<T>): any => {
    const { other, ...attr } = item // eslint-disable-line unused-imports/no-unused-vars
    return attr
}

const setSlotHeaderName = (row: CoTableHeader<T>) => {
    return `${String(row.property)}Header` as CoTableColumnPropertyHeader<T>
}

// 分页切换事件
const onPaginationChange = (val: number) => {
    const { total, pageSize } = defData.pagination
    if (total < pageSize && propsData.value.data.length === total) return

    emits('pagination', defData.pagination)
    tableRef.value?.setScrollTop(0)
}

// 选中（显示、隐藏）
const onCheckBox = () => {
    propsData.value.tableHeader = headerList.value
}
// 固定列
const onFixedItem = (type: 'left' | 'right', row: CoTableHeader<T>) => {
    // if (type === 'left') {
    //     row.fixed = row.fixed === type ? false : type
    // } else if (type === 'right') {
    //     row.fixed = row.fixed === type ? false : type
    // }
    row.fixed = row.fixed === type ? false : type
    propsData.value.tableHeader = headerList.value
}

// 刷新
const onRefresh = async () => {
    defData.isRefresh = true
    emits('refresh')
    // await wait(1000)
    defData.isRefresh = false
}
// 设置大小
const onChangeSize = (val: ComponentSize) => {
    size.value = val || 'default'
}

// 因设置keepalive缓存时，table组件滚动条位置不对处理
onActivated(() => {
    useTableScrollbarLoad(tableRef.value)
})

defineExpose({
    tableRef,
})
</script>

<template>
    <div ref="tablePageRef" class="table-page">
        <ClientOnly>
            <div v-if="$slots.default || propsData.isTool" ref="toolRef" class="flex items-end justify-between pb8px">
                <div>
                    <slot />
                </div>
                <div v-if="propsData.isTool" class="flex items-center -mt15px">
                    <el-icon class="tool-icon" :class="{ 'is-loading': defData.isRefresh }">
                        <span class="i-ep-refresh" title="刷新" @click="onRefresh" />
                    </el-icon>
                    <el-dropdown @command="onChangeSize">
                        <el-icon class="tool-icon">
                            <svg title="尺寸" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                                <path fill="currentColor"
                                    d="M840 836H184c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h656c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8m0-724H184c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h656c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8M610.8 378c6 0 9.4-7 5.7-11.7L515.7 238.7a7.14 7.14 0 0 0-11.3 0L403.6 366.3a7.23 7.23 0 0 0 5.7 11.7H476v268h-62.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.7-4.7.4-11.7-5.7-11.7H548V378z" />
                            </svg>
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in defData.sizeList" :key="index" :command="index"
                                    :class="{ 'el-dropdown-menu__item-active': index === size }">
                                    {{ item }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <!-- <el-icon class="tool-icon">
                    <span class="i-ep-download" title="导出" />
                </el-icon> -->
                    <el-popover :width="240" popper-class="popover-drag-box" trigger="click">
                        <template #reference>
                            <el-icon class="tool-icon">
                                <span class="i-ep-tools" title="列设置" />
                            </el-icon>
                        </template>
                        <el-scrollbar :max-height="tableHeight">
                            <VueDraggable v-model="headerList" tag="ul" class="move-box" handle=".handle" :animation="260">
                                <li v-for="(item, index) in headerList " :key="index"
                                    class="flex items-center justify-between px10px">
                                    <i class="handle i-ep-rank mr5px inline-block cursor-pointer" />
                                    <div class="flex-1 text-truncate">
                                        <el-checkbox v-model="item.other.isShow" :label="item.label" @change="onCheckBox" />
                                    </div>
                                    <div class="flex items-center pl5px">
                                        <div class="pin-icon mr5px" @click="onFixedItem('left', item)">
                                            <i v-if="item.fixed === 'left'" class="pin-active i-mdi:pin rotate-30" />
                                            <i v-else class="i-mdi:pin-outline rotate-30" />
                                        </div>
                                        <div class="pin-icon" @click="onFixedItem('right', item)">
                                            <i v-if="item.fixed === 'right'" class="pin-active i-mdi:pin -rotate-30" />
                                            <i v-else class="i-mdi:pin-outline -rotate-30" />
                                        </div>
                                    </div>
                                </li>
                            </VueDraggable>
                        </el-scrollbar>
                    </el-popover>
                </div>
            </div>
            <div class="flex-1 overflow-hidden">
                <!--   class="h100%!" -->
                <el-table ref="tableRef" :data="propsData.data" scrollbar-always-on
                    :max-height="tableHeight" :size="size" v-bind="newAttrs">
                    <el-table-column v-for="(item, index) in headerList.filter(item => item.other.isShow) " :key="index"
                        show-overflow-tooltip v-bind="setColumnAttrs(item)">
                        <template v-if="$slots[setSlotHeaderName(item)]" #header>
                            <slot :name="setSlotHeaderName(item)" />
                        </template>
                        <!-- 这里根据slot字段来判断是否使用插槽 -->
                        <template v-if="item.type !== 'selection' && item.type !== 'index'" #default="scope">
                            <slot v-if="$slots[item.property as any]" :name="item.property" v-bind="scope" />
                            <template v-else>
                                {{ scope.row[item.property] }}
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination v-if="defData.pagination.total" ref="pageRef" v-model:current-page="defData.pagination.page"
                v-model:page-size="defData.pagination.pageSize" :small="smallSize" :page-sizes="defData.pagination.pageSizes"
                :total="defData.pagination.total" :pager-count="5" background layout="total, sizes, prev, pager, next, jumper"
                class="pt15px justify-end" @change="onPaginationChange" />
        </ClientOnly>
    </div>
</template>

<style lang="scss" scoped>
.table-page {
    display: flex;
    flex-direction: column;
    // min-height: 100%;
    height: 100%;
    // overflow: auto;
    border: 0;

    // :deep(.el-table__inner-wrapper) {
    //     max-height: 100%;
    //     height: auto;
    // }
}

.tool-icon {
    color: var(--el-text-color-regular);
    cursor: pointer;
    font-size: 16px;
    margin-left: 5px;

    &:hover {
        color: var(--el-color-primary-light-3);
    }
}

.move-box {

    // background-color: var(--el-color-primary-light-9);
    :deep(.sortable-chosen) {
        background-color: var(--el-color-info-light-9);
    }

    :deep(.el-checkbox) {
        --el-checkbox-height: 28px;
    }

    .pin-icon {
        cursor: pointer;
        overflow: hidden;

        >i {
            display: block;
            font-size: 16px;
            color: var(--el-color-info);

            &.pin-active {
                color: var(--el-color-primary)
            }
        }
    }

}

:global(.popover-drag-box) {
    --el-popover-padding: 0
}
</style>
