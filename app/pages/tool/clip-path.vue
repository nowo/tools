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
    // 拖动结束:让高亮层对应坐标段闪一下光晕,快速定位改动
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

// —— CSS 直接编辑:textarea 双向同步,实时解析回状态并切换类型 ——
const RE_PREFIX = /^clip-path\s*:/i
const RE_TRAIL = /;+\s*$/
const RE_FN = /^(\w+)\s*\((.*)\)$/s
const RE_NUMS = /-?\d+(?:\.\d+)?/g
const RE_AT = /\s+at\s+/i
const RE_ROUND = /\bround\b(.*)$/i

const draft = ref('')
const parseErr = ref('')
// 聚焦编辑中:此时抑制 shape→text 回写,避免打断光标
const editingCss = ref(false)

function clamp(v: number, max = 100) {
    return Math.min(max, Math.max(0, v))
}
function parsePolygon(inner: string) {
    const pts = inner.split(',').map(s => s.trim()).filter(Boolean).map((seg) => {
        const n = seg.match(RE_NUMS)
        if (!n || n.length < 2) {
            throw new Error(`坐标格式有误:「${seg}」应形如 50% 0`)
        }
        return { x: clamp(Number(n[0])), y: clamp(Number(n[1])) }
    })
    if (pts.length < 3) {
        throw new Error('多边形至少需要 3 个点')
    }
    points.value = pts
    type.value = 'polygon'
}
function parseCircle(inner: string) {
    const [rad, center] = inner.split(RE_AT)
    const r = rad?.match(RE_NUMS)
    if (!r) {
        throw new Error('circle 半径需为数值,如 circle(45% at 50% 50%)')
    }
    circle.r = clamp(Math.round(Number(r[0])))
    const c = center?.match(RE_NUMS)
    if (c && c.length >= 2) {
        circle.cx = clamp(Math.round(Number(c[0])))
        circle.cy = clamp(Math.round(Number(c[1])))
    }
    type.value = 'circle'
}
function parseEllipse(inner: string) {
    const [rad, center] = inner.split(RE_AT)
    const r = rad?.match(RE_NUMS)
    if (!r || r.length < 2) {
        throw new Error('ellipse 需两个半径,如 ellipse(45% 30% at 50% 50%)')
    }
    ellipse.rx = clamp(Math.round(Number(r[0])))
    ellipse.ry = clamp(Math.round(Number(r[1])))
    const c = center?.match(RE_NUMS)
    if (c && c.length >= 2) {
        ellipse.cx = clamp(Math.round(Number(c[0])))
        ellipse.cy = clamp(Math.round(Number(c[1])))
    }
    type.value = 'ellipse'
}
function parseInset(inner: string) {
    let main = inner
    const rm = RE_ROUND.exec(inner)
    let round = 0
    if (rm) {
        main = inner.slice(0, rm.index)
        const rn = rm[1]!.match(RE_NUMS)
        if (rn) {
            round = Number(rn[0])
        }
    }
    const nums = main.match(RE_NUMS)?.map(Number)
    if (!nums || nums.length < 1) {
        throw new Error('inset 至少需要 1 个数值')
    }
    // CSS 简写:1→四边,2→上下/左右,3→上/左右/下,4→上/右/下/左
    let t: number, r: number, b: number, l: number
    if (nums.length === 1) {
        t = r = b = l = nums[0]!
    } else if (nums.length === 2) {
        t = b = nums[0]!
        r = l = nums[1]!
    } else if (nums.length === 3) {
        t = nums[0]!
        r = l = nums[1]!
        b = nums[2]!
    } else {
        [t, r, b, l] = nums as [number, number, number, number]
    }
    inset.top = clamp(Math.round(t), 50)
    inset.right = clamp(Math.round(r), 50)
    inset.bottom = clamp(Math.round(b), 50)
    inset.left = clamp(Math.round(l), 50)
    inset.round = clamp(Math.round(round), 50)
    type.value = 'inset'
}
// 解析并应用到 shape,返回错误信息(成功为空串)
function applyCss(text: string): string {
    const s = text.trim().replace(RE_PREFIX, '').replace(RE_TRAIL, '').trim()
    if (!s) {
        return '内容为空'
    }
    const m = RE_FN.exec(s)
    if (!m) {
        return '无法解析,应形如 polygon(…) / circle(…) / ellipse(…) / inset(…)'
    }
    const fn = m[1]!.toLowerCase()
    const inner = m[2]!.trim()
    try {
        if (fn === 'polygon') {
            parsePolygon(inner)
        } else if (fn === 'circle') {
            parseCircle(inner)
        } else if (fn === 'ellipse') {
            parseEllipse(inner)
        } else if (fn === 'inset') {
            parseInset(inner)
        } else {
            throw new Error(`不支持的类型:${fn}`)
        }
        return ''
    } catch (err) {
        return (err as Error).message
    }
}

// shape 变化(拖动 / 滑块 / 预设 / 切类型)→ 回写 textarea,仅在未聚焦编辑时
watch(cssCode, (v) => {
    if (!editingCss.value) {
        draft.value = v
    }
}, { immediate: true })

// 编辑 textarea → 防抖实时解析应用(仅聚焦编辑时,避免程序化回写触发)
watchDebounced(draft, (v) => {
    if (editingCss.value) {
        parseErr.value = applyCss(v)
    }
}, { debounce: 300 })

function onCssFocus() {
    editingCss.value = true
}
function onCssBlur() {
    editingCss.value = false
    parseErr.value = ''
    // 失焦:应用最新输入(补上未及防抖的那次),再规范化为标准 CSS
    applyCss(draft.value)
    draft.value = cssCode.value
}

// 语法高亮:对 textarea 里的原始文本本身着色(逐字符对齐,输入过程也不错位)
// polygon 的每对坐标按序号取节点同色;其他类型保持默认 ink 色
const RE_HL_AMP = /&/g
const RE_HL_LT = /</g
const RE_HL_GT = />/g
const RE_HL_POLY = /^([\s\S]*?polygon\s*\()([\s\S]*)$/i
const RE_HL_TAIL = /\)\s*(?:;\s*)?$/
const RE_HL_COMMA = /(,)/
function escapeHtml(s: string) {
    return s.replace(RE_HL_AMP, '&amp;').replace(RE_HL_LT, '&lt;').replace(RE_HL_GT, '&gt;')
}
const highlighted = computed(() => {
    const text = draft.value
    const m = RE_HL_POLY.exec(text)
    if (!m) {
        return escapeHtml(text)
    }
    const prefix = m[1]!
    let inner = m[2]!
    let suffix = ''
    const tail = RE_HL_TAIL.exec(inner)
    if (tail) {
        suffix = inner.slice(tail.index)
        inner = inner.slice(0, tail.index)
    }
    let idx = 0
    const colored = inner.split(RE_HL_COMMA).map((part) => {
        if (part === ',' || part.trim() === '') {
            return escapeHtml(part)
        }
        const i = idx++
        const cls = i === flashIndex.value ? ' class="seg-flash"' : ''
        return `<span${cls} style="color:${colorOf(i)}">${escapeHtml(part)}</span>`
    }).join('')
    return escapeHtml(prefix) + colored + escapeHtml(suffix)
})
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
                <!-- CSS:始终可直接编辑,双向实时同步;可全选、粘贴任意 clip-path -->
                <div class="border border-line rounded-12px bg-panel overflow-hidden">
                    <div class="px-4 py-2.5 border-b border-line-soft flex items-center justify-between">
                        <span class="text-11px text-faint tracking-wide font-mono uppercase">CSS · 可编辑</span>
                        <button class="text-12px px-2.5 py-1 border rounded-md inline-flex gap-1.5 transition items-center"
                            :class="copied ? 'text-accent border-accent/40 bg-accent/5' : 'text-muted border-line hover:text-ink'"
                            @click="copy(cssCode)">
                            {{ copied ? '已复制' : '复制' }}
                        </button>
                    </div>
                    <!-- 透明 textarea 叠在彩色 pre 上:始终有颜色,又保留原生编辑/全选/光标 -->
                    <div class="ce-wrap">
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <pre class="ce-layer ce-pre" aria-hidden="true" v-html="highlighted" />
                        <textarea v-model="draft" spellcheck="false"
                            class="ce-layer ce-input"
                            @focus="onCssFocus"
                            @blur="onCssBlur" />
                    </div>
                    <p class="text-11px text-faint leading-relaxed m-0 px-4 pb-3" :class="parseErr ? '!text-[#e2463f]' : ''">
                        {{ parseErr || '可直接编辑或粘贴 clip-path,支持 polygon / circle / ellipse / inset,自动切换类型。' }}
                    </p>
                </div>
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
                        拖动彩色节点调整形状,<b class="text-muted">双击</b>节点删除(保留至少 3 个)。也可在下方 CSS 框直接编辑。
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
/* 彩色高亮层与输入层严格同字体 / 同内边距 / 同换行,确保逐字符对齐 */
.ce-wrap {
    position: relative;
}
.ce-layer {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 14px 16px;
    border: 0;
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 13px;
    line-height: 1.6;
    letter-spacing: 0;
    tab-size: 2;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
}
.ce-pre {
    min-height: 3.4em;
    color: var(--color-ink);
    pointer-events: none;
}
.ce-input {
    position: absolute;
    inset: 0;
    height: 100%;
    resize: none;
    overflow: hidden;
    background: transparent;
    color: transparent;
    caret-color: var(--color-ink);
    -webkit-text-fill-color: transparent;
    outline: none;
}
.ce-input::selection {
    /* 选区高亮盖在彩色文字上,全选可见 */
    background: color-mix(in srgb, var(--color-accent) 26%, transparent);
}

/* 拖动松手后,高亮层对应坐标段用该段颜色闪一下光晕(v-html 注入,需 :deep 穿透) */
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
.ce-pre :deep(.seg-flash) {
    border-radius: 4px;
    animation: segFlash 0.8s ease-out;
}
</style>
