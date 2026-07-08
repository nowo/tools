<script setup lang="ts">
const props = defineProps<{ id: string }>()

const tool = computed(() => tools.find(t => t.id === props.id))

useHead({ title: () => (tool.value ? `${tool.value.name} · ${appName}` : appName) })
</script>

<template>
    <div class="pb-6 border-b border-line">
        <NuxtLink to="/" class="text-13px text-muted no-underline inline-flex gap-1.5 transition items-center hover:text-accent">
            <span class="font-mono">←</span> 返回工具箱
        </NuxtLink>
        <p class="text-12px text-faint tracking-wide font-mono m-0 mt-8">
            {{ tool?.no }} · {{ tool?.slug }}
        </p>
        <h1 class="text-3xl font-600 mb-1 mt-1.5 -tracking-tight">
            {{ tool?.name }}
        </h1>
        <p class="text-15px text-muted m-0">
            {{ tool?.desc }}
        </p>
    </div>
</template>
