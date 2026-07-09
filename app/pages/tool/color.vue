<script setup lang="ts">
// 颜色工具:HEX / RGB / HSL / OKLCH 互转 + 明暗阶调色板 + WCAG 对比度检查
// h/s/l 为主状态,其余格式由其派生;拾色器与 HEX 输入反向写回 h/s/l

const h = ref(163)
const s = ref(82)
const l = ref(30)

const rgb = computed<Rgb>(() => hslToRgb(h.value, s.value, l.value))
const hex = computed(() => rgbToHex(...rgb.value))

const rgbStr = computed(() => {
    const [r, g, b] = rgb.value
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
})
const hslStr = computed(() => `hsl(${Math.round(h.value)}, ${Math.round(s.value)}%, ${Math.round(l.value)}%)`)
const oklchStr = computed(() => {
    const [L, C, H] = rgbToOklch(...rgb.value)
    return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`
})

const outputs = computed(() => [
    { label: 'HEX', value: hex.value.toUpperCase() },
    { label: 'RGB', value: rgbStr.value },
    { label: 'HSL', value: hslStr.value },
    { label: 'OKLCH', value: oklchStr.value },
])

const hslSliders = [
    { key: 'h', ref: h, label: '色相 H', max: 360, unit: '°' },
    { key: 's', ref: s, label: '饱和 S', max: 100, unit: '%' },
    { key: 'l', ref: l, label: '亮度 L', max: 100, unit: '%' },
] as const

// 明暗阶:固定 h/s,亮度从亮到暗取 10 档
const palette = computed(() => {
    const steps = [95, 88, 78, 66, 54, 42, 32, 24, 16, 9]
    return steps.map(pl => ({ l: pl, hex: rgbToHex(...hslToRgb(h.value, s.value, pl)) }))
})

// 存全精度 HSL(仅显示时取整),保证 HEX 输入可精确还原、不漂移
function applyRgb([r, g, b]: Rgb) {
    const [nh, ns, nl] = rgbToHsl(r, g, b)
    h.value = nh
    s.value = ns
    l.value = nl
}
function setFromHex(input: string) {
    const rgb = hexToRgb(input)
    if (rgb) {
        applyRgb(rgb)
    }
}

// 解析任意 CSS 颜色(HEX / rgb / hsl / 具名 / 浏览器支持的 oklch 等)→ RGB
// HEX 走快速路径;其余交给 canvas fillStyle 归一化,非法值浏览器会忽略(两个哨兵判错)
const RE_RGB_FUNC = /rgba?\(([^)]+)\)/i
const RE_OKLCH = /^oklch\(([^)]+)\)$/i
const RE_SPLIT = /[\s,]+/

// oklch(L C H) → RGB;L/C 支持百分号,H 取度数。显式解析,不依赖浏览器 canvas
function oklchStrToRgb(str: string): Rgb | null {
    const m = RE_OKLCH.exec(str.trim())
    if (!m) {
        return null
    }
    const parts = m[1]!.split('/')[0]!.trim().split(RE_SPLIT).filter(Boolean)
    if (parts.length < 3) {
        return null
    }
    const L = parts[0]!.endsWith('%') ? Number.parseFloat(parts[0]!) / 100 : Number.parseFloat(parts[0]!)
    const cRaw = parts[1]!
    const C = cRaw.endsWith('%') ? Number.parseFloat(cRaw) / 100 * 0.4 : Number.parseFloat(cRaw)
    const H = Number.parseFloat(parts[2]!)
    if ([L, C, H].some(n => Number.isNaN(n))) {
        return null
    }
    return oklchToRgb(L, C, H)
}

let parseCtx: CanvasRenderingContext2D | null = null
function cssColorToRgb(input: string): Rgb | null {
    const str = input.trim()
    if (!str) {
        return null
    }
    const direct = hexToRgb(str)
    if (direct) {
        return direct
    }
    const ok = oklchStrToRgb(str)
    if (ok) {
        return ok
    }
    if (!parseCtx) {
        parseCtx = document.createElement('canvas').getContext('2d')
    }
    if (!parseCtx) {
        return null
    }
    parseCtx.fillStyle = '#000'
    parseCtx.fillStyle = str
    const c1 = parseCtx.fillStyle
    parseCtx.fillStyle = '#fff'
    parseCtx.fillStyle = str
    if (c1 !== parseCtx.fillStyle) {
        return null
    }
    const viaHex = hexToRgb(c1)
    if (viaHex) {
        return viaHex
    }
    const m = RE_RGB_FUNC.exec(c1)
    if (!m) {
        return null
    }
    const p = m[1]!.split(',').map(x => Number.parseFloat(x))
    if (p.length < 3 || p.slice(0, 3).some(n => Number.isNaN(n))) {
        return null
    }
    return [p[0]!, p[1]!, p[2]!]
}

const colorInput = ref(hex.value)
watch(hex, v => (colorInput.value = v.toUpperCase()))
function applyColorInput() {
    const rgb = cssColorToRgb(colorInput.value)
    if (rgb) {
        applyRgb(rgb)
    }
    // 统一回显为规范 HEX(全部格式在输出卡片里可见)
    colorInput.value = hex.value.toUpperCase()
}
function onColorPaste() {
    nextTick(applyColorInput)
}

function useStep(pl: number) {
    l.value = pl
}

const { copy, copied } = useClipboard()
const copiedText = ref('')
function copyVal(v: string) {
    copy(v)
    copiedText.value = v
}

// —— 对比度 ——
const bgHex = ref('#FFFFFF')
const contrast = computed(() => {
    const bg = hexToRgb(bgHex.value) ?? [255, 255, 255] as Rgb
    return contrastRatio(rgb.value, bg)
})
const contrastChecks = computed(() => {
    const c = contrast.value
    return [
        { label: 'AA 正文', pass: c >= 4.5, need: '4.5' },
        { label: 'AA 大字', pass: c >= 3, need: '3' },
        { label: 'AAA 正文', pass: c >= 7, need: '7' },
        { label: 'AAA 大字', pass: c >= 4.5, need: '4.5' },
    ]
})
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="color" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]">
            <!-- 预览 + 输出 -->
            <div class="flex flex-col gap-4 min-w-0">
                <!-- 大色块(点击唤起原生拾色器) -->
                <div class="border border-line rounded-14px h-44 relative overflow-hidden">
                    <div class="h-full w-full" :style="{ background: hex }" />
                    <span class="text-13px text-[#152019] font-mono px-2.5 py-1 rounded-full bg-white/85 bottom-3 left-3 absolute">{{ hex.toUpperCase() }}</span>
                    <input type="color" :value="hex" class="opacity-0 cursor-pointer inset-0 absolute" aria-label="拾色器"
                        @input="setFromHex(($event.target as HTMLInputElement).value)">
                </div>

                <!-- 格式输出 -->
                <div class="border border-line rounded-12px bg-panel overflow-hidden">
                    <div v-for="(o, i) in outputs" :key="o.label"
                        class="px-4 py-2.5 flex gap-3 items-center justify-between"
                        :class="i < outputs.length - 1 ? 'border-b border-line-soft' : ''">
                        <span class="text-11px text-faint tracking-wide font-mono shrink-0 w-14 uppercase">{{ o.label }}</span>
                        <span class="text-13px text-ink font-mono flex-1 truncate">{{ o.value }}</span>
                        <button class="text-12px px-2.5 py-1 border rounded-md shrink-0 transition"
                            :class="copied && copiedText === o.value ? 'text-accent border-accent/40 bg-accent/5' : 'text-muted border-line hover:text-ink'"
                            @click="copyVal(o.value)">
                            {{ copied && copiedText === o.value ? '已复制' : '复制' }}
                        </button>
                    </div>
                </div>

                <!-- 明暗阶 -->
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">明暗阶</span>
                    <div class="border border-line rounded-10px flex h-12 overflow-hidden">
                        <button v-for="p in palette" :key="p.l"
                            class="flex-1 h-full transition hover:flex-[1.4]"
                            :style="{ background: p.hex }"
                            :title="`${p.hex.toUpperCase()} · 点击设为当前`"
                            @click="useStep(p.l)" />
                    </div>
                </div>
            </div>

            <!-- 控制面板 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <!-- 颜色值输入:HEX / rgb() / hsl() / 具名色等,粘贴自动识别 -->
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">颜色值</span>
                    <div class="flex gap-2 items-center">
                        <input type="color" :value="hex" class="border border-line rounded-8px bg-transparent shrink-0 h-9 w-10 cursor-pointer" aria-label="拾色器"
                            @input="setFromHex(($event.target as HTMLInputElement).value)">
                        <input v-model="colorInput" spellcheck="false"
                            class="text-13px text-ink font-mono px-2.5 py-1.5 outline-none border border-line rounded-8px bg-[var(--color-bright-bg)] flex-1 min-w-0 focus:border-accent"
                            placeholder="#0E8C6B / rgb() / hsl()"
                            @keyup.enter="applyColorInput"
                            @paste="onColorPaste"
                            @blur="applyColorInput">
                    </div>
                </div>

                <!-- HSL 滑块 -->
                <div v-for="sl in hslSliders" :key="sl.key" class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">
                        {{ sl.label }} <span class="text-accent-ink">{{ Math.round(sl.ref.value) }}{{ sl.unit }}</span>
                    </span>
                    <Slider v-model="sl.ref.value" :min="0" :max="sl.max" />
                </div>

                <!-- 对比度 -->
                <div class="pt-1 border-t border-line-soft flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">对比度</span>
                        <span class="text-13px text-ink font-mono">{{ contrast.toFixed(2) }} : 1</span>
                    </div>
                    <!-- 前景(当前色)/ 背景预览 -->
                    <div class="border border-line rounded-9px flex h-16 items-center justify-center" :style="{ background: bgHex }">
                        <span class="text-15px font-600" :style="{ color: hex }">示例文字 Aa</span>
                    </div>
                    <div class="flex gap-2 items-center">
                        <span class="text-11px text-faint shrink-0">背景</span>
                        <input v-model="bgHex" type="color" class="border border-line rounded-8px bg-transparent shrink-0 h-8 w-9 cursor-pointer" aria-label="背景色">
                        <input v-model="bgHex" spellcheck="false"
                            class="text-12px text-ink font-mono px-2 py-1.5 outline-none border border-line rounded-8px bg-[var(--color-bright-bg)] flex-1 min-w-0 uppercase focus:border-accent">
                    </div>
                    <div class="gap-1.5 grid grid-cols-2">
                        <div v-for="c in contrastChecks" :key="c.label"
                            class="text-11px px-2 py-1.5 border rounded-8px flex items-center justify-between"
                            :class="c.pass ? 'text-accent-ink border-accent/30 bg-accent/8' : 'text-faint border-line'">
                            <span>{{ c.label }}</span>
                            <span class="font-mono">{{ c.pass ? '通过' : '✕' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
