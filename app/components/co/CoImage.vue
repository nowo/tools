<script lang="ts" setup>
const props = defineProps({
    iconSize: {
        type: Number,
        default: 16,
    },
})
const iconSize = computed(() => {
    return `${props.iconSize}px`
})
</script>

<template>
    <el-image class="co-image" :z-index="10000" :preview-teleported="true" v-bind="$attrs">
        <template #error>
            <div class="el-image__error">
                <i class="i-ep-picture" />
            </div>
        </template>
    </el-image>
</template>

<style lang="scss" scoped>
.co-image {
    position: relative;
    :deep(.el-image__inner){
        position:absolute;
        width:100%;
        height:100%;
        inset:0
    }

    .el-image__error {

        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;

        >i {
            font-size: v-bind('iconSize');
        }
    }
}
</style>
