// 编码/解码:Base64(UTF-8 安全)、URL、HTML 实体、JWT 解码
// 运行期用浏览器全局(btoa/atob/TextEncoder/DOMParser),仅在函数体内引用

const RE_WS = /\s+/g
const RE_HTML_ENC = /[&<>"']/g
const RE_JWT_MINUS = /-/g
const RE_JWT_UNDERSCORE = /_/g
const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
}

export function base64Encode(s: string): string {
    const bytes = new TextEncoder().encode(s)
    let bin = ''
    for (const b of bytes) {
        bin += String.fromCharCode(b)
    }
    return btoa(bin)
}

export function base64Decode(s: string): string {
    const bin = atob(s.replace(RE_WS, ''))
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
}

export function htmlEncode(s: string): string {
    return s.replace(RE_HTML_ENC, c => HTML_ENTITIES[c]!)
}

export function htmlDecode(s: string): string {
    return new DOMParser().parseFromString(s, 'text/html').documentElement.textContent ?? ''
}

// 解码 JWT 的 header + payload(不校验签名,需要密钥)
export function jwtDecode(token: string): string {
    const parts = token.trim().split('.')
    if (parts.length < 2 || !parts[0] || !parts[1]) {
        throw new Error('不是有效 JWT(需要用点号分隔的三段)')
    }
    const part = (p: string) => {
        try {
            let b = p.replace(RE_JWT_MINUS, '+').replace(RE_JWT_UNDERSCORE, '/')
            b += '='.repeat((4 - (b.length % 4)) % 4)
            return JSON.stringify(JSON.parse(base64Decode(b)), null, 2)
        } catch {
            throw new Error('无法解码 JWT:某一段不是合法的 base64url / JSON')
        }
    }
    return `// Header\n${part(parts[0])}\n\n// Payload\n${part(parts[1])}`
}
