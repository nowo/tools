<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader :id="id" />

        <div class="text-13px text-muted mt-8 px-4 py-3.5 border border-line rounded-12px bg-panel flex gap-2.5 items-center">
            <span class="rounded-full bg-accent h-1.75 w-1.75" />
            功能开发中 —— 将在第三阶段以原生组件实现。
        </div>
    </div>
</template>
