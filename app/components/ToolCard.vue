<script setup lang="ts">
import type { ToolItem } from '~/config/tools'

const props = defineProps<{ tool: ToolItem }>()

const isExternal = computed(() => !!props.tool.href)
const dest = computed(() => props.tool.to ?? props.tool.href ?? '/')
</script>

<template>
    <NuxtLink :to="dest"
        :external="isExternal"
        :target="isExternal ? '_blank' : undefined"
        :rel="isExternal ? 'noopener' : undefined"
        class="tool-card group text-ink p-3.5 border border-line rounded-14px bg-panel no-underline flex flex-col gap-13px relative overflow-hidden">
        <span v-if="isExternal"
            class="text-10px text-accent-ink tracking-wider font-mono px-1.75 py-0.5 border border-accent/22 rounded-full bg-accent/10 right-3 top-3 absolute z-2">外链 ↗</span>

        <!-- 效果预览:按工具类型分支渲染 -->
        <div class="preview border border-line-soft rounded-9px bg-[#FBFCFB] flex h-24 items-center justify-center overflow-hidden">
            <div v-if="tool.preview === 'gradient'" class="h-full w-full" style="background:linear-gradient(115deg,#0E8C6B,#7DD9BE 42%,#F0C36B 100%)" />

            <div v-else-if="tool.preview === 'shadow'" class="rounded-12px bg-white h-46px w-46px" style="box-shadow:0 12px 22px -6px rgba(21,32,25,.42)" />

            <div v-else-if="tool.preview === 'radius'" class="border-2 border-ink h-52px w-74px" style="border-radius:24px 24px 4px 24px" />

            <svg v-else-if="tool.preview === 'noise'" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 120 96">
                <filter id="tc-noise"><feTurbulence type="fractalNoise" base-frequency="0.9" num-octaves="2" /></filter>
                <rect width="120" height="96" filter="url(#tc-noise)" opacity="0.5" />
            </svg>

            <div v-else-if="tool.preview === 'clip'" class="h-64px w-64px" style="background:linear-gradient(135deg,#0E8C6B,#7DD9BE);clip-path:polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%)" />

            <div v-else-if="tool.preview === 'keypad'" class="keypad gap-1 grid grid-cols-4 w-82px">
                <i v-for="n in 12" :key="n" :class="n % 4 === 0 ? 'op' : ''" />
            </div>

            <pre v-else-if="tool.preview === 'json'" class="code"><span class="m">{</span>
  <span class="k">"id"</span>: 1,
  <span class="k">"name"</span>: <span class="k">"…"</span>
<span class="m">}</span></pre>

            <pre v-else-if="tool.preview === 'regex'" class="code"><span class="m">/</span>^\d<span class="k">{3}</span>-\d<span class="k">{4}</span>$<span class="m">/</span></pre>

            <pre v-else class="code"><span class="m">.card</span> &gt; <span class="m">a</span><span class="k">:hover</span> {
  <span class="k">color</span>: teal;
}</pre>
        </div>

        <div>
            <div class="flex gap-2.5 items-baseline justify-between">
                <span class="text-11px text-faint tracking-wide font-mono">{{ tool.no }} · {{ tool.slug }}</span>
                <span class="arrow text-13px text-faint font-mono transition">↗</span>
            </div>
            <p class="text-16px font-600 mb-0.75 mt-0.5 -tracking-tight">
                {{ tool.name }}
            </p>
            <p class="text-12.5px text-muted leading-relaxed m-0">
                {{ tool.desc }}
            </p>
        </div>
    </NuxtLink>
</template>

<style scoped>
.tool-card {
    transition: transform 0.28s cubic-bezier(0.2, 0.7, 0.3, 1), border-color 0.28s, box-shadow 0.28s;
}
.tool-card:hover {
    transform: translateY(-4px);
    border-color: #0e8c6b;
    box-shadow: 0 14px 34px -20px rgba(14, 140, 107, 0.5);
}
.tool-card:hover .arrow {
    color: #0e8c6b;
    transform: translate(3px, -3px);
}

.code {
    width: 100%;
    padding: 0 12px;
    margin: 0;
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 12px;
    line-height: 1.7;
    color: #152019;
}
.code .k { color: #0a5c47; }
.code .m { color: #8a968e; }

.keypad i {
    display: block;
    height: 15px;
    border-radius: 3px;
    background: #e7ebe5;
}
.keypad i.op {
    background: #0e8c6b;
    opacity: 0.85;
}

@media (prefers-reduced-motion: reduce) {
    .tool-card,
    .tool-card:hover,
    .arrow { transition: none; transform: none; }
}
</style>
