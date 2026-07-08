<script setup lang="ts">
defineProps<{ code: string, lang?: string }>()

const { copy, copied } = useClipboard()
</script>

<template>
    <div class="border border-line rounded-12px bg-panel overflow-hidden">
        <div class="px-4 py-2.5 border-b border-line-soft flex items-center justify-between">
            <span class="text-11px text-faint tracking-wide font-mono uppercase">{{ lang ?? 'CSS' }}</span>
            <button class="text-12px px-2.5 py-1 border rounded-md inline-flex gap-1.5 transition items-center"
                :class="copied ? 'text-accent border-accent/40 bg-accent/5' : 'text-muted border-line hover:text-ink'"
                @click="copy(code)">
                {{ copied ? '已复制' : '复制' }}
            </button>
        </div>
        <pre class="text-13px text-ink leading-relaxed font-mono m-0 px-4 py-3.5 overflow-x-auto">{{ code }}</pre>
    </div>
</template>
