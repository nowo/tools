<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.preference === 'dark')
function toggleDark() {
    colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
    <div class="text-ink font-sans bg-ground min-h-screen">
        <header class="border-b border-line bg-ground/85 top-0 sticky z-10 backdrop-blur">
            <div class="mx-auto px-5 py-3 flex max-w-1140px items-center justify-between lg:px-14">
                <NuxtLink to="/" class="group no-underline flex gap-2.5 items-baseline">
                    <span class="rounded-full bg-accent h-1.75 w-1.75" />
                    <span class="text-15px text-ink tracking-tight font-600">工具箱</span>
                    <span class="text-11px text-faint tracking-[0.3em] font-mono uppercase">Toolbox</span>
                </NuxtLink>
                <div class="flex gap-3 items-center">
                    <button class="text-11px text-faint tracking-wide font-mono px-2 py-1 border border-line rounded-md transition hover:text-muted hover:border-accent/30"
                        @click="toggleDark">
                        {{ isDark ? '☀ 亮色' : '☾ 暗色' }}
                    </button>
                    <span class="text-11px text-faint tracking-wide font-mono hidden sm:inline">纯前端 · 无需登录</span>
                </div>
            </div>
        </header>

        <main>
            <slot />
        </main>
    </div>
</template>
