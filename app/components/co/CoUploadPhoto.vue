<script lang="ts" setup>
import type { UploadFile, UploadInstance, UploadProps, UploadRawFile, UploadRequestHandler, UploadUserFile } from 'element-plus'
import { ElMessage, genFileId } from 'element-plus'
import { computed, reactive } from 'vue'

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    modelValue: string[] // 图片数组
    delete?: boolean // 是否调用删除接口
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', param: string[]): void
}>()

const uploadRef = ref<UploadInstance>()
// 图片预览控制项
const imageState = reactive({
    viewer: false, // 是否显示预览
    index: 0, // 当前预览图片索引
    fileLength: 0, // 图片数量
})

const attrs = useAttrs()

// 转驼峰命名
function convertKeysToCamelCase(obj: Record<string, any>) {
    const newObj: Record<string, any> = {}

    for (const key in obj) {
        // 排除原型链上的属性
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelCaseKey = key.replace(/-([a-z])/g, (substring, char) => {
                // console.log(substring, char)
                return substring.toUpperCase()
            })
            newObj[camelCaseKey] = obj[key]
        }
    }
    return newObj
}

// upload组件默认传值
const propsAttr = reactive<Partial<UploadProps>>({
    // autoUpload: false, // 不自动上传
    listType: 'picture-card',
    // 'multiple': true, // 是否支持多选文件
    limit: 1, // 最大允许上传个数
    accept: 'image/*', // 文件类型
    action: '/', // 上传地址
    ...convertKeysToCamelCase(attrs), // attrs传过来的可能是`list-type`短横线命名,这里需要转驼峰命名
})

// 图片数据列表
const uploadList = ref<UploadUserFile[]>([])

// props.modelValue处理，转成相应的数据内容
const initData = () => {
    // console.log(propsAttr)
    const list = props.modelValue.filter(item => !!item).map((item) => {
        const dat: UploadUserFile = { name: item, url: item, status: 'success' }
        return dat
    })
    // 数量超出limit限制时
    const limit = propsAttr.limit || 1
    // imageState.fileLength = list.length > limit ? limit : list.length
    uploadList.value = list.length > limit ? list.slice(0, limit) : list
}

// 是否隐藏添加图标
const isHideIcon = computed(() => {

    // 禁用时不显示添加图标
    if ('disabled' in attrs) return true
    // 已达到上传个数时不显示添加图标
    const limit = propsAttr.limit || 1
    const list = uploadList.value.filter(item => !!item)
    return list.length >= limit
})
// 更新父组件值
const emitsUpdate = (val?: string[]) => {
    const fileList = uploadList.value.filter(item => item.status === 'success').map(item => item.url as string)
    emits('update:modelValue', val || fileList)
}

/**
 * 上传图片方法,配合下面的onUploadSuccess一起使用
 */
const onUploadFile: UploadRequestHandler = async (options) => {


    const formData = new FormData()
    formData.append('file', options.file)
    const res = await useServerFetch<{ src: string, list: string[] }>('/api/v1/file/upload', {
        method: 'POST',
        body: formData,
    })
    return res
}
// 上传成功操作,更新数据，去除前端预览的blob地址
const onUploadSuccess: UploadProps['onSuccess'] = async (response, file, files) => {

    // 只有所有都上传成功了才处理
    const isSuccess = files.every(it => it.status === 'success')

    if (!isSuccess) return

    files.forEach((item) => {
        // 只取携带response的才是刚上传的
        const resData = item.response as { code: number, data: { src: string }, msg: string }
        // console.log(resData)
        if (resData) {
            if (resData.code === 200) { // 成功上传
                item.url = resData.data.src
                // console.log('uploadList.value :>> ', uploadList.value);
                // uploadList.value.push(item)
            } else { // 失败上传
                ElMessage.error(resData.msg)
            }
        }
    })
    emitsUpdate()
}

// 文件超出数量处理
const onImageExceed: UploadProps['onExceed'] = (files) => {
    const limit = propsAttr.limit || 1
    // 剩余可上传数量
    const max = limit - uploadList.value.length
    if (limit === 1 && max === 0) { // 单个时，替换
        uploadRef.value!.clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        uploadRef.value!.handleStart(file)
        uploadRef.value?.submit()
    } else if (files.length > max) { // 超出时，只上传剩余可上传数量
        files.slice(0, max).forEach((item) => {
            const file = item as UploadRawFile
            file.uid = genFileId()
            uploadRef.value!.handleStart(file)
            uploadRef.value?.submit()
        })
    }
}

// 移除图片
const onImageRemove = (file: UploadFile) => {
    // 这里可以调用删除接口，删除图片
    // const res = useServerFetch('/api/v1/file/delete')

    emitsUpdate()
}

// 图片预览
const onImgPreview = (file: UploadFile) => {

    const findIndex = props.modelValue?.findIndex(item => item === file.url)
    imageState.index = findIndex && findIndex >= 0 ? findIndex : 0
    imageState.viewer = true
}
// 关闭图片预览
const closeView = () => {
    imageState.viewer = false
}

watchEffect(() => {
    initData()
})

defineExpose({
    uploadRef,
})
</script>

<template>
    <el-upload v-bind="propsAttr" ref="uploadRef" v-model:file-list="uploadList" class="co-upload"
        :class="{ 'upload-hide-add': isHideIcon }" :on-preview="onImgPreview" :on-remove="onImageRemove"
        :http-request="onUploadFile" :on-success="onUploadSuccess" :on-exceed="onImageExceed">
        <slot v-if="$slots.default" />
        <div v-else-if="'drag' in propsAttr">
            <el-icon class="el-icon--upload i-ep-upload-filled" />
            <div class="el-upload__text">
                将文件拖放至这里或<em>点击</em>
            </div>
        </div>
        <el-icon v-else-if="propsAttr.listType === 'picture-card'" class="i-ep-plus" />
        <el-icon v-else-if="propsAttr.listType === 'picture' || propsAttr.listType === 'text'" class="i-ep-plus" />
    </el-upload>
    <el-image-viewer v-if="imageState.viewer" :url-list="props.modelValue" :z-index="10000"
        :initial-index="imageState.index" teleported @close="closeView" />
</template>

<style lang="scss" scoped>
.co-upload {
    :deep() {
        .el-upload.el-upload--picture-card {
            transition: all 0.8s;
            transform-origin: left;
        }
    }

    &.upload-hide-add {
        :deep() {
            .el-upload.el-upload--picture-card {
                transform: translateX(-100%);
                z-index: -1000;
                width: 0px;
                border: 0;
            }

            // .el-upload.el-upload--picture{
            //     opacity: 0.5;
            //     pointer-events: none;
            // }
        }
    }
}
</style>
