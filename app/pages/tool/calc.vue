<script setup lang="ts">
interface HistoryItem { expr: string, result: string }

const RE_PASTE_STRIP = /[^0-9.+\-*/×÷()^!%πa-z\s]/gi
const RE_STAR = /\*/g
const RE_SLASH = /\//g
const RE_OP_START = /^[+\-×÷^%!]/

const expr = ref('')
const error = ref(false)
const deg = ref(true)
const history = ref<HistoryItem[]>([])
const inputEl = ref<HTMLInputElement>()
const justEvaluated = ref(false)
const topExpr = ref('')

interface Key { l: string, ins?: string, act?: 'clear' | 'back' | 'equals' | 'deg', cls?: 'op' | 'fn' | 'eq' | 'sci', span?: boolean }
// 科学函数区(5 列)
const sciKeys: Key[] = [
    { l: 'sin', ins: 'sin(', cls: 'sci' },
    { l: 'cos', ins: 'cos(', cls: 'sci' },
    { l: 'tan', ins: 'tan(', cls: 'sci' },
    { l: 'ln', ins: 'ln(', cls: 'sci' },
    { l: 'log', ins: 'log(', cls: 'sci' },
    { l: '√', ins: '√(', cls: 'sci' },
    { l: 'x²', ins: '^2', cls: 'sci' },
    { l: 'xʸ', ins: '^', cls: 'sci' },
    { l: 'x!', ins: '!', cls: 'sci' },
    { l: 'abs', ins: 'abs(', cls: 'sci' },
    { l: 'π', ins: 'π', cls: 'sci' },
    { l: 'e', ins: 'e', cls: 'sci' },
    { l: 'mod', ins: '%', cls: 'sci' },
    { l: '(', ins: '(', cls: 'op' },
    { l: ')', ins: ')', cls: 'op' },
]

// 数字区(4 列,经典计算器布局)
const numKeys: Key[] = [
    { l: 'C', act: 'clear', cls: 'fn' },
    { l: '⌫', act: 'back', cls: 'fn' },
    { l: 'DEG', act: 'deg', cls: 'fn' },
    { l: '÷', ins: '÷', cls: 'op' },
    { l: '7', ins: '7' },
    { l: '8', ins: '8' },
    { l: '9', ins: '9' },
    { l: '×', ins: '×', cls: 'op' },
    { l: '4', ins: '4' },
    { l: '5', ins: '5' },
    { l: '6', ins: '6' },
    { l: '−', ins: '-', cls: 'op' },
    { l: '1', ins: '1' },
    { l: '2', ins: '2' },
    { l: '3', ins: '3' },
    { l: '+', ins: '+', cls: 'op' },
    { l: '0', ins: '0' },
    { l: '.', ins: '.' },
    { l: '=', act: 'equals', cls: 'eq', span: true },
]

const btnStyle = {
    num: 'bg-panel border border-line text-ink hover:border-accent',
    op: 'bg-accent/8 border border-transparent text-accent-ink hover:bg-accent/16',
    sci: 'bg-line-soft/40 border border-transparent text-muted hover:bg-line-soft hover:text-ink',
    fn: 'bg-line-soft/70 border border-transparent text-muted hover:bg-line-soft',
    eq: 'bg-accent border border-transparent text-white hover:bg-accent-ink',
}

// 把光标 / 选区定位到指定位置
function setCursor(pos: number) {
    nextTick(() => {
        const el = inputEl.value
        if (!el) {
            return
        }
        el.focus()
        el.setSelectionRange(pos, pos)
    })
}

// 刚算完后的首次输入:运算符 = 在结果上接续,数字 / 函数 = 开始新计算
function consumeAfterEval(text: string): boolean {
    if (!justEvaluated.value) {
        return false
    }
    justEvaluated.value = false
    if (RE_OP_START.test(text)) {
        expr.value += text
        setCursor(expr.value.length)
    } else {
        expr.value = text
        topExpr.value = ''
        setCursor(text.length)
    }
    return true
}

// 在光标处(或替换选区)插入文本
function insertAtCursor(text: string) {
    if (consumeAfterEval(text)) {
        return
    }
    const el = inputEl.value
    const s = el?.selectionStart ?? expr.value.length
    const e = el?.selectionEnd ?? expr.value.length
    expr.value = expr.value.slice(0, s) + text + expr.value.slice(e)
    setCursor(s + text.length)
}

// 删除光标前一字符或选区
function backspace() {
    justEvaluated.value = false
    const el = inputEl.value
    const s = el?.selectionStart ?? expr.value.length
    const e = el?.selectionEnd ?? expr.value.length
    if (s !== e) {
        expr.value = expr.value.slice(0, s) + expr.value.slice(e)
        setCursor(s)
    } else if (s > 0) {
        expr.value = expr.value.slice(0, s - 1) + expr.value.slice(s)
        setCursor(s - 1)
    }
}

function clear() {
    expr.value = ''
    topExpr.value = ''
    justEvaluated.value = false
    setCursor(0)
}

function equals() {
    if (!expr.value) {
        return
    }
    try {
        const result = evalExpr(expr.value, deg.value)
        history.value.unshift({ expr: expr.value, result })
        if (history.value.length > 30) {
            history.value.pop()
        }
        topExpr.value = expr.value
        expr.value = result
        error.value = false
        justEvaluated.value = true
        setCursor(result.length)
    } catch {
        error.value = true
    }
}

function press(k: Key) {
    if (k.act === 'deg') {
        deg.value = !deg.value
    } else if (k.act === 'clear') {
        clear()
    } else if (k.act === 'back') {
        backspace()
    } else if (k.act === 'equals') {
        equals()
    } else if (k.ins) {
        insertAtCursor(k.ins)
    }
}

function useHistory(item: HistoryItem) {
    topExpr.value = item.expr
    expr.value = item.result
    justEvaluated.value = true
    setCursor(item.result.length)
}

// 键盘输入:刚算完时拦截首次按键,套用同样的接续 / 新计算逻辑
function onBeforeInput(e: InputEvent) {
    if (!justEvaluated.value) {
        return
    }
    const data = e.data
    if (data == null) {
        return
    }
    e.preventDefault()
    consumeAfterEval(data === '*' ? '×' : data === '/' ? '÷' : data)
}

function onPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text') ?? ''
    const clean = text.replace(RE_PASTE_STRIP, '').replace(RE_STAR, '×').replace(RE_SLASH, '÷').trim()
    if (clean) {
        insertAtCursor(clean)
    }
}

// 输入变化即清除上一次错误
watch(expr, () => {
    error.value = false
})

onMounted(() => setCursor(0))
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="calc" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
            <!-- 计算器 -->
            <div class="mx-auto flex flex-col gap-4 max-w-460px w-full">
                <!-- 显示屏(可编辑,支持光标定位) -->
                <div class="px-5 py-4 rounded-14px bg-ink overflow-hidden" @click="inputEl?.focus()">
                    <div class="text-13px text-white/40 font-mono flex h-5 items-center justify-between">
                        <span class="text-10px text-accent/90 tracking-wide px-1.5 border border-white/15 rounded">{{ deg ? 'DEG' : 'RAD' }}</span>
                        <span class="truncate">{{ error ? '表达式错误' : (topExpr ? `${topExpr} =` : '') }}</span>
                    </div>
                    <input ref="inputEl"
                        v-model="expr"
                        type="text"
                        inputmode="none"
                        spellcheck="false"
                        autocomplete="off"
                        placeholder="0"
                        class="text-3xl text-white font-500 font-mono text-right outline-none caret-accent bg-transparent w-full placeholder-white/30"
                        :class="error ? 'text-red-300' : ''"
                        @keydown.enter.prevent="equals"
                        @beforeinput="onBeforeInput"
                        @paste.prevent="onPaste">
                </div>

                <!-- 键盘 -->
                <div class="flex flex-col gap-2">
                    <!-- 科学函数区(5 列) -->
                    <div class="gap-1.5 grid grid-cols-5">
                        <button v-for="(k, i) in sciKeys" :key="`s${i}`"
                            class="text-13px font-500 rounded-9px h-10 select-none transition active:scale-95"
                            :class="btnStyle[k.cls ?? 'num']"
                            @click="press(k)">
                            {{ k.l }}
                        </button>
                    </div>
                    <!-- 数字区(4 列) -->
                    <div class="gap-1.5 grid grid-cols-4">
                        <button v-for="(k, i) in numKeys" :key="`n${i}`"
                            class="text-17px font-500 rounded-12px h-13 select-none transition active:scale-95"
                            :class="[btnStyle[k.cls ?? 'num'], k.span ? 'col-span-2' : '']"
                            :title="k.act === 'deg' ? '三角函数单位:DEG 角度 / RAD 弧度,点击切换' : undefined"
                            @click="press(k)">
                            {{ k.act === 'deg' ? (deg ? 'DEG' : 'RAD') : k.l }}
                        </button>
                    </div>
                </div>

                <div class="text-11px text-faint flex flex-col gap-1">
                    <p class="m-0">
                        支持键盘输入、光标定位与粘贴计算式(如 <span class="font-mono">sin(30)+2^10</span>)。
                    </p>
                    <p class="m-0">
                        <b class="text-muted font-mono">DEG</b> 角度 / <b class="text-muted font-mono">RAD</b> 弧度 —— 左上角按钮切换,仅影响三角函数(180° = π 弧度)。
                    </p>
                </div>
            </div>

            <!-- 历史 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-3 h-fit">
                <span class="text-12px text-faint tracking-wide font-mono uppercase">历史</span>
                <p v-if="!history.length" class="text-13px text-faint m-0">
                    暂无记录
                </p>
                <div v-else class="pr-1 flex flex-col gap-1 max-h-120 overflow-y-auto">
                    <button v-for="(item, i) in history" :key="i"
                        class="px-3 py-2 text-right rounded-9px transition hover:bg-line-soft/50"
                        @click="useHistory(item)">
                        <div class="text-11px text-faint font-mono truncate">
                            {{ item.expr }}
                        </div>
                        <div class="text-15px text-ink font-mono truncate">
                            = {{ item.result }}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
