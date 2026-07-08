<script setup lang="ts">
const controls = [
    { key: 'offsetX', label: '水平偏移', min: -50, max: 50, unit: 'px' },
    { key: 'offsetY', label: '垂直偏移', min: -50, max: 50, unit: 'px' },
    { key: 'blur', label: '模糊', min: 0, max: 100, unit: 'px' },
    { key: 'spread', label: '扩散', min: -50, max: 50, unit: 'px' },
    { key: 'alpha', label: '不透明度', min: 0, max: 100, unit: '%' },
] as const

const p = reactive({ offsetX: 0, offsetY: 12, blur: 24, spread: -6, alpha: 30 })
const color = ref('152019')
const inset = ref(false)

function hexToRgb(hex: string) {
    const n = Number.parseInt(hex.padStart(6, '0'), 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
const shadowColor = computed(() => {
    const { r, g, b } = hexToRgb(color.value)
    return `rgba(${r}, ${g}, ${b}, ${(p.alpha / 100).toFixed(2)})`
})
const shadowValue = computed(() =>
    `${inset.value ? 'inset ' : ''}${p.offsetX}px ${p.offsetY}px ${p.blur}px ${p.spread}px ${shadowColor.value}`,
)
const cssCode = computed(() => `box-shadow: ${shadowValue.value};`)
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="box-shadow" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <!-- 预览 + 代码 -->
            <div class="flex flex-col gap-4 min-w-0">
                <div class="flex border border-line rounded-14px bg-ground h-80 items-center justify-center">
                    <div class="rounded-16px bg-[var(--color-bright-bg)] h-32 w-32" :style="{ boxShadow: shadowValue }" />
                </div>
                <CodeOutput :code="cssCode" />
            </div>

            <!-- 控制面板 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <div v-for="c in controls" :key="c.key" class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">
                        {{ c.label }} <span class="text-accent-ink">{{ p[c.key] }}{{ c.unit }}</span>
                    </span>
                    <Slider v-model="p[c.key]" :min="c.min" :max="c.max" />
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">颜色</span>
                    <ColorPicker v-model="color" format="hex" />
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">内阴影 inset</span>
                    <ToggleSwitch v-model="inset" />
                </div>
            </div>
        </div>
    </div>
</template>
