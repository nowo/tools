<script lang="ts" setup>
import { computed, reactive } from 'vue'

// const props = defineProps({
//     visible: {
//         type: Boolean,
//         default: false,
//     },
//     title: {
//         type: String,
//         default: '',
//     },
//     autoHeight: {
//         type: Boolean,
//         default: false,
//     },
//     hideFull: {
//         type: Boolean,
//         default: false,
//     },
//     loading: {
//         type: Boolean,
//         default: false,
//     },
//     noFooter: {
//         type: Boolean,
//         default: false,
//     },
//     width:{
//         type:Number,
//         default: 50,
//     }
// })

const props=defineProps<{
    visible?: boolean;
    title?: string;
    autoHeight?: boolean;
    hideFull?: boolean;
    loading?: boolean;
    noFooter?: boolean;
    width?: number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>>  // 各个尺寸的宽度大小
}>()

const emits = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'cancel'): void
    (e: 'close'): void
    (e: 'confirm'): void
}>()

const { width: wWid } = useWindowSize()
const width = computed(() => {
    let wid = 30
    // if(fullscreen.value ) return '100%'
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


const defData = reactive({
    visible: props.visible,
    fullscreen: false,
})

// 子组件定义自己的visible
const visible = computed({
    get: () => props.visible,
    set: (value) => {
        emits('update:visible', value)
    },
})

const iconName = computed(() => {
    return defData.fullscreen ? 'ele-CopyDocument' : 'ele-FullScreen'
})

// 关闭弹窗
const onClose = () => {
    emits('close')
    visible.value = false
}

// 点击取消
const onCancel = () => {
    emits('cancel')
    visible.value = false
}

// 点击确定
const onConfirm = () => {
    emits('confirm')
    // visible.value = false
}

// 最大、最小化
const onToggle = () => {
    defData.fullscreen = !defData.fullscreen
    // emits('update:fullscreen', defData.fullscreen)
}
</script>

<template>
    <el-dialog v-model="visible" :fullscreen="defData.fullscreen" draggable
        :class="{ 'auto-height': !props.autoHeight }" v-bind="$attrs" :width="width" @close="onClose">
        <template #header>
            <slot v-if="$slots.header" name="header" />
            <span v-else class="el-dialog__title">
                {{ props.title }}
            </span>
            <button v-if="!props.hideFull" class="el-dialog__headerbtn mr54px" @click="onToggle">
                <i v-if="defData.fullscreen" class="el-dialog__close active i-ep-copy-document" />
                <i v-else class="el-dialog__close i-ep-full-screen" />
                <!-- <SvgIcon class="el-dialog__close" :class="{ active: iconName === 'ele-CopyDocument' }" :name="iconName" /> -->
            </button>
        </template>
        <slot />

        <template v-if="!props.noFooter" #footer>
            <el-button @click="onCancel">
                取 消
            </el-button>
            <el-button type="primary" :loading="props.loading" @click="onConfirm">
                确 定
            </el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped></style>
