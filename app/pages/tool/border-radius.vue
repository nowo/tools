<script setup lang="ts">
const corners = [
    { key: 'tl', label: '左上' },
    { key: 'tr', label: '右上' },
    { key: 'br', label: '右下' },
    { key: 'bl', label: '左下' },
] as const

const r = reactive({
    tl: { x: 30, y: 30 },
    tr: { x: 70, y: 40 },
    br: { x: 50, y: 60 },
    bl: { x: 60, y: 40 },
})

const radius = computed(() =>
    `${r.tl.x}% ${r.tr.x}% ${r.br.x}% ${r.bl.x}% / ${r.tl.y}% ${r.tr.y}% ${r.br.y}% ${r.bl.y}%`,
)
const cssCode = computed(() => `border-radius: ${radius.value};`)
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="border-radius" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <!-- 预览 + 代码 -->
            <div class="flex flex-col gap-4 min-w-0">
                <div class="border border-line rounded-14px bg-ground flex h-80 items-center justify-center">
                    <div class="h-56 w-56"
                        style="background:linear-gradient(135deg,#0E8C6B,#7DD9BE)"
                        :style="{ borderRadius: radius }" />
                </div>
                <CodeOutput :code="cssCode" />
            </div>

            <!-- 控制面板:四角,每角水平 / 垂直 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <div v-for="c in corners" :key="c.key" class="flex flex-col gap-2.5">
                    <span class="text-13px text-ink font-600 -tracking-tight">{{ c.label }}</span>
                    <div class="flex gap-3 items-center">
                        <span class="text-11px text-faint w-8">水平</span>
                        <Slider v-model="r[c.key].x" :min="0" :max="100" class="flex-1" />
                        <span class="text-11px text-muted font-mono text-right w-9">{{ r[c.key].x }}%</span>
                    </div>
                    <div class="flex gap-3 items-center">
                        <span class="text-11px text-faint w-8">垂直</span>
                        <Slider v-model="r[c.key].y" :min="0" :max="100" class="flex-1" />
                        <span class="text-11px text-muted font-mono text-right w-9">{{ r[c.key].y }}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
