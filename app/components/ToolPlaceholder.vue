<script setup lang="ts">
const props = defineProps<{ id: string }>()

const tool = computed(() => tools.find(t => t.id === props.id))

useHead({ title: () => (tool.value ? `${tool.value.name} · ${appName}` : appName) })
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <NuxtLink to="/" class="text-13px text-muted no-underline inline-flex gap-1.5 transition items-center hover:text-accent">
            <span class="font-mono">←</span> 返回工具箱
        </NuxtLink>

        <div class="mt-8 pb-6 border-b border-line">
            <p class="text-12px text-faint tracking-wide font-mono m-0">
                {{ tool?.no }} · {{ tool?.slug }}
            </p>
            <h1 class="text-3xl font-600 mb-1 mt-1.5 -tracking-tight">
                {{ tool?.name }}
            </h1>
            <p class="text-15px text-muted m-0">
                {{ tool?.desc }}
            </p>
        </div>

        <div class="text-13px text-muted mt-8 px-4 py-3.5 border border-line rounded-12px bg-panel flex gap-2.5 items-center">
            <span class="rounded-full bg-accent h-1.75 w-1.75" />
            功能开发中 —— 将在第三阶段以原生组件实现。
        </div>
    </div>
</template>
