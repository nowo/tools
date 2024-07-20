<template>
    <div class="min-h500px">
        <Suspense>
            hello
            <template #fallback>
                <div class="min-h500px">
                    <span animate-pulse>Loading...</span>
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'home',
    redirect:'/tool'
})

</script>

<style lang="scss" scoped></style>
