<template>
    <el-drawer ref="drawerRef" v-bind="$attrs" :size="width">
        <template #header>
            <slot v-if="$slots.header" name="header" />
            <span v-else>{{ $attrs.title }}</span>
            <button v-if="!props.hideFull" class="el-drawer__close-btn mr-5px" @click="fullscreen = !fullscreen">
                <el-icon v-if="fullscreen" class="i-ep-copy-document rotate-180"></el-icon>
                <el-icon v-else class="i-ep-full-screen"></el-icon>
            </button>
        </template>
        <el-scrollbar class="px20px">
            <slot />
        </el-scrollbar>
        <template #footer>
            <slot v-if="$slots.footer" name="footer" />
            <div v-else>
                <el-button @click="onCancel">取消</el-button>
                <el-button type="primary" :loading="props.loading" @click="onConfirm">确认</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script lang="ts" setup>

const props = defineProps<{
    loading?: boolean,  // 确定按钮loading
    width?: number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>>  // 各个尺寸的宽度大小
    // width?: number | Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>
    hideFull?:boolean   //  是否隐藏全屏按钮
}>()

const emits = defineEmits<{
    cancel: [],
    confirm: []
}>()

const fullscreen=ref(false) // 是否最大

const { width: wWid } = useWindowSize()

const width = computed(() => {
    let wid = 30
    if(fullscreen.value ) return '100%'
    if (typeof props.width === 'number') {
        wid = props.width
    } else if (typeof props.width === 'object') {
        let winWidth = wWid.value

        const { xs, sm, md, lg, xl } = props.width;
        if (xl && winWidth > 1200) {
            wid = xl
        } else if (lg && winWidth > 992) {
            wid = lg
        } else if (md && winWidth > 768) {
            wid = md
        } else if (sm && winWidth > 576) {
            wid = sm
        } else if (xs && winWidth > 380) {
            wid = xs
        } else {
            wid = xs || sm || md || lg || xl || wid
        }
    }

    return `${wid}%`
})


const drawerRef = ref<ComponentInstance['ElDrawer']>()

// 取消
const onCancel = () => {
    emits('cancel')
}

// 确认
const onConfirm = () => {
    emits('confirm')
}

defineExpose({
    drawerRef,
    onCancel,
    onConfirm,
})
</script>