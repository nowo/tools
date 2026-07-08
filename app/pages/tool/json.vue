<script setup lang="ts">
interface Field { key: string, value: string }

const RE_NUM_LITERAL = /^-?\d+(?:\.\d+)?$/
const RE_QUOTE = /'/g
const exampleTag = '{{email()}}'

// 可点击插入的函数(fx Popover),带签名 / 说明 / 默认值
interface FuncItem { label: string, tag: string, sig: string, desc: string, def?: string }
const funcs: FuncItem[] = [
    { label: 'UUID', tag: '{{guid()}}', sig: 'guid()', desc: '随机 UUID' },
    { label: 'ObjectId', tag: '{{objectId()}}', sig: 'objectId()', desc: 'MongoDB ObjectId' },
    { label: '索引', tag: '{{index()}}', sig: 'index()', desc: '当前行序号(从 0 起)' },
    { label: '姓名', tag: '{{name()}}', sig: 'name()', desc: '全名' },
    { label: '名', tag: '{{firstName()}}', sig: 'firstName()', desc: '名' },
    { label: '姓', tag: '{{surname()}}', sig: 'surname()', desc: '姓' },
    { label: '邮箱', tag: '{{email()}}', sig: 'email()', desc: '邮箱地址' },
    { label: '用户名', tag: '{{username()}}', sig: 'username()', desc: '用户名' },
    { label: '手机', tag: '{{phone()}}', sig: 'phone()', desc: '电话号码' },
    { label: '整数', tag: '{{integer(1, 100)}}', sig: 'integer(min, max)', desc: '区间随机整数', def: '默认 0 ~ 100' },
    { label: '小数', tag: '{{floating(1, 100, 2)}}', sig: 'floating(min, max, decimals)', desc: '区间随机小数', def: 'decimals 默认 2 位' },
    { label: '布尔', tag: '{{bool()}}', sig: 'bool()', desc: 'true / false' },
    { label: '随机选', tag: '{{random("a", "b", "c")}}', sig: 'random(...items)', desc: '从列表随机选一个' },
    { label: '句子', tag: '{{lorem(1, "sentences")}}', sig: 'lorem(count, unit)', desc: 'Lorem 文本', def: 'unit: words / sentences / paragraphs' },
    { label: '单词', tag: '{{lorem(2, "words")}}', sig: 'lorem(count, "words")', desc: 'N 个单词' },
    { label: '日期', tag: '{{date()}}', sig: 'date(min?, max?)', desc: 'ISO 日期时间', def: '不传参为随机过去时间' },
    { label: '城市', tag: '{{city()}}', sig: 'city()', desc: '城市名' },
    { label: '国家', tag: '{{country()}}', sig: 'country()', desc: '国家名' },
    { label: '公司', tag: '{{company()}}', sig: 'company()', desc: '公司名' },
    { label: '颜色', tag: '{{color()}}', sig: 'color()', desc: 'RGB 十六进制' },
    { label: 'URL', tag: '{{url()}}', sig: 'url()', desc: '网址' },
]

const fields = ref<Field[]>([
    { key: 'id', value: '{{index()}}' },
    { key: '_id', value: '{{objectId()}}' },
    { key: 'name', value: '{{name()}}' },
    { key: 'email', value: '{{email()}}' },
    { key: 'age', value: '{{integer(18, 60)}}' },
    { key: 'active', value: '{{bool()}}' },
])
const count = ref(5)
const template = ref('')
const output = ref('')
const templateError = ref('')

// 值 → 模板片段:空=默认 null;含 {{}}=函数(字符串包裹);数字/布尔=字面;其余=静态字符串
function valueToTpl(v: string): string {
    const s = v.trim()
    if (!s) {
        return 'null'
    }
    if (s.includes('{{')) {
        return `'${s.replace(RE_QUOTE, '\\\'')}'`
    }
    if (s === 'true' || s === 'false' || RE_NUM_LITERAL.test(s)) {
        return s
    }
    return `'${s.replace(RE_QUOTE, '\\\'')}'`
}

// 字段 → 模板(json-generator 格式)
function buildTemplate() {
    const entries = fields.value
        .map(f => `    ${f.key || 'field'}: ${valueToTpl(f.value)}`)
        .join(',\n')
    template.value = `[\n  '{{repeat(${count.value})}}',\n  {\n${entries}\n  }\n]`
}

function genOutput() {
    try {
        output.value = generateFromTemplate(template.value)
        templateError.value = ''
    } catch (e) {
        templateError.value = (e as Error).message || '模板解析失败'
    }
}

const fxPopover = ref()
const fxField = ref<Field | null>(null)
function openFx(e: Event, f: Field) {
    fxField.value = f
    fxPopover.value?.toggle(e)
}
function pickFunc(fn: FuncItem) {
    if (fxField.value) {
        fxField.value.value += fn.tag
    }
    fxPopover.value?.hide()
}
function addField() {
    fields.value.push({ key: `field${fields.value.length + 1}`, value: '' })
}
function removeField(i: number) {
    if (fields.value.length > 1) {
        fields.value.splice(i, 1)
    }
}

// 字段 / 数量变化 → 重建模板;模板变化(含手动改 textarea)→ 重新生成
watch([fields, count], buildTemplate, { deep: true })
watchDebounced(template, genOutput, { debounce: 300 })

onMounted(() => {
    buildTemplate()
    genOutput()
})
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="json" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px]">
            <!-- 输出 -->
            <div class="min-w-0">
                <CodeOutput :code="output" lang="JSON" />
            </div>

            <!-- 控制面板 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <!-- 字段编辑器 -->
                <div class="flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">字段</span>
                        <button class="text-12px text-accent px-2 py-0.5 border border-accent/40 rounded-md transition hover:bg-accent/5" @click="addField">
                            + 加字段
                        </button>
                    </div>
                    <div class="pr-1 flex flex-col gap-2 max-h-80 overflow-y-auto">
                        <div v-for="(f, i) in fields" :key="i" class="flex gap-1.5 items-center">
                            <input v-model="f.key"
                                class="text-13px text-ink px-2 py-1.5 outline-none border border-line rounded-8px bg-white shrink-0 w-20 focus:border-accent"
                                placeholder="字段名">
                            <input v-model="f.value"
                                class="text-13px text-ink font-mono px-2 py-1.5 outline-none border border-line rounded-8px bg-white flex-1 min-w-0 focus:border-accent"
                                placeholder="值 / {{ 函数 }}">
                            <button class="text-11px text-muted font-mono px-2 py-1.5 border border-line rounded-8px bg-white shrink-0 transition hover:text-accent hover:border-accent" title="插入函数" @click="openFx($event, f)">
                                fx
                            </button>
                            <button class="text-15px text-faint leading-none shrink-0 transition hover:text-ink disabled:opacity-30" :disabled="fields.length <= 1" @click="removeField(i)">
                                ×
                            </button>
                        </div>
                    </div>

                    <Popover ref="fxPopover">
                        <div class="flex flex-col max-h-80 w-72 overflow-y-auto">
                            <button v-for="fn in funcs" :key="fn.label"
                                class="px-3 py-2 text-left rounded-8px transition hover:bg-line-soft/50"
                                @click="pickFunc(fn)">
                                <div class="flex gap-2 items-baseline justify-between">
                                    <span class="text-13px text-ink font-500">{{ fn.label }}</span>
                                    <span class="text-11px text-accent-ink font-mono">{{ fn.sig }}</span>
                                </div>
                                <div class="text-11px text-faint leading-snug mt-0.5">
                                    {{ fn.desc }}<span v-if="fn.def"> · {{ fn.def }}</span>
                                </div>
                            </button>
                        </div>
                    </Popover>
                    <p class="text-11px text-faint leading-relaxed m-0">
                        值填函数(如 <span class="font-mono">{{ exampleTag }}</span>)则生成,填普通内容作静态值,留空为 <span class="font-mono">null</span>。
                    </p>
                </div>

                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">
                        数量 <span class="text-accent-ink">{{ count }}</span>
                    </span>
                    <Slider v-model="count" :min="1" :max="50" />
                </div>

                <!-- 模板(联动,可手动微调) -->
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">模板</span>
                    <textarea v-model="template" spellcheck="false"
                        class="text-12px text-ink leading-relaxed font-mono px-3 py-2.5 outline-none border rounded-9px bg-white h-48 resize-y focus:border-accent"
                        :class="templateError ? 'border-red-300' : 'border-line'" />
                    <p v-if="templateError" class="text-11px text-red-500 m-0">
                        {{ templateError }}
                    </p>
                    <p v-else class="text-11px text-faint leading-relaxed m-0">
                        字段自动生成到此,可手动加嵌套 / 数组(改字段会重建)。
                    </p>
                </div>

                <button class="text-14px text-white font-500 px-3 py-2 rounded-10px bg-accent transition hover:bg-accent-ink" @click="genOutput">
                    重新生成
                </button>
            </div>
        </div>
    </div>
</template>
