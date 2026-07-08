<script setup lang="ts">
interface SelItem { sel: string, desc: string, eg?: string }
interface SelGroup { name: string, items: SelItem[] }

const groups: SelGroup[] = [
    {
        name: '基础',
        items: [
            { sel: '*', desc: '通用选择器,匹配所有元素' },
            { sel: 'E', desc: '类型选择器,匹配所有 <E> 元素', eg: 'p / div' },
            { sel: '.class', desc: '类选择器,匹配 class 含该名的元素', eg: '.btn' },
            { sel: '#id', desc: 'ID 选择器,匹配 id 为该值的元素', eg: '#app' },
            { sel: 'A, B', desc: '选择器组,同时匹配 A 或 B', eg: 'h1, h2' },
        ],
    },
    {
        name: '组合器',
        items: [
            { sel: 'A B', desc: '后代:A 内部的所有 B(任意层级)', eg: 'ul li' },
            { sel: 'A > B', desc: '子代:A 的直接子元素 B', eg: 'ul > li' },
            { sel: 'A + B', desc: '相邻兄弟:紧跟在 A 之后的 B', eg: 'h2 + p' },
            { sel: 'A ~ B', desc: '通用兄弟:A 之后的所有同级 B', eg: 'h2 ~ p' },
        ],
    },
    {
        name: '属性',
        items: [
            { sel: '[attr]', desc: '含该属性的元素', eg: '[disabled]' },
            { sel: '[attr=val]', desc: '属性值完全等于 val', eg: '[type="text"]' },
            { sel: '[attr~=val]', desc: '属性值(空格分隔)含 val 这个词', eg: '[class~="btn"]' },
            { sel: '[attr|=val]', desc: '属性值等于 val 或以 val- 开头', eg: '[lang|="en"]' },
            { sel: '[attr^=val]', desc: '属性值以 val 开头', eg: 'a[href^="https"]' },
            { sel: '[attr$=val]', desc: '属性值以 val 结尾', eg: 'a[href$=".pdf"]' },
            { sel: '[attr*=val]', desc: '属性值包含 val 子串', eg: '[class*="col"]' },
            { sel: '[attr=val i]', desc: '匹配时忽略大小写', eg: '[type="TEXT" i]' },
        ],
    },
    {
        name: '结构伪类',
        items: [
            { sel: ':root', desc: '文档根元素(通常是 <html>)' },
            { sel: ':first-child', desc: '父元素的第一个子元素' },
            { sel: ':last-child', desc: '父元素的最后一个子元素' },
            { sel: ':only-child', desc: '父元素唯一的子元素' },
            { sel: ':nth-child(n)', desc: '第 n 个子元素(可用 2n / odd / even)', eg: 'li:nth-child(odd)' },
            { sel: ':nth-last-child(n)', desc: '倒数第 n 个子元素' },
            { sel: ':first-of-type', desc: '同类型中的第一个' },
            { sel: ':last-of-type', desc: '同类型中的最后一个' },
            { sel: ':only-of-type', desc: '同类型中唯一的一个' },
            { sel: ':nth-of-type(n)', desc: '同类型中的第 n 个', eg: 'p:nth-of-type(2)' },
            { sel: ':empty', desc: '没有子节点(含文本)的元素' },
        ],
    },
    {
        name: '状态 / 表单伪类',
        items: [
            { sel: ':hover', desc: '鼠标悬停' },
            { sel: ':focus', desc: '获得焦点' },
            { sel: ':active', desc: '被激活(按下)' },
            { sel: ':link', desc: '未访问的链接' },
            { sel: ':visited', desc: '已访问的链接' },
            { sel: ':focus-within', desc: '自身或后代获得焦点' },
            { sel: ':focus-visible', desc: '键盘等需要可见焦点环时' },
            { sel: ':checked', desc: '被选中的复选 / 单选 / option' },
            { sel: ':disabled', desc: '被禁用的表单元素' },
            { sel: ':enabled', desc: '可用的表单元素' },
            { sel: ':required', desc: '必填的表单元素' },
            { sel: ':optional', desc: '非必填的表单元素' },
            { sel: ':read-only', desc: '只读元素' },
            { sel: ':read-write', desc: '可编辑元素' },
            { sel: ':valid', desc: '校验通过' },
            { sel: ':invalid', desc: '校验不通过' },
            { sel: ':placeholder-shown', desc: '正显示占位符的输入框' },
        ],
    },
    {
        name: '逻辑 / 其他伪类',
        items: [
            { sel: ':not(S)', desc: '不匹配 S 的元素', eg: 'li:not(.active)' },
            { sel: ':is(S)', desc: '匹配括号内任一选择器(参与特异性)', eg: ':is(h1, h2) a' },
            { sel: ':where(S)', desc: '同 :is,但特异性为 0', eg: ':where(article) p' },
            { sel: ':has(S)', desc: '包含匹配 S 的后代 / 兄弟', eg: 'a:has(img)' },
            { sel: ':target', desc: 'URL 锚点指向的元素' },
            { sel: ':lang(x)', desc: '指定语言的元素', eg: ':lang(zh)' },
        ],
    },
    {
        name: '伪元素',
        items: [
            { sel: '::before', desc: '在元素内容前插入(需 content)' },
            { sel: '::after', desc: '在元素内容后插入(需 content)' },
            { sel: '::first-line', desc: '首行文本' },
            { sel: '::first-letter', desc: '首字母' },
            { sel: '::selection', desc: '用户选中的文本' },
            { sel: '::placeholder', desc: '输入框占位符文本' },
            { sel: '::marker', desc: '列表项的项目符号 / 序号' },
            { sel: '::backdrop', desc: '全屏 / dialog 元素的背景层' },
        ],
    },
]

const query = ref('')
const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) {
        return groups
    }
    return groups
        .map(g => ({ name: g.name, items: g.items.filter(it => `${it.sel} ${it.desc} ${it.eg ?? ''}`.toLowerCase().includes(q)) }))
        .filter(g => g.items.length > 0)
})
const total = groups.reduce((n, g) => n + g.items.length, 0)

const { copy } = useClipboard()
const copied = ref('')
function copySel(s: string) {
    copy(s)
    copied.value = s
    setTimeout(() => {
        if (copied.value === s) {
            copied.value = ''
        }
    }, 1500)
}
</script>

<template>
    <div class="mx-auto px-5 py-12 max-w-1140px lg:px-14">
        <ToolHeader id="selector" />

        <input v-model="query"
            class="text-14px text-ink mt-8 px-4 py-2.5 outline-none border border-line rounded-10px bg-[var(--color-bright-bg)] max-w-md w-full focus:border-accent"
            :placeholder="`搜索 ${total} 个选择器 / 说明…`">

        <div class="mt-8 flex flex-col gap-8">
            <div v-for="g in filtered" :key="g.name">
                <h2 class="text-13px text-faint tracking-wide font-mono m-0 mb-3 uppercase">
                    {{ g.name }}
                </h2>
                <div class="gap-2.5 grid grid-cols-1 sm:grid-cols-2">
                    <div v-for="it in g.items" :key="it.sel"
                        class="group px-3.5 py-2.5 border border-line rounded-10px bg-panel transition hover:border-accent">
                        <div class="flex gap-2 items-baseline justify-between">
                            <code class="text-13px text-accent-ink font-mono select-text">{{ it.sel }}</code>
                            <button
                                class="text-10px shrink-0 transition cursor-pointer"
                                :class="copied === it.sel ? 'text-accent' : 'text-faint opacity-0 hover:text-accent group-hover:opacity-100'"
                                :title="`复制 ${it.sel}`"
                                @click="copySel(it.sel)">
                                {{ copied === it.sel ? '已复制' : '复制' }}
                            </button>
                        </div>
                        <div class="text-12.5px text-muted leading-snug mt-1 select-text">
                            {{ it.desc }}
                        </div>
                        <div v-if="it.eg" class="text-11px text-faint font-mono mt-0.5 select-text">
                            {{ it.eg }}
                        </div>
                    </div>
                </div>
            </div>

            <p v-if="!filtered.length" class="text-14px text-faint m-0">
                没有匹配「{{ query }}」的选择器。
            </p>
        </div>
    </div>
</template>
