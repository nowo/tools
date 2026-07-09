<script setup lang="ts">
interface Stop { color: string, pos: number }

const typeOptions = [
    { label: '线性', value: 'linear' },
    { label: '径向', value: 'radial' },
]
const type = ref<'linear' | 'radial'>('linear')
const angle = ref(115)
const stops = ref<Stop[]>([
    { color: '0E8C6B', pos: 0 },
    { color: '7DD9BE', pos: 42 },
    { color: 'F0C36B', pos: 100 },
])

const stopStr = computed(() => stops.value.map(s => `#${s.color} ${s.pos}%`).join(', '))
const gradient = computed(() =>
    type.value === 'linear'
        ? `linear-gradient(${angle.value}deg, ${stopStr.value})`
        : `radial-gradient(circle, ${stopStr.value})`,
)
const cssCode = computed(() => `background: ${gradient.value};`)

function addStop() {
    stops.value.push({ color: 'ffffff', pos: 50 })
}
function removeStop(i: number) {
    if (stops.value.length > 2) {
        stops.value.splice(i, 1)
    }
}
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="gradient" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <!-- 预览 + 代码 -->
            <div class="flex flex-col gap-4 min-w-0">
                <div class="border border-line rounded-14px h-80" :style="{ background: gradient }" />
                <CodeOutput :code="cssCode" />
            </div>

            <!-- 控制面板 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">类型</span>
                    <SelectButton v-model="type" :options="typeOptions" option-label="label" option-value="value" :allow-empty="false" />
                </div>

                <div v-if="type === 'linear'" class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">
                        角度 <span class="text-accent-ink">{{ angle }}°</span>
                    </span>
                    <Slider v-model="angle" :min="0" :max="360" />
                </div>

                <div class="flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">色标</span>
                        <button class="text-12px text-accent px-2 py-0.5 border border-accent/40 rounded-md transition hover:bg-accent/5" @click="addStop">
                            + 添加
                        </button>
                    </div>

                    <div class="pr-1 flex flex-col gap-2.5 max-h-64 overflow-y-auto">
                        <div v-for="(stop, i) in stops" :key="i" class="flex gap-2.5 items-center">
                            <ColorPicker v-model="stop.color" format="hex" />
                            <Slider v-model="stop.pos" :min="0" :max="100" class="flex-1" />
                            <span class="text-11px text-muted font-mono text-right w-9">{{ stop.pos }}%</span>
                            <button class="text-15px text-faint leading-none transition hover:text-ink disabled:opacity-30"
                                :disabled="stops.length <= 2"
                                @click="removeStop(i)">
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
