<template>
    <div class="goods-classify container ma relative z-10 px30px!">
        <div class="overflow-x-clip">
            <!-- :slides-per-view="5" -->
            <Swiper class="" :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperNavigation, SwiperPagination]"
                :slides-per-view="5" :space-between="30" :navigation="navigation" :breakpoints="breakpoints">
                <SwiperSlide class="swiper-item" :class="setClassifyName(0)">
                    <NuxtLinkLocale :to="linkGoodsListUrl({ query: {}, relate: false, url: true })" class="type_name">
                        {{ $lang('首页', 'Home') }}
                    </NuxtLinkLocale>
                </SwiperSlide>
                <SwiperSlide v-for="(item, idx) in swiperList" :key="idx" class="swiper-item"
                    :class="setClassifyName(item.id)">
                    <NuxtLinkLocale class="type_name line-clamp-1"
                        :to="linkGoodsListUrl({ query: { cid: item.id, page: 1 }, relate: false, url: true })">
                        <span class="line-clamp-1">{{ $lang(item.title, item.title_en) }}</span>
                        <i v-if="item.children?.length" class=" i-ep-caret-bottom text-24px" />
                    </NuxtLinkLocale>
                    <ul v-if="item.children?.length" class="sub-item">
                        <li v-for="sub in item.children" :key="sub.id">
                            <NuxtLinkLocale class="cursor-pointer"
                                :to="linkGoodsListUrl({ query: { cid: sub.id, page: 1 }, relate: false, url: true })">
                                {{ $lang(sub.title, sub.title_en) }}
                            </NuxtLinkLocale>
                        </li>
                    </ul>
                </SwiperSlide>
            </Swiper>
        </div>

        <div class="swiper-button-prev" />
        <div class="swiper-button-next" />
    </div>
</template>

<script lang="ts" setup>
// import { getParentNode } from '@cooj/utils'

// const emits = defineEmits<{
//     // <eventName>: <expected arguments>
//     change: []
// }>()
const { $lang } = useNuxtApp()

const props = defineProps<{
    id?: number
    type: number
}>()

const breakpoints = ref({
    350: {
        slidesPerView: 2,
        spaceBetween: 10,
    },
    750: {
        slidesPerView: 2,
        spaceBetween: 10,
    },
    900: {
        slidesPerView: 3,
        spaceBetween: 15,
    },
    1024: {
        slidesPerView: 4,
        spaceBetween: 20,
    },
    1255: {
        slidesPerView: 5,
        spaceBetween: 30,
    },
})

const navigation = {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
}

const { classifyList } = await useGoodsClassifyState()
const swiperList = computed(() => classifyList.value.filter(item => item.type === props.type))
// const swiperList = computed(() => {
//     const list = classifyList.value.filter(item => item.type === props.type)
//     return [
//         {
//             id: 0,
//             title: '首页',
//             title_en: 'Home',
//             children: [],
//             icon: 'icon-home',
//             icon_en: 'icon-home',
//         },
//         ...list,
//     ]
// })

/**
 * 根据当前一级id(或字段)查找上级所有的节点内容
 * @param classifyList 嵌套数组
 * @param val 需要查找的值
 * @param key 查找值对应的键值，默认为id
 * @param children 子类的键值，默认children
 * @returns any[]
 */
function getParentNode<T = any>(classifyList: Array<T>, val: T[keyof T], key = 'id' as keyof T, children = 'children' as keyof T): T[] {
    const temp: any[] = []
    const forFn = function (arr: any[], id: T[keyof T]) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            // 找到值对应的那一项，追加进去
            if (item[key] === val) temp.push(item)
            if (item[children]) {
                const data1 = item[children].find((item1: any) => {
                    return item1[key] === id
                })
                if (data1) {
                    temp.unshift(item) // 数组前面追加进去
                    forFn(classifyList, item[key])
                    break
                } else {
                    forFn(item[children], id)
                }
            }
        }
    }
    forFn(classifyList, val)
    return temp
}

const route = useRoute()
const query = route.query as GoodsListParamsQuery
const cid = ref(props.id || query.cid) // 当前分类id
const setClassifyName = (id: number) => {
    if (props.id) {
        cid.value = props.id
    }

    if (cid.value) {
        const list = getParentNode(classifyList.value, Number(cid.value), 'id')
        return list[0]?.id === id ? 'type_active' : ''
    } else {
        return id === 0 ? 'type_active' : ''
    }
}

const childrenItem = (list?: IClassifyListResponse[]) => {
    if (list?.length) {
        const node = list.find(item => item.id === cid.value)
        return node
    } else {
        return undefined
    }
}

const linkGoodsListUrl = (param: GoodsListParams) => {
    return linkGoodsList(param, props.type === 2 ? '/product2' : '/product')
}

watch(() => route.query.cid, (val) => {
    if (!props.id) cid.value = Number(val)
})
</script>

<style lang="scss" scoped>
.goods-classify {
    --swiper-theme-color: var(--ci-main-color);
    --swiper-navigation-size: 24px;

    @media screen and (max-width: 768px) {
        --swiper-navigation-size: 18px;
        --swiper-navigation-sides-offset: 10px;
    }

    :deep(.swiper) {
        overflow: unset;
    }

    .swiper-item {


        >a {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            padding: 12px 10px;
            border: 1px solid #ddd;
            font-size: 16px;
        }

        .sub-item {
            background-color: #fff;
            border: 1px solid #ddd;
            display: none;
            position: absolute;
            left: 0;
            top: 100%;
            width: 100%;
            z-index: 20;

            a {
                padding: 8px 10px;
                display: block;
                transition: all 0.5s;

                &:hover {
                    color: var(--ci-white);
                    background-color: var(--ci-main-color);
                }
            }
        }

        &.active,
        &:hover {
            &>a {
                background-color: var(--ci-main-color);
                border-color: var(--ci-main-color);
                color: var(--ci-white);
            }

        }

        &:hover {
            .sub-item {
                display: block;
            }
        }
    }
}
</style>
