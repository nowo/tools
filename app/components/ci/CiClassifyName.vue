<template>
    <span>
        <template v-if="item?.parent">
            {{ $lang(item?.parent?.title, item?.parent?.title_en) }}
            【{{ $lang(item?.title, item?.title_en) }}】
        </template>
        <template v-else>{{ $lang(item?.title, item?.title_en) }}</template>
    </span>
</template>

<script lang="ts" setup>
const { $lang } = useNuxtApp()
defineProps<{
    item?: IClassifyListParent
}>()
</script>

<style lang="scss" scoped></style>
