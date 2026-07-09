<script setup lang="ts">
interface Pt { x: number, y: number }
type ClipType = 'polygon' | 'circle' | 'ellipse' | 'inset'

const typeOptions = [
    { label: '多边形', value: 'polygon' },
    { label: '圆', value: 'circle' },
    { label: '椭圆', value: 'ellipse' },
    { label: '矩形', value: 'inset' },
]
const type = ref<ClipType>('polygon')

// —— 多边形 ——
const presets: { name: string, pts: [number, number][] }[] = [
    { name: '三角', pts: [[50, 0], [100, 100], [0, 100]] },
    { name: '菱形', pts: [[50, 0], [100, 50], [50, 100], [0, 50]] },
    { name: '梯形', pts: [[20, 0], [80, 0], [100, 100], [0, 100]] },
    { name: '平行四边形', pts: [[25, 0], [100, 0], [75, 100], [0, 100]] },
    { name: '五边形', pts: [[50, 0], [100, 38], [82, 100], [18, 100], [0, 38]] },
    { name: '六边形', pts: [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]] },
    { name: '七边形', pts: [[50, 0], [90, 20], [100, 60], [75, 100], [25, 100], [0, 60], [10, 20]] },
    { name: '八边形', pts: [[30, 0], [70, 0], [100, 30], [100, 70], [70, 100], [30, 100], [0, 70], [0, 30]] },
    { name: '切角矩形', pts: [[10, 0], [90, 0], [100, 10], [100, 90], [90, 100], [10, 100], [0, 90], [0, 10]] },
    { name: '星形', pts: [[50, 0], [61, 35], [98, 35], [68, 57], [79, 91], [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]] },
    { name: '十字', pts: [[35, 0], [65, 0], [65, 35], [100, 35], [100, 65], [65, 65], [65, 100], [35, 100], [35, 65], [0, 65], [0, 35], [35, 35]] },
    { name: '闪电', pts: [[50, 0], [0, 60], [40, 60], [25, 100], [75, 40], [40, 40]] },
    { name: '气泡', pts: [[0, 0], [100, 0], [100, 75], [75, 75], [75, 100], [50, 75], [0, 75]] },
    { name: '右箭头', pts: [[40, 0], [40, 20], [100, 20], [100, 80], [40, 80], [40, 100], [0, 50]] },
    { name: '左箭头', pts: [[60, 0], [60, 20], [0, 20], [0, 80], [60, 80], [60, 100], [100, 50]] },
]
const points = ref<Pt[]>(presets[4]!.pts.map(([x, y]) => ({ x, y })))
const containerEl = ref<HTMLElement>()
const dragging = ref(-1)
const flashIndex = ref(-1)

// —— 圆 / 椭圆 / 内矩形 ——
const circle = reactive({ r: 45, cx: 50, cy: 50 })
const ellipse = reactive({ rx: 45, ry: 30, cx: 50, cy: 50 })
const inset = reactive({ top: 12, right: 12, bottom: 12, left: 12, round: 0 })

const circleSliders = [
    { key: 'r', label: '半径', max: 100 },
    { key: 'cx', label: '圆心 X', max: 100 },
    { key: 'cy', label: '圆心 Y', max: 100 },
] as const
const ellipseSliders = [
    { key: 'rx', label: '横半径', max: 100 },
    { key: 'ry', label: '纵半径', max: 100 },
    { key: 'cx', label: '圆心 X', max: 100 },
    { key: 'cy', label: '圆心 Y', max: 100 },
] as const
const insetSliders = [
    { key: 'top', label: '上', max: 50 },
    { key: 'right', label: '右', max: 50 },
    { key: 'bottom', label: '下', max: 50 },
    { key: 'left', label: '左', max: 50 },
    { key: 'round', label: '圆角', max: 50 },
] as const

const clipValue = computed(() => {
    if (type.value === 'circle') {
        return `circle(${circle.r}% at ${circle.cx}% ${circle.cy}%)`
    }
    if (type.value === 'ellipse') {
        return `ellipse(${ellipse.rx}% ${ellipse.ry}% at ${ellipse.cx}% ${ellipse.cy}%)`
    }
    if (type.value === 'inset') {
        const round = inset.round > 0 ? ` round ${inset.round}%` : ''
        return `inset(${inset.top}% ${inset.right}% ${inset.bottom}% ${inset.left}%${round})`
    }
    return `polygon(${points.value.map(p => `${p.x}% ${p.y}%`).join(', ')})`
})
const svgPoints = computed(() => points.value.map(p => `${p.x},${p.y}`).join(' '))
const cssCode = computed(() => `clip-path: ${clipValue.value};`)

// 预览背景网格:5% 虚线(line-soft)+ 10% 实线(line),辅助把节点对到整值
interface GridLine { x1: number, y1: number, x2: number, y2: number, major: boolean }
const gridLines: GridLine[] = (() => {
    const arr: GridLine[] = []
    for (let v = 5; v < 100; v += 5) {
        const major = v % 10 === 0
        arr.push({ x1: v, y1: 0, x2: v, y2: 100, major })
        arr.push({ x1: 0, y1: v, x2: 100, y2: v, major })
    }
    return arr
})()

// 节点配色:每个节点一个颜色,CSS 坐标段同色联动
const colors = ['#e2463f', '#e8802b', '#d9a520', '#4fae4f', '#0e8c6b', '#3b82c4', '#7b5cd6', '#c4519e', '#0f9e9e', '#9a6a3a']
function colorOf(i: number) {
    return colors[i % colors.length]!
}
const { copy, copied } = useClipboard()

function setPreset(pts: [number, number][]) {
    points.value = pts.map(([x, y]) => ({ x, y }))
}
function clampPct(v: number) {
    return Math.min(100, Math.max(0, Math.round(v)))
}
function onDown(i: number, e: PointerEvent) {
    dragging.value = i
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onMove(e: PointerEvent) {
    const p = points.value[dragging.value]
    if (dragging.value < 0 || !containerEl.value || !p) {
        return
    }
    const r = containerEl.value.getBoundingClientRect()
    p.x = clampPct(((e.clientX - r.left) / r.width) * 100)
    p.y = clampPct(((e.clientY - r.top) / r.height) * 100)
}
function onUp() {
    const i = dragging.value
    dragging.value = -1
    if (i < 0) {
        return
    }
    // 拖动结束:让 CSS 对应坐标段闪一下光晕,快速定位改动
    flashIndex.value = -1
    nextTick(() => {
        flashIndex.value = i
        setTimeout(() => {
            if (flashIndex.value === i) {
                flashIndex.value = -1
            }
        }, 800)
    })
}
function removePoint(i: number) {
    if (points.value.length > 3) {
        points.value.splice(i, 1)
    }
}
function addPoint() {
    const a = points.value[0]!
    const b = points.value[1] ?? a
    points.value.splice(1, 0, { x: Math.round((a.x + b.x) / 2), y: Math.round((a.y + b.y) / 2) })
}
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="clip-path" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
            <!-- 预览 + 代码 -->
            <div class="flex flex-col gap-4 min-w-0">
                <div ref="containerEl"
                    class="mx-auto border border-line rounded-14px bg-ground max-w-440px w-full aspect-square relative touch-none">
                    <!-- 背景网格:5% 虚线 + 10% 实线,辅助对齐 -->
                    <svg class="rounded-14px h-full w-full pointer-events-none inset-0 absolute" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line v-for="(l, i) in gridLines" :key="i"
                            :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
                            :stroke="l.major ? 'var(--color-line)' : 'var(--color-line-soft)'"
                            :stroke-dasharray="l.major ? undefined : '2 2'"
                            stroke-width="0.3" />
                    </svg>
                    <!-- 被裁剪的图形:单独一层裹住做圆角裁剪,手柄层不裁,避免边缘节点被切 -->
                    <div class="rounded-14px inset-0 absolute overflow-hidden">
                        <div class="inset-0 absolute" style="background:linear-gradient(135deg,#0E8C6B,#7DD9BE 55%,#F0C36B)" :style="{ clipPath: clipValue }" />
                    </div>
                    <!-- 多边形专属:轮廓 + 可拖拽节点 -->
                    <template v-if="type === 'polygon'">
                        <svg class="h-full w-full pointer-events-none inset-0 absolute overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <polygon :points="svgPoints" fill="none" stroke="#0E8C6B" stroke-width="0.6" vector-effect="non-scaling-stroke" stroke-dasharray="2 2" />
                        </svg>
                        <div v-for="(p, i) in points" :key="i"
                            class="border-2 border-white rounded-full h-3.5 w-3.5 cursor-grab shadow-sm absolute touch-none active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 hover:scale-125"
                            :style="{ left: `${p.x}%`, top: `${p.y}%`, background: colorOf(i) }"
                            title="拖动调整,双击删除"
                            @pointerdown="onDown(i, $event)"
                            @pointermove="onMove"
                            @pointerup="onUp"
                            @dblclick="removePoint(i)" />
                    </template>
                </div>
                <!-- 多边形:CSS 坐标段与节点同色联动;其他类型用普通输出 -->
                <div v-if="type === 'polygon'" class="border border-line rounded-12px bg-panel overflow-hidden">
                    <div class="px-4 py-2.5 border-b border-line-soft flex items-center justify-between">
                        <span class="text-11px text-faint tracking-wide font-mono uppercase">CSS</span>
                        <button class="text-12px px-2.5 py-1 border rounded-md inline-flex gap-1.5 transition items-center"
                            :class="copied ? 'text-accent border-accent/40 bg-accent/5' : 'text-muted border-line hover:text-ink'"
                            @click="copy(cssCode)">
                            {{ copied ? '已复制' : '复制' }}
                        </button>
                    </div>
                    <pre class="text-13px text-ink leading-relaxed font-mono m-0 px-4 py-3.5 overflow-x-auto">clip-path: polygon(<template v-for="(p, i) in points" :key="i"><span :class="flashIndex === i ? 'seg-flash' : ''" :style="{ color: colorOf(i) }">{{ p.x }}% {{ p.y }}%</span><template v-if="i < points.length - 1">, </template></template>);</pre>
                </div>
                <CodeOutput v-else :code="cssCode" />
            </div>

            <!-- 控制面板 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">类型</span>
                    <SelectButton v-model="type" :options="typeOptions" option-label="label" option-value="value" :allow-empty="false" />
                </div>

                <!-- 多边形 -->
                <template v-if="type === 'polygon'">
                    <div class="flex flex-col gap-2.5">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">预设形状</span>
                        <div class="gap-2 grid grid-cols-2">
                            <button v-for="preset in presets" :key="preset.name"
                                class="text-13px text-ink px-2 py-1.5 border border-line rounded-9px transition hover:text-accent hover:border-accent"
                                @click="setPreset(preset.pts)">
                                {{ preset.name }}
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">节点 {{ points.length }}</span>
                        <button class="text-12px text-accent px-2 py-0.5 border border-accent/40 rounded-md transition hover:bg-accent/5" @click="addPoint">
                            + 加点
                        </button>
                    </div>
                    <p class="text-11px text-faint leading-relaxed m-0">
                        拖动彩色节点调整形状(松手后 CSS 对应段会闪光提示),<b class="text-muted">双击</b>节点删除(保留至少 3 个)。
                    </p>
                </template>

                <!-- 圆 -->
                <template v-else-if="type === 'circle'">
                    <div v-for="s in circleSliders" :key="s.key" class="flex flex-col gap-2">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">
                            {{ s.label }} <span class="text-accent-ink">{{ circle[s.key] }}%</span>
                        </span>
                        <Slider v-model="circle[s.key]" :min="0" :max="s.max" />
                    </div>
                </template>

                <!-- 椭圆 -->
                <template v-else-if="type === 'ellipse'">
                    <div v-for="s in ellipseSliders" :key="s.key" class="flex flex-col gap-2">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">
                            {{ s.label }} <span class="text-accent-ink">{{ ellipse[s.key] }}%</span>
                        </span>
                        <Slider v-model="ellipse[s.key]" :min="0" :max="s.max" />
                    </div>
                </template>

                <!-- 内矩形 -->
                <template v-else>
                    <div v-for="s in insetSliders" :key="s.key" class="flex flex-col gap-2">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">
                            {{ s.label }} <span class="text-accent-ink">{{ inset[s.key] }}%</span>
                        </span>
                        <Slider v-model="inset[s.key]" :min="0" :max="s.max" />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 拖动结束后,CSS 对应坐标段用该段颜色闪一下光晕 */
@keyframes segFlash {
    0% {
        box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 35%, transparent);
        background: color-mix(in srgb, currentColor 22%, transparent);
    }
    100% {
        box-shadow: 0 0 0 3px transparent;
        background: transparent;
    }
}
.seg-flash {
    border-radius: 4px;
    animation: segFlash 0.8s ease-out;
}
</style>
