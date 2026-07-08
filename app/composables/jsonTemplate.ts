import { faker } from '@faker-js/faker'

// json-generator 风格模板引擎:解析类 JSON 模板 → 展开 repeat → 求值 {{...}} 标签
// 数据源全部用 @faker-js/faker;标签内可写任意 JS 表达式(纯前端,求值用户自己的模板)

const RE_REPEAT = /^\{\{\s*repeat\s*\(/
const RE_TAG_G = /\{\{([\s\S]+?)\}\}/g
const RE_ONE_TAG = /^\{\{[\s\S]+\}\}$/

function randInt(min: number, max: number) {
    return faker.number.int({ min, max })
}

function makeApi(idx: { i: number }): Record<string, unknown> {
    return {
        repeat: (a: number, b?: number) => (b === undefined ? a : randInt(a, b)),
        integer: (min = 0, max = 100) => randInt(min, max),
        floating: (min = 0, max = 100, decimals = 2) => faker.number.float({ min, max, fractionDigits: decimals }),
        bool: () => faker.datatype.boolean(),
        index: () => idx.i,
        guid: () => faker.string.uuid(),
        objectId: () => faker.database.mongodbObjectId(),
        random: (...items: unknown[]) => items[randInt(0, Math.max(0, items.length - 1))],
        firstName: () => faker.person.firstName(),
        surname: () => faker.person.lastName(),
        lastName: () => faker.person.lastName(),
        name: () => faker.person.fullName(),
        email: () => faker.internet.email(),
        username: () => faker.internet.username(),
        phone: () => faker.phone.number(),
        company: () => faker.company.name(),
        jobTitle: () => faker.person.jobTitle(),
        gender: () => faker.person.sex(),
        lorem: (count = 1, unit = 'words') => {
            if (unit.startsWith('sentence')) {
                return faker.lorem.sentences(count)
            }
            if (unit.startsWith('paragraph')) {
                return faker.lorem.paragraphs(count)
            }
            return faker.lorem.words(count)
        },
        date: (min?: string, max?: string) => (min && max ? faker.date.between({ from: min, to: max }) : faker.date.past()).toISOString(),
        city: () => faker.location.city(),
        country: () => faker.location.country(),
        state: () => faker.location.state(),
        street: () => faker.location.streetAddress(),
        zip: () => faker.location.zipCode(),
        latitude: () => faker.location.latitude(),
        longitude: () => faker.location.longitude(),
        color: () => faker.color.rgb(),
        url: () => faker.internet.url(),
        add: (a: number, b: number) => a + b,
    }
}

function parseTemplate(str: string): unknown {
    // eslint-disable-next-line no-new-func
    return new Function(`return (${str})`)()
}

function evalExpr(expr: string, api: Record<string, unknown>): unknown {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...Object.keys(api), `return (${expr})`)
    return fn(...Object.values(api))
}

function evalString(str: string, api: Record<string, unknown>): unknown {
    const tags = str.match(RE_TAG_G) ?? []
    // 整串就是一个标签 → 返回原始类型(数字 / 布尔 / 对象)
    if (tags.length === 1 && RE_ONE_TAG.test(str.trim())) {
        return evalExpr(str.trim().slice(2, -2), api)
    }
    // 含多个标签或混文本 → 字符串插值
    return str.replace(RE_TAG_G, (_, e) => String(evalExpr(e, api)))
}

function build(node: unknown, api: Record<string, unknown>, idx: { i: number }): unknown {
    if (Array.isArray(node)) {
        if (typeof node[0] === 'string' && RE_REPEAT.test(node[0])) {
            const count = Math.max(0, Math.floor(Number(evalString(node[0], api)) || 0))
            const out: unknown[] = []
            for (let i = 0; i < count; i++) {
                idx.i = i
                out.push(build(node[1], api, idx))
            }
            return out
        }
        return node.map((n, i) => {
            idx.i = i
            return build(n, api, idx)
        })
    }
    if (node && typeof node === 'object') {
        const obj: Record<string, unknown> = {}
        for (const k of Object.keys(node)) {
            obj[k] = build((node as Record<string, unknown>)[k], api, idx)
        }
        return obj
    }
    if (typeof node === 'string') {
        return evalString(node, api)
    }
    return node
}

export function generateFromTemplate(template: string): string {
    const parsed = parseTemplate(template)
    const idx = { i: 0 }
    return JSON.stringify(build(parsed, makeApi(idx), idx), null, 2)
}
