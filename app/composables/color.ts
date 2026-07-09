// 颜色转换与对比度:sRGB ↔ HEX / HSL / OKLCH,WCAG 相对亮度对比
// 纯函数,无依赖;OKLCH 走标准 OKLab 矩阵,对比度按 WCAG 2.x 相对亮度

export type Rgb = [number, number, number]

const RE_HEX = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i

export function hexToRgb(hex: string): Rgb | null {
    const m = RE_HEX.exec(hex.trim())
    if (!m) {
        return null
    }
    let h = m[1]!
    if (h.length === 3) {
        h = h.split('').map(c => c + c).join('')
    }
    return [
        Number.parseInt(h.slice(0, 2), 16),
        Number.parseInt(h.slice(2, 4), 16),
        Number.parseInt(h.slice(4, 6), 16),
    ]
}

export function rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')}`
}

// RGB(0-255) → HSL(h 0-360, s/l 0-100)
export function rgbToHsl(r: number, g: number, b: number): Rgb {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const l = (max + min) / 2
    let h = 0
    let s = 0
    const d = max - min
    if (d) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0)
        } else if (max === g) {
            h = (b - r) / d + 2
        } else {
            h = (r - g) / d + 4
        }
        h *= 60
    }
    return [h, s * 100, l * 100]
}

// HSL(h 0-360, s/l 0-100) → RGB(0-255)
export function hslToRgb(h: number, s: number, l: number): Rgb {
    h /= 360
    s /= 100
    l /= 100
    if (s === 0) {
        const v = l * 255
        return [v, v, v]
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const hue = (t: number) => {
        if (t < 0) {
            t += 1
        }
        if (t > 1) {
            t -= 1
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t
        }
        if (t < 1 / 2) {
            return q
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6
        }
        return p
    }
    return [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255]
}

function srgbToLinear(c: number): number {
    c /= 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

// RGB(0-255) → OKLCH(L 0-1, C ~0-0.4, H 0-360)
export function rgbToOklch(r: number, g: number, b: number): Rgb {
    const lr = srgbToLinear(r)
    const lg = srgbToLinear(g)
    const lb = srgbToLinear(b)
    const li = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
    const mi = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
    const si = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
    const l_ = Math.cbrt(li)
    const m_ = Math.cbrt(mi)
    const s_ = Math.cbrt(si)
    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
    const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
    const C = Math.sqrt(a * a + bb * bb)
    let H = Math.atan2(bb, a) * 180 / Math.PI
    if (H < 0) {
        H += 360
    }
    return [L, C, H]
}

function linearToSrgb(c: number): number {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
}

// OKLCH(L 0-1, C, H 度) → RGB(0-255);超出 sRGB 色域的通道截断到 0-255
export function oklchToRgb(L: number, C: number, H: number): Rgb {
    const hr = H * Math.PI / 180
    const a = C * Math.cos(hr)
    const b = C * Math.sin(hr)
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b
    const s_ = L - 0.0894841775 * a - 1.291485548 * b
    const li = l_ ** 3
    const mi = m_ ** 3
    const si = s_ ** 3
    const lr = 4.0767416621 * li - 3.3077115913 * mi + 0.2309699292 * si
    const lg = -1.2684380046 * li + 2.6097574011 * mi - 0.3413193965 * si
    const lb = -0.0041960863 * li - 0.7034186147 * mi + 1.707614701 * si
    const to255 = (v: number) => Math.min(255, Math.max(0, Math.round(linearToSrgb(v) * 255)))
    return [to255(lr), to255(lg), to255(lb)]
}

function relativeLuminance(r: number, g: number, b: number): number {
    const [R, G, B] = [r, g, b].map((v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * R! + 0.7152 * G! + 0.0722 * B!
}

// WCAG 对比度,1 ~ 21
export function contrastRatio(a: Rgb, b: Rgb): number {
    const la = relativeLuminance(...a)
    const lb = relativeLuminance(...b)
    const hi = Math.max(la, lb)
    const lo = Math.min(la, lb)
    return (hi + 0.05) / (lo + 0.05)
}
