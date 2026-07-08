import { calc } from '@wzo/calc'

// 科学计算表达式求值器:词法 → 调度场(RPN)→ 求值
// 四则 / 幂 / 根 / mod / abs 走 @wzo/calc(精确),三角 / 对数 / 阶乘用 JS Math

const RE_NUM = /[0-9.]/
const RE_DIGIT = /\d/
const RE_ALPHA = /[a-z]/i
const RE_TRAIL_ZERO = /\.?0+e/

const FUNCS = new Set(['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs'])
const CALC_FUNCS = new Set(['sqrt', 'abs'])

type TokType = 'num' | 'op' | 'func' | 'const' | 'lp' | 'rp' | 'fact' | 'neg'
interface Tok { t: TokType, v?: string }

const PREC: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, 'neg': 3, '^': 4 }
const RIGHT = new Set(['^', 'neg'])

const SYMBOLS: Record<string, Tok> = {
    '×': { t: 'op', v: '*' },
    '*': { t: 'op', v: '*' },
    '÷': { t: 'op', v: '/' },
    '/': { t: 'op', v: '/' },
    '+': { t: 'op', v: '+' },
    '%': { t: 'op', v: '%' },
    '^': { t: 'op', v: '^' },
    '√': { t: 'func', v: 'sqrt' },
    'π': { t: 'const', v: 'pi' },
    '!': { t: 'fact' },
    '(': { t: 'lp' },
    ')': { t: 'rp' },
}

function tokenize(s: string): Tok[] {
    const toks: Tok[] = []
    let i = 0
    const prev = () => toks.at(-1)?.t
    while (i < s.length) {
        const c = s.charAt(i)
        if (c === ' ') {
            i++
            continue
        }
        if (RE_NUM.test(c)) {
            let j = i + 1
            while (j < s.length && RE_NUM.test(s.charAt(j))) {
                j++
            }
            // 指数记法 1e5 / 2.5e-3
            if (s.charAt(j) === 'e' || s.charAt(j) === 'E') {
                let k = j + 1
                if (s.charAt(k) === '+' || s.charAt(k) === '-') {
                    k++
                }
                if (RE_DIGIT.test(s.charAt(k))) {
                    j = k + 1
                    while (j < s.length && RE_DIGIT.test(s.charAt(j))) {
                        j++
                    }
                }
            }
            toks.push({ t: 'num', v: s.slice(i, j) })
            i = j
            continue
        }
        if (RE_ALPHA.test(c)) {
            let j = i + 1
            while (j < s.length && RE_ALPHA.test(s.charAt(j))) {
                j++
            }
            const w = s.slice(i, j).toLowerCase()
            if (w === 'e') {
                toks.push({ t: 'const', v: 'e' })
            } else if (w === 'pi') {
                toks.push({ t: 'const', v: 'pi' })
            } else if (w === 'mod') {
                toks.push({ t: 'op', v: '%' })
            } else if (FUNCS.has(w)) {
                toks.push({ t: 'func', v: w })
            } else {
                throw new Error(`未知符号 ${w}`)
            }
            i = j
            continue
        }
        if (c === '-' || c === '−') {
            const p = prev()
            toks.push(p === undefined || p === 'op' || p === 'lp' || p === 'func' || p === 'neg' ? { t: 'neg' } : { t: 'op', v: '-' })
            i++
            continue
        }
        const sym = SYMBOLS[c]
        if (sym) {
            toks.push(sym)
            i++
            continue
        }
        throw new Error(`非法字符 ${c}`)
    }
    return toks
}

function toRPN(toks: Tok[]): Tok[] {
    const out: Tok[] = []
    const stack: Tok[] = []
    for (const tk of toks) {
        if (tk.t === 'num' || tk.t === 'const' || tk.t === 'fact') {
            out.push(tk)
        } else if (tk.t === 'func') {
            stack.push(tk)
        } else if (tk.t === 'op' || tk.t === 'neg') {
            const o1 = tk.v ?? 'neg'
            while (stack.length) {
                const top = stack.at(-1)!
                if (top.t === 'func') {
                    out.push(stack.pop()!)
                    continue
                }
                if (top.t === 'op' || top.t === 'neg') {
                    const o2 = top.v ?? 'neg'
                    const shift = RIGHT.has(o1) ? PREC[o1]! < PREC[o2]! : PREC[o1]! <= PREC[o2]!
                    if (shift) {
                        out.push(stack.pop()!)
                        continue
                    }
                }
                break
            }
            stack.push(tk)
        } else if (tk.t === 'lp') {
            stack.push(tk)
        } else if (tk.t === 'rp') {
            while (stack.length && stack.at(-1)!.t !== 'lp') {
                out.push(stack.pop()!)
            }
            if (!stack.length) {
                throw new Error('括号不匹配')
            }
            stack.pop()
            if (stack.length && stack.at(-1)!.t === 'func') {
                out.push(stack.pop()!)
            }
        }
    }
    while (stack.length) {
        const t = stack.pop()!
        if (t.t === 'lp') {
            throw new Error('括号不匹配')
        }
        out.push(t)
    }
    return out
}

function toRad(x: number, deg: boolean): number {
    return deg
        ? (x * Math.PI) / 180
        : x
}

function factorial(a: string): string {
    const n = Number(a)
    if (!Number.isInteger(n) || n < 0) {
        throw new Error('阶乘需非负整数')
    }
    let acc = '1'
    for (let k = 2; k <= n; k++) {
        acc = String(calc(`${acc} * ${k}`))
    }
    return acc
}

function applyFunc(name: string, a: string, deg: boolean): string {
    if (CALC_FUNCS.has(name)) {
        return String(calc(`${name}(${a})`))
    }
    const x = Number(a)
    const map: Record<string, () => number> = {
        sin: () => Math.sin(toRad(x, deg)),
        cos: () => Math.cos(toRad(x, deg)),
        tan: () => Math.tan(toRad(x, deg)),
        asin: () => (deg ? (Math.asin(x) * 180) / Math.PI : Math.asin(x)),
        acos: () => (deg ? (Math.acos(x) * 180) / Math.PI : Math.acos(x)),
        atan: () => (deg ? (Math.atan(x) * 180) / Math.PI : Math.atan(x)),
        log: () => Math.log10(x),
        ln: () => Math.log(x),
    }
    const fn = map[name]
    if (!fn) {
        throw new Error(`未知函数 ${name}`)
    }
    return String(fn())
}

function binOp(op: string, a: string, b: string): string {
    if (op === '%') {
        return String(calc(`mod(${a}, ${b})`))
    }
    if (op === '^') {
        return String(calc(`pow(${a}, ${b})`))
    }
    return String(calc(`(${a}) ${op} (${b})`))
}

function evalRPN(rpn: Tok[], deg: boolean): string {
    const st: string[] = []
    for (const tk of rpn) {
        if (tk.t === 'num') {
            st.push(tk.v!)
        } else if (tk.t === 'const') {
            st.push(tk.v === 'pi' ? String(Math.PI) : String(Math.E))
        } else if (tk.t === 'fact') {
            st.push(factorial(st.pop()!))
        } else if (tk.t === 'neg') {
            st.push(binOp('-', '0', st.pop()!))
        } else if (tk.t === 'func') {
            st.push(applyFunc(tk.v!, st.pop()!, deg))
        } else if (tk.t === 'op') {
            const b = st.pop()!
            const a = st.pop()!
            st.push(binOp(tk.v!, a, b))
        }
    }
    if (st.length !== 1) {
        throw new Error('表达式不完整')
    }
    return st[0]!
}

// 结果展示格式化:极大 / 极小走科学计数法,长小数截断到 12 位有效数字
export function formatResult(s: string): string {
    const n = Number(s)
    if (!Number.isFinite(n)) {
        throw new TypeError('结果无效')
    }
    const abs = Math.abs(n)
    if (abs !== 0 && (abs >= 1e15 || abs < 1e-6)) {
        return n.toExponential(8).replace(RE_TRAIL_ZERO, 'e')
    }
    if (s.length > 14) {
        return String(Number(n.toPrecision(12)))
    }
    return s
}

export function evalExpr(expr: string, deg: boolean): string {
    return formatResult(evalRPN(toRPN(tokenize(expr)), deg))
}
