<script setup lang="ts">
useHead({
    title: appName,
    htmlAttrs: { lang: 'zh-CN' },
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, "SF Pro Text", "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 14px;
    background: #f1f3ef;
    color: #152019;
    -webkit-font-smoothing: antialiased;
}
</style>
