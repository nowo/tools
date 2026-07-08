<script setup lang="ts">
const typeOptions = [
    { label: '分形', value: 'fractalNoise' },
    { label: '湍流', value: 'turbulence' },
]
const type = ref<'fractalNoise' | 'turbulence'>('fractalNoise')
const grayscale = ref(true)

const sliders = [
    { key: 'freq', label: '频率', min: 0.01, max: 1, step: 0.01, unit: '', digits: 2 },
    { key: 'octaves', label: '八度', min: 1, max: 5, step: 1, unit: '', digits: 0 },
    { key: 'opacity', label: '不透明度', min: 0, max: 100, step: 1, unit: '%', digits: 0 },
] as const

const p = reactive({ freq: 0.65, octaves: 3, opacity: 40 })

const svg = computed(() => {
    const mono = grayscale.value ? `<feColorMatrix type='saturate' values='0'/>` : ''
    return `<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='${type.value}' baseFrequency='${p.freq.toFixed(2)}' numOctaves='${p.octaves}' stitchTiles='stitch'/>${mono}</filter><rect width='100%' height='100%' filter='url(#n)' opacity='${(p.opacity / 100).toFixed(2)}'/></svg>`
})
const bgImage = computed(() => `url("data:image/svg+xml,${encodeURIComponent(svg.value)}")`)
const cssCode = computed(() => `background-image: ${bgImage.value};`)
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="noise" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <!-- 预览 + 代码 -->
            <div class="flex flex-col gap-4 min-w-0">
                <div class="border border-line rounded-14px bg-white h-80" :style="{ backgroundImage: bgImage }" />
                <CodeOutput :code="cssCode" />
            </div>

            <!-- 控制面板 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">类型</span>
                    <SelectButton v-model="type" :options="typeOptions" option-label="label" option-value="value" :allow-empty="false" />
                </div>

                <div v-for="s in sliders" :key="s.key" class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">
                        {{ s.label }} <span class="text-accent-ink">{{ p[s.key].toFixed(s.digits) }}{{ s.unit }}</span>
                    </span>
                    <Slider v-model="p[s.key]" :min="s.min" :max="s.max" :step="s.step" />
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">单色</span>
                    <ToggleSwitch v-model="grayscale" />
                </div>
            </div>
        </div>
    </div>
</template>
