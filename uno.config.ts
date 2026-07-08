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
            // 语义色 token(设计稿:精密仪表盘 / 规格表风,亮色)
            'ground': '#F1F3EF', // 纸感冷灰底
            'panel': '#FFFFFF', // 卡片面
            'ink': '#152019', // 近黑墨绿字
            'muted': '#5C6A62', // 次要文字
            'faint': '#8A968E', // 弱文字
            'accent': '#0E8C6B', // 强调深青
            'accent-ink': '#0A5C47', // 强调墨
            'line': '#DCE2DB', // 分隔线
            'line-soft': '#E7EBE5', // 更浅分隔线
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
