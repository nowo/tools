<script lang="ts" setup>
import '~/assets/scss/base.scss'
// import '~/assets/css/header.css'
</script>

<template>
    <main class="main-box">
        <!-- <LayoutHomeHeader />
        <LayoutHomeBanner /> -->
        <slot />
        <!-- <LayoutHomeFooter /> -->
        <el-backtop :right="25" :bottom="30" />
    </main>
</template>

<style lang="scss">

</style>
