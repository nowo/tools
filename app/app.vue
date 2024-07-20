<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

useHead({
    title: appName,
})

</script>

<template>
    <el-config-provider :locale="zhCn">
        <VitePwaManifest />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </el-config-provider>
</template>

<style lang="scss">
@import url("~/assets/scss/element-plus.scss");
@import url("~/assets/scss/transition.scss");

html,
body,
#__nuxt {
    // height: 100vh;
    margin: 0;
    padding: 0;
    font-size: 14px;
    color:#333;
}

html.dark {
    background: #222;
    color: white;
}
</style>
