import defineConfig from '@wzo/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(defineConfig(
    {
        unocss: true,
        ignores: [
            '.github/workflows/*.yml',
            'public/**',
        ],
    },
))
