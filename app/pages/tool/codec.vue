<script setup lang="ts">
// 编码转换:Base64 / URL / HTML 实体(可编/解码)+ JWT 解码
type Mode = 'base64' | 'url' | 'html' | 'jwt'

const modes = [
    { label: 'Base64', value: 'base64' },
    { label: 'URL', value: 'url' },
    { label: 'HTML 实体', value: 'html' },
    { label: 'JWT 解码', value: 'jwt' },
]
const dirs = [
    { label: '编码', value: 'encode' },
    { label: '解码', value: 'decode' },
]
const mode = ref<Mode>('base64')
const dir = ref<'encode' | 'decode'>('encode')
const input = ref('Hello, 世界 🌍')
const output = ref('')
const error = ref('')

const modeNote: Record<Mode, string> = {
    base64: 'UTF-8 安全;解码会忽略空白字符。',
    url: '基于 encodeURIComponent / decodeURIComponent。',
    html: '转义 & < > " \' 等特殊字符,解码支持具名与数字实体。',
    jwt: '仅解码 Header 与 Payload(不校验签名,那需要密钥)。',
}

function run() {
    error.value = ''
    const s = input.value
    if (!s.trim()) {
        output.value = ''
        return
    }
    try {
        if (mode.value === 'jwt') {
            output.value = jwtDecode(s)
            return
        }
        const enc = dir.value === 'encode'
        if (mode.value === 'base64') {
            output.value = enc ? base64Encode(s) : base64Decode(s)
        } else if (mode.value === 'url') {
            output.value = enc ? encodeURIComponent(s) : decodeURIComponent(s)
        } else {
            output.value = enc ? htmlEncode(s) : htmlDecode(s)
        }
    } catch (e) {
        output.value = ''
        if (mode.value === 'base64') {
            error.value = 'Base64 解码失败:内容不是合法的 Base64'
        } else if (mode.value === 'url') {
            error.value = 'URL 解码失败:含有非法的百分号转义'
        } else {
            error.value = (e as Error).message || '转换失败,请检查输入格式'
        }
    }
}
watchDebounced([input, mode, dir], run, { debounce: 200, immediate: true })

function swap() {
    if (mode.value === 'jwt' || !output.value) {
        return
    }
    input.value = output.value
    dir.value = dir.value === 'encode' ? 'decode' : 'encode'
}
function clear() {
    input.value = ''
}

const { copy, copied } = useClipboard()
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="codec" />

        <div class="mt-8 gap-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
            <!-- 输入 / 输出 -->
            <div class="flex flex-col gap-4 min-w-0">
                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">输入</span>
                        <span class="text-11px text-faint font-mono">{{ input.length }} 字符</span>
                    </div>
                    <textarea v-model="input" spellcheck="false"
                        class="text-13px text-ink leading-relaxed font-mono px-3.5 py-3 outline-none border border-line rounded-12px bg-[var(--color-bright-bg)] h-40 w-full resize-y focus:border-accent"
                        placeholder="在此输入或粘贴内容…" />
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <span class="text-12px text-faint tracking-wide font-mono uppercase">输出</span>
                        <button v-if="output" class="text-12px px-2.5 py-1 border rounded-md inline-flex gap-1.5 transition items-center"
                            :class="copied ? 'text-accent border-accent/40 bg-accent/5' : 'text-muted border-line hover:text-ink'"
                            @click="copy(output)">
                            {{ copied ? '已复制' : '复制' }}
                        </button>
                    </div>
                    <pre v-if="error" class="text-13px text-[#e2463f] leading-relaxed font-mono m-0 px-3.5 py-3 border border-[#e2463f]/30 rounded-12px bg-[#e2463f]/6 whitespace-pre-wrap">{{ error }}</pre>
                    <pre v-else class="text-13px text-ink leading-relaxed font-mono m-0 px-3.5 py-3 border border-line rounded-12px bg-panel min-h-40 whitespace-pre-wrap break-all">{{ output || '—' }}</pre>
                </div>
            </div>

            <!-- 控制面板 -->
            <div class="p-5 border border-line rounded-14px bg-panel flex flex-col gap-5 h-fit">
                <div class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">类型</span>
                    <div class="gap-2 grid grid-cols-2">
                        <button v-for="m in modes" :key="m.value"
                            class="text-13px px-2 py-1.5 border rounded-9px transition"
                            :class="mode === m.value ? 'text-accent border-accent bg-accent/5' : 'text-ink border-line hover:border-accent'"
                            @click="mode = (m.value as Mode)">
                            {{ m.label }}
                        </button>
                    </div>
                </div>

                <div v-if="mode !== 'jwt'" class="flex flex-col gap-2">
                    <span class="text-12px text-faint tracking-wide font-mono uppercase">方向</span>
                    <SelectButton v-model="dir" :options="dirs" option-label="label" option-value="value" :allow-empty="false" />
                </div>

                <div class="flex gap-2">
                    <button v-if="mode !== 'jwt'" class="text-13px text-ink px-3 py-1.5 border border-line rounded-9px flex-1 transition hover:text-accent hover:border-accent" @click="swap">
                        ⇄ 对调
                    </button>
                    <button class="text-13px text-muted px-3 py-1.5 border border-line rounded-9px flex-1 transition hover:text-ink" @click="clear">
                        清空
                    </button>
                </div>

                <p class="text-11px text-faint leading-relaxed m-0 pt-1 border-t border-line-soft">
                    {{ modeNote[mode] }}
                </p>
            </div>
        </div>
    </div>
</template>
