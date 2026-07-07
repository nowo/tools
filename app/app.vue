<script setup lang="ts">
useHead({
    title: appName,
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style lang="scss">
html,
body,
#__nuxt {
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: #333;
}

html.dark {
    background: #222;
    color: white;
}
</style>
