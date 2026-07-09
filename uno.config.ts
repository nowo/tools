import {
    defineConfig,
    presetIcons,
    presetWind4,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss'

export default defineConfig({
    presets: [
        presetWind4(),
        presetIcons(),
    ],

    theme: {
        colors: {
            // 语义色 token —— 亮色 / 暗色经 CSS 变量切换
            'ground': 'var(--color-ground)', // 纸感冷灰底
            'panel': 'var(--color-panel)', // 卡片面
            'ink': 'var(--color-ink)', // 近黑墨绿字
            'muted': 'var(--color-muted)', // 次要文字
            'faint': 'var(--color-faint)', // 弱文字
            'accent': 'var(--color-accent)', // 强调深青
            'accent-ink': 'var(--color-accent-ink)', // 强调墨
            'line': 'var(--color-line)', // 分隔线
            'line-soft': 'var(--color-line-soft)', // 更浅分隔线
        },
        font: {
            // 系统字体栈(含苹方中文回退)+ 等宽 mono 承载技术标签
            sans: '-apple-system, "SF Pro Text", "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif',
            mono: 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace',
        },
    },

    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
})
