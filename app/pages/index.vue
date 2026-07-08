<script setup lang="ts">
useHead({ title: appName })
</script>

<template>
    <div class="mx-auto px-5 py-8 max-w-1140px lg:px-14 lg:py-12">
        <p class="text-12px text-accent-ink tracking-wider font-mono mb-4.5 flex gap-2.5 uppercase items-center">
            <span class="rounded-full bg-accent h-1.75 w-1.75" />前端工具箱 · 纯前端 · 无需登录
        </p>

        <div class="pb-5.5 border-b border-line flex flex-wrap gap-8 items-end justify-between">
            <h1 class="text-5xl leading-none font-600 m-0 -tracking-tight">
                <span class="block">{{ appName }}</span>
                <span class="text-14px text-faint tracking-[0.34em] font-400 font-mono mt-3.5 block uppercase">Front-end Toolbox</span>
            </h1>
            <div class="max-w-400px">
                <p class="text-15px text-muted leading-relaxed m-0">
                    {{ appDescription }},以及计算器、JSON 生成、正则可视化和选择器速查。全部在浏览器里跑,即开即用。
                </p>
                <div class="font-mono mt-4 flex gap-6.5">
                    <div>
                        <b class="text-20px text-ink font-600 block">{{ tools.length }}</b>
                        <span class="text-12px text-faint">tools</span>
                    </div>
                    <div>
                        <b class="text-20px text-ink font-600 block">0</b>
                        <span class="text-12px text-faint">后端依赖</span>
                    </div>
                    <div>
                        <b class="text-20px text-ink font-600 block">CSS</b>
                        <span class="text-12px text-faint">为主</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8.5 gap-3.5 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2">
            <ToolCard v-for="tool in tools" :key="tool.id" :tool="tool" />
        </div>

        <div class="text-11.5px text-faint tracking-wide font-mono mt-7.5 pt-4.5 border-t border-line flex flex-wrap gap-3 justify-between">
            <span>Nuxt 4 · SPA / 静态生成 · UnoCSS · PrimeVue</span>
            <span>GitHub Pages · 无需服务端</span>
        </div>
    </div>
</template>
