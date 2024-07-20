<script lang="ts" setup>
import type { CascaderInstance, CascaderNode, CascaderProps, CascaderValue } from 'element-plus'

// type PropsModelValue = string | number | string[] | number[]
type PropsModelValue = CascaderValue

const props = defineProps({
    modelValue: {
        type: [String, Number, Array] as PropType<PropsModelValue>,
        required: true,
    },
    props: {
        type: Object as PropType<CascaderProps>,
        default: () => {
        },
    },
})
const emits = defineEmits<{
    (e: 'update:modelValue', param: PropsModelValue): void
}>()

const cascaderRef = ref<CascaderInstance>()

const dat = ref(props.modelValue)

// const setElWidth = (wid?: string) => {
//     if (!wid) return ''
//     return Number.isNaN(Number(wid)) ? wid : `${wid}px`
// }

// 级联选择事件 { valueByOption: PropsModelValue; isDisabled: boolean }
const getLastPid = (node: CascaderNode, data: any) => {
    if (node.isDisabled) return
    if (node.config.emitPath === false && node.config.multiple) {
        const { cloned } = useCloned(dat)
        const arr = cloned.value as any[]
        if (arr.includes(node.valueByOption)) {
            const index = arr.indexOf(node.valueByOption)
            arr.splice(index, 1)
        } else {
            arr.push(node.valueByOption)
        }
        dat.value = arr
        emits('update:modelValue', arr)
    } else {
        dat.value = node.valueByOption
        emits('update:modelValue', node.valueByOption)
    }
}

const getChangeValue = (val: PropsModelValue) => {
    const m = Array.isArray(val) ? [] : ''
    emits('update:modelValue', val ?? m)
}
watch(() => props.modelValue, (n, o) => {
    const m = Array.isArray(props.modelValue) ? [] : ''
    dat.value = n || m
})

defineExpose({
    cascaderRef,
})
</script>

<template>
    <el-cascader ref="cascaderRef" v-model="dat" class="co-cascader" :props="props.props" clearable filterable
        @change="getChangeValue">
        <template #default="{ node, data: row }">
            <template v-if="!node.isLeaf">
                <span>{{ node.label }}</span>
                <span> ({{ node.children.length }}) </span>
            </template>
            <span v-else class="block" @click.stop="getLastPid(node, row)">{{ node.label }}</span>
        </template>
    </el-cascader>
</template>

<style lang="scss"></style>
