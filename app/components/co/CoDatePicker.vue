<script lang="ts" setup>
// 默认的日期选中格式  '00:00:00', '23:59:59'
const defaultTime = ref<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
])
</script>

<template>
    <el-date-picker type="datetimerange" :unlink-panels="true" value-format="YYYY-MM-DD HH:mm:ss" range-separator="-"
        start-placeholder="开始日期" end-placeholder="结束日期" :default-time="defaultTime" v-bind="$attrs" />
</template>

<style lang="scss" scoped></style>
