<template>
    <div>
        <el-menu ellipsis class="!absolute top-0 left-0 max-w60px rounded-50% overflow-hidden" router mode="horizontal" :popper-offset="16">
            <el-menu-item v-for="item in listData" :key="item.id" :index="item.url">{{item.name}}</el-menu-item>
        </el-menu>
        <div v-if="data.iframe">
            <iframe :src="data.iframe" frameborder="0"> </iframe>
        </div>
        <div v-else style="padding: 15px">没获取到数据π__π</div>
    </div>

</template>

<script setup>
import { reactive } from "vue";
definePageMeta({
    layout: 'blank',
})


const id = useRouteParam('id')

const listData = ref([
    {
        id: 1,
        name: 'CSS工具',
        url: '/tool/gradient',
        icon: 'fa-server',
        intro: 'CSS颜色/透明度渐变、阴影、圆角、噪音/纹理'
    },
    {
        id: 2,
        name: 'CSS3 剪贴路径(Clip-path)',
        url: '/tool/path',
        icon: 'fa-exchange',
        intro: '*'
    },
    {
        id: 3,
        name: '正则可视化',
        url: '/tool/regex',
        icon: 'fa-exchange',
        intro: 'JavaScript 正则表达式可视化工具'
    },
    {
        id: 4,
        name: '计算器',
        url: '/tool/calc',
        icon: 'fa-pencil-square-o',
        intro: '支持键盘输入的计算器'
    },
    {
        id: 5,
        name: 'JSON 生成器',
        url: '/tool/json',
        icon: 'fa-edit',
        intro: 'JSON生成器 - 生成随机数据的工具'
    },
    {
        id: 6,
        name: 'JQuery、CSS选择器',
        url: '/tool/select',
        icon: 'fa-edit',
        intro: 'JQuery选择器、CSS选择器大全'
    },
    // {
    //     id: 7,
    //     name: 'cdn',
    //     url: '/tool/cdn',
    //     icon: 'fa-exchange',
    //     intro: '静态资源CDN库'
    // }
])

const data = reactive({
    type: '',
    iframe: "",
    arrHtml: ["css-tool", "clip-path", "counter", "regulex", "json-generate"],
});
// 判断链接后面有没有参数
if (id.value) {
    let type = ''
    if (id.value === 'gradient') {
        type = 'css-tool'
    } else if (id.value === 'path') {
        type = 'clip-path'
    } else if (id.value === 'regex') {
        type = 'regulex'
    } else if (id.value === 'calc') {
        type = 'counter'
    } else if (id.value === 'json') {
        type = 'json-generate'
    } else if (id.value === 'select') {
        type = 'jquery'
    } else if (id.value === 'cdn') {
        type = 'cdn'
    }
    if (type) data.iframe = `/iframe/${type}.html`;
}
</script>

<style lang="scss" scoped>
iframe {
    width: 100%;
    height: 100vh;
    display: block;

}
</style>