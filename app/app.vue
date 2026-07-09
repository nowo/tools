<script setup lang="ts">
// const colorMode = useColorMode()
// const isDark = computed(() => colorMode.preference === 'dark')
// function toggleDark() { colorMode.preference = isDark.value ? 'light' : 'dark' }

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
/* 亮色 & 暗色双轨 CSS 变量 */
:root {
    --color-ground: #F1F3EF;
    --color-panel: #FFFFFF;
    --color-ink: #152019;
    --color-muted: #5C6A62;
    --color-faint: #8A968E;
    --color-accent: #0E8C6B;
    --color-accent-ink: #0A5C47;
    --color-line: #DCE2DB;
    --color-line-soft: #E7EBE5;
    --color-bright-bg: #FFFFFF;
    --color-display: #152019;
    --color-card-preview: #FBFCFB;
}

.dark {
    --color-ground: #121a15;
    --color-panel: #1a2620;
    --color-ink: #e2e8e2;
    --color-muted: #8a9a8e;
    --color-faint: #5a6a5e;
    --color-accent: #33b08c;
    --color-accent-ink: #7DD9BE;
    --color-line: #2a3a2e;
    --color-line-soft: #223228;
    --color-bright-bg: #1a2620;
    --color-display: #0a1210;
    --color-card-preview: #111d17;
}

html,
body,
#__nuxt {
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, "SF Pro Text", "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 14px;
    background: var(--color-ground);
    color: var(--color-ink);
    -webkit-font-smoothing: antialiased;
}
</style>
