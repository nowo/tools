<script lang="ts" setup generic="T extends Record<string, any>">
import type { FormInstance, FormItemInstance, FormProps } from 'element-plus'

// const props = defineProps({
//     data: {
//         type: Object as PropType<SearchDataType<T>>,
//         required: true,
//     },
// })

const props = defineProps<Partial<FormProps> & {
    option: CoFormToolProps<T>
}>()

const emits = defineEmits<{
    (event: 'update:option'): void
    (event: 'search'): void
    (event: 'reset'): void
}>()

defineSlots<{ default: () => any } & Record<keyof T, (props: { row: T }) => any>>()

const formRef = ref<FormInstance>()
const formItemRef = ref<FormItemInstance[]>([])
const lastItemRef = ref<FormItemInstance>()

const defData = reactive({
    hideForm: true, // 默认先隐藏form
    // showAll: false,
    hideIndex: -1,
})

const searchData = computed({
    get: () => props.option,
    set: (val) => {
        emits('update:option')
        // props.data = val
    },
})

// 判断选项是否填写了数据
const fillData = computed(() => {
    const data = props.option.data
    const node = props.option.config.find((item, index) => {
        const key = item.column.prop
        if (data[key]) {
            if (Array.isArray(data[key])) {
                return data[key].length ? data[key].every((i: any) => !!i) : false
            }
            return true
        }
        return false
    })
    return !!node
})

// const searchData = reactive({
//     data: props.data.data,
//     config: props.data.config
//     // data: {
//     //     company_id: '',
//     //     depot: '' as '' | number,   //仓库名称
//     //     goods_name: '',
//     //     goods_sn: '',
//     //     goods_model: '',
//     //     class_id: '' as '' | number,
//     //     brand: '',
//     //     time: [] as string[],
//     //     goods_size: '', //规格
//     //     goods_site: '',  //货位
//     //     goods_vender: '',//供应商
//     //     is_stock: false,     // 是否显示0库存
//     // },
//     // config: {
//     //     company_id: { label: "公司名称", prop: "company_id", slot: true, placeholder: '', width: '180' },
//     //     depot: { label: "仓库名称", prop: "depot", slot: true, placeholder: '请选择仓库', width: '180' },
//     //     goods_name: { label: "商品名称", prop: "goods_name", slot: true, placeholder: '请输入商品名称', width: '180' },
//     //     class_id: { label: "商品分类", prop: "class_id", slot: true, placeholder: '', width: '180' },
//     //     goods_sn: { label: "商品编号", prop: "goods_sn", slot: false, placeholder: '请输入商品编号', width: '180' },
//     // }
// })

const { width: formWidth } = useElementSize(formRef as any)

// 查询
const onSearch = () => {
    emits('search')
}
// 重置
const onReset = async () => {
    formRef.value?.resetFields()
    emits('reset')
}

// 判断是否显示项
const setHideItem = async (show: boolean, wid: number) => {
    // 不显示展开收起按钮时
    if (props.option.hideBtn) return
    // 展开收起按钮为展开时
    if (show) return defData.hideIndex = -1
    // 还未获取到宽度时
    if (!wid) return

    const formWid = wid
    const lastWidth = lastItemRef.value?.$el.getBoundingClientRect()

    const indexArr: number[] = []
    props.option.config.reduce((prev, next, index) => {
        // const elBound = formItemRef.value[index].$el.getBoundingClientRect()
        // const count = prev + elBound.width
        let elWidth = 0
        if (formItemRef.value[index]) {
            elWidth = formItemRef.value[index].$el.getBoundingClientRect().width
        }
        const count = prev + elWidth
        if (formWid - count < lastWidth.width) indexArr.push(index)
        return count
    }, 0)

    if (indexArr.length) defData.hideIndex = indexArr[0] > 0 ? indexArr[0] - 1 : 0
}

// 展开收起
const onToggle = () => {
    searchData.value.showAll = !searchData.value.showAll
    setHideItem(searchData.value.showAll, formWidth.value)
}

// 设置form-item隐藏class名
const setFormItemClass = (index: number) => {
    return !(defData.hideIndex >= 0 && index > defData.hideIndex) ? '' : 'hide-item'
}

// 设置宽度
const setElWidth = (wid?: string) => {
    if (!wid) return ''
    return Number.isNaN(Number(wid)) ? wid : `${wid}px`
}

// 监听展开、关闭状态以及form元素宽度变化
watchEffect(() => {
    setHideItem(!!searchData.value.showAll, formWidth.value)
}, {
    flush: 'post',
})

defineExpose({
    formRef,
})

// 采用watch监听时
// watch(() => formWidth.value, () => {
//     setHideItem(defData.showAll, formWidth.value)
// })
</script>

<template>
    <el-form v-if="searchData.config.length" ref="formRef" v-bind="props" :model="searchData.data">
        <ClientOnly>
            <el-form-item v-for="(item, index) in searchData.config.filter(item => !item.isHide)" :key="index"
                ref="formItemRef" :class="setFormItemClass(index)" v-bind="item.column" :prop="item.column.prop">
                <div class="item-content" :style="{ width: setElWidth(item.width) }">
                    <slot v-if="$slots[item.column.prop as any]" :name="item.column.prop" :row="searchData.data" />
                    <el-input v-else v-model.trim="searchData.data[item.column.prop]" :placeholder="item.placeholder"
                        clearable @keyup.enter="onSearch" />
                </div>
            </el-form-item>
            <el-form-item ref="lastItemRef" label="">
                <el-button type="primary" :plain="!fillData" @click="onSearch">
                    <el-icon class="i-ep-search">
                        <!-- <i /> -->
                    </el-icon>
                    查询
                </el-button>
                <el-button @click="onReset">
                    <el-icon class="i-ep-refresh">
                        <!-- <i /> -->
                    </el-icon>
                    重置
                </el-button>
                <slot />
                <el-button v-if="!searchData.hideBtn" type="primary" link @click="onToggle">
                    <template v-if="searchData.showAll">
                        收起<el-icon><i class="i-ep-arrow-up" /></el-icon>
                    </template>
                    <template v-else>
                        展开<el-icon><i class="i-ep-arrow-down" /></el-icon>
                    </template>
                </el-button>
            </el-form-item>
        </ClientOnly>
    </el-form>
</template>

<style lang="scss" scoped>
.hide-item {
    position: absolute;
    left: -100%;
    visibility: hidden;
    z-index: -1000;
}

.el-form {
    overflow: hidden;
    --el-font-size-base: 13px;

    .el-form-item {
        margin-right: 0;
        margin-bottom: 15px;
        padding-right: 15px;

        .item-content {
            :deep(>*) {
                width: 100%;
            }

        }
    }
}
</style>
