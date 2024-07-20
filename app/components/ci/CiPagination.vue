<template>
    <ClientOnly>
        <el-pagination v-model:current-page="page" :page-size="pageSize" class="goods-page justify-center" background
            layout="prev, pager, next" :total="total" :pager-count="5" @current-change="onHandleCurrentChange" />
    </ClientOnly>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
    change: [value: number] // named tuple syntax
}>()

const page = defineModel('page', { default: 1 })
const pageSize = defineModel('pageSize', { default: 10 })
const total = defineModel('total', { default: 0 })

const onHandleCurrentChange = (num: number) => {
    emits('change', num)
}
</script>

<style lang="scss" scoped>
.goods-page {
    --el-pagination-border-radius: 50%;
    --el-pagination-button-width: 38px;
    --el-pagination-button-height: 38px;

    @media screen and (max-width: 765px) {
        --el-pagination-button-width: 32px;
        --el-pagination-button-height: 32px;
    }
}
</style>
