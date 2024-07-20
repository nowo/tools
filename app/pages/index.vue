<template>
    <div class="min-h500px">
        <Suspense>
            <ClientOnly>
                <HomeMain />
            </ClientOnly>
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
})

</script>

<style lang="scss" scoped></style>
