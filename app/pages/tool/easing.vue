<script setup lang="ts">
// 缓动曲线 cubic-bezier 编辑器:拖拽两个控制点画曲线,实时小球预览
// P0(0,0) P3(1,1) 固定;x 限 [0,1],y 可超出(回弹/过冲)。SVG 内 y 翻转、坐标 *100

const p1 = reactive({ x: 0.25, y: 0.1 })
const p2 = reactive({ x: 0.25, y: 1 })
const duration = ref(1)
const svgEl = ref<SVGSVGElement>()
const dragging = ref<'p1' | 'p2' | ''>('')

const presets: { name: string, v: [number, number, number, number] }[] = [
    { name: 'linear', v: [0, 0, 1, 1] },
    { name: 'ease', v: [0.25, 0.1, 0.25, 1] },
    { name: 'ease-in', v: [0.42, 0, 1, 1] },
    { name: 'ease-out', v: [0, 0, 0.58, 1] },
    { name: 'ease-in-out', v: [0.42, 0, 0.58, 1] },
    { name: 'in-sine', v: [0.12, 0, 0.39, 0] },
    { name: 'out-sine', v: [0.61, 1, 0.88, 1] },
    { name: 'in-out-cubic', v: [0.65, 0, 0.35, 1] },
    { name: 'in-quart', v: [0.5, 0, 0.75, 0] },
    { name: 'out-quart', v: [0.25, 1, 0.5, 1] },
    { name: 'in-back', v: [0.36, 0, 0.66, -0.56] },
    { name: 'out-back', v: [0.34, 1.56, 0.64, 1] },
    { name: 'in-out-back', v: [0.68, -0.6, 0.32, 1.6] },
]

const numFields = [
    { key: 'x1', obj: p1, prop: 'x', min: 0, max: 1 },
    { key: 'y1', obj: p1, prop: 'y', min: -2, max: 2 },
    { key: 'x2', obj: p2, prop: 'x', min: 0, max: 1 },
    { key: 'y2', obj: p2, prop: 'y', min: -2, max: 2 },
] as const

function fmt(n: number) {
    return String(Math.round(n * 1000) / 1000)
}
const bezier = computed(() => `cubic-bezier(${fmt(p1.x)}, ${fmt(p1.y)}, ${fmt(p2.x)}, ${fmt(p2.y)})`)
const cssCode = computed(() => `transition: all ${duration.value}s ${bezier.value};`)

// easing 坐标 → SVG 用户坐标(0..100,y 翻转)
function sx(x: number) {
    return x * 100
}
function sy(y: number) {
    return 100 - y * 100
}
const curvePath = computed(() => `M 0 100 C ${sx(p1.x)} ${sy(p1.y)}, ${sx(p2.x)} ${sy(p2.y)}, 100 0`)

function toEasing(e: PointerEvent) {
    const svg = svgEl.value
    const ctm = svg?.getScreenCTM()
    if (!svg || !ctm) {
        return null
    }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(ctm.inverse())
    return {
        x: Math.min(1, Math.max(0, p.x / 100)),
        y: Math.min(1.4, Math.max(-0.4, (100 - p.y) / 100)),
    }
}
function onDown(which: 'p1' | 'p2', e: PointerEvent) {
    dragging.value = which
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
}
function onMove(e: PointerEvent) {
    if (!dragging.value) {
        return
    }
    const pos = toEasing(e)
    if (!pos) {
        return
    }
    const t = dragging.value === 'p1' ? p1 : p2
    t.x = Math.round(pos.x * 1000) / 1000
    t.y = Math.round(pos.y * 1000) / 1000
}
function onUp() {
    dragging.value = ''
}

function setPreset(v: readonly number[]) {
    p1.x = v[0]!
    p1.y = v[1]!
    p2.x = v[2]!
    p2.y = v[3]!
}
function setNum(f: typeof numFields[number], e: Event) {
    const raw = Number.parseFloat((e.target as HTMLInputElement).value)
    if (Number.isNaN(raw)) {
        return
    }
    const v = Math.min(f.max, Math.max(f.min, raw))
    ;(f.obj as Record<string, number>)[f.prop] = Math.round(v * 1000) / 1000
}

const { copy, copied } = useClipboard()
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="easing" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
            <!-- 曲线 + 预览 + 代码 -->
            <div class="flex flex-col gap-4 min-w-0">
                <!-- 曲线编辑区 -->
                <div class="mx-auto p-3 border border-line rounded-14px bg-ground max-w-300px w-full touch-none">
                    <svg ref="svgEl" viewBox="-8 -48 116 196" class="w-full overflow-visible"
                        @pointermove="onMove" @pointerup="onUp">
                        <!-- 单位方格 + 网格 -->
                        <rect x="0" y="0" width="100" height="100" fill="none" stroke="var(--color-line-soft)" stroke-width="0.6" />
                        <line v-for="g in [25, 50, 75]" :key="`v${g}`" :x1="g" y1="0" :x2="g" y2="100" stroke="var(--color-line-soft)" stroke-width="0.4" stroke-dasharray="2 2" />
                        <line v-for="g in [25, 50, 75]" :key="`h${g}`" x1="0" :y1="g" x2="100" :y2="g" stroke="var(--color-line-soft)" stroke-width="0.4" stroke-dasharray="2 2" />
                        <!-- 线性参考对角线 -->
                        <line x1="0" y1="100" x2="100" y2="0" stroke="var(--color-line)" stroke-width="0.5" stroke-dasharray="3 3" />
                        <!-- 控制杆 -->
                        <line x1="0" y1="100" :x2="sx(p1.x)" :y2="sy(p1.y)" stroke="#0E8C6B" stroke-width="0.8" vector-effect="non-scaling-stroke" opacity="0.5" />
                        <line x1="100" y1="0" :x2="sx(p2.x)" :y2="sy(p2.y)" stroke="#e8802b" stroke-width="0.8" vector-effect="non-scaling-stroke" opacity="0.5" />
                        <!-- 曲线 -->
                        <path :d="curvePath" fill="none" stroke="var(--color-ink)" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-linecap="round" />
                        <!-- 端点 -->
                        <circle cx="0" cy="100" r="1.6" fill="var(--color-faint)" />
                        <circle cx="100" cy="0" r="1.6" fill="var(--color-faint)" />
                        <!-- 可拖拽控制点 -->
                        <circle :cx="sx(p1.x)" :cy="sy(p1.y)" r="4" fill="#0E8C6B" stroke="white" stroke-width="1.2"
                            class="cursor-grab touch-none active:cursor-grabbing" @pointerdown="onDown('p1', $event)" @pointermove="onMove" @pointerup="onUp" />
                        <circle :cx="sx(p2.x)" :cy="sy(p2.y)" r="4" fill="#e8802b" stroke="white" stroke-width="1.2"
                            class="cursor-grab touch-none active:cursor-grabbing" @pointerdown="onDown('p2', $event)" @pointermove="onMove" @pointerup="onUp" />
                    </svg>
                </div>

                <!-- 小球预览:缓动(实)对比 linear(虚影) -->
                <div class="p-4 border border-line rounded-14px bg-panel flex flex-col gap-3">
                    <div class="track h-7 relative">
                        <div class="ball ghost" :style="{ animationDuration: `${duration}s` }" />
                        <div class="ball eased" :style="{ animationDuration: `${duration}s`, animationTimingFunction: bezier }" />
                    </div>
                    <p class="text-11px text-faint m-0">
                        <span class="mr-1 rounded-full bg-accent h-2 w-2 inline-block" />当前缓动
                        <span class="ml-3 mr-1 rounded-full bg-faint/40 h-2 w-2 inline-block" />linear 参考
                    </p>
                </div>

                <!-- 代码 -->
                <CodeOutput :code="cssCode" />
            </div>

            <!-- 控制面板 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <!-- 数值 -->
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">控制点</span>
                    <div class="gap-2 grid grid-cols-2">
                        <label v-for="f in numFields" :key="f.key" class="flex gap-1.5 items-center">
                            <span class="text-11px text-faint font-mono w-4">{{ f.key }}</span>
                            <input type="number" :value="f.obj[f.prop]" :min="f.min" :max="f.max" step="0.01"
                                class="text-13px text-ink font-mono px-2 py-1.5 outline-none border border-line rounded-8px bg-[var(--color-bright-bg)] min-w-0 w-full focus:border-accent"
                                @input="setNum(f, $event)">
                        </label>
                    </div>
                    <p class="text-11px text-faint leading-relaxed m-0">
                        拖动 <span class="text-accent-ink">绿</span> / <span style="color:#e8802b">橙</span> 控制点,或直接改数值。y 可超出 0~1 做回弹。
                    </p>
                </div>

                <!-- 时长 -->
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">
                        时长 <span class="text-accent-ink">{{ duration }}s</span>
                    </span>
                    <Slider v-model="duration" :min="0.2" :max="3" :step="0.1" />
                </div>

                <!-- 预设 -->
                <div class="flex flex-col gap-2.5">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">预设</span>
                    <div class="gap-2 grid grid-cols-2">
                        <button v-for="preset in presets" :key="preset.name"
                            class="text-12px text-ink font-mono px-2 py-1.5 border border-line rounded-9px transition hover:text-accent hover:border-accent"
                            @click="setPreset(preset.v)">
                            {{ preset.name }}
                        </button>
                    </div>
                </div>

                <button class="text-12px text-muted px-2.5 py-1 border border-line rounded-md transition self-start hover:text-ink"
                    :class="copied ? 'text-accent border-accent/40 bg-accent/5' : ''"
                    @click="copy(bezier)">
                    {{ copied ? '已复制' : '复制 cubic-bezier()' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ball {
    position: absolute;
    top: 50%;
    height: 1.25rem;
    width: 1.25rem;
    margin-top: -0.625rem;
    border-radius: 9999px;
    animation-name: bez-move;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: linear;
}
.ball.eased {
    background: var(--color-accent);
}
.ball.ghost {
    background: color-mix(in srgb, var(--color-faint) 40%, transparent);
}
@keyframes bez-move {
    from {
        left: 0;
        transform: translateX(0);
    }
    to {
        left: 100%;
        transform: translateX(-100%);
    }
}
@media (prefers-reduced-motion: reduce) {
    .ball {
        animation: none;
    }
}
</style>
