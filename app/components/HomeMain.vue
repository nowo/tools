<template>
    <section class="sec-index">
        <!-- 热门推荐 -->
        <div class="container ma px10px">
            <div class="py50px <md:py35px <md:pb0px">
                <h3 class="text-center text-36px <md:text-32px">
                    {{ $lang('热门产品', 'Hot Product') }}
                </h3>
                <div class="line-icon">
                </div>
            </div>

            <div class="min-h-300px">
                <Swiper :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperNavigation, SwiperPagination]"
                    :slides-per-view="1" :space-between="10" :loop="true"
                    :autoplay="{ delay: 8000, disableOnInteraction: true }" :breakpoints="breakpoints" class="py50px  <md:py40px <md:px10px">
                    <SwiperSlide v-for="item in productList" :key="item.id"
                        class="swiper-item w100% bg-#fff b-1px b-#ddd text-center">
                        <NuxtLinkLocale :to="`/product/${item.id}`" class="banner-link">
                            <div class="text-26px line-clamp-1 pt15px pb8px">
                                {{ $lang(item?.title, item?.title_en) }}
                            </div>
                            <CiClassifyName
                                class="c-#555 px5px whitespace-nowrap text-ellipsis overflow-hidden block mb10px"
                                :item="item?.classify" />
                            <CoImage class="w100% pb100% <md:ma block! <md:w95% <md:pb95%" :src="item?.img"
                                :icon-size="36" />
                        </NuxtLinkLocale>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div class="text-center mb50px">
                <NuxtLinkLocale to="/product">
                    <el-button class="min-w150px" type="primary" round size="large">
                        {{ $lang('查看更多', 'Read More') }} >>
                    </el-button>
                </NuxtLinkLocale>
            </div>
        </div>

        <!-- 咨询 -->
        <!-- <div class="news_module" style="background-image: url(assets/image/backdrop_img.jpg)"> -->
        <div class="sec-news min-h-500px relative">
            <div class="absolute top-0 left-0 w100% h100% bg-#000c opacity-50"></div>
            <div class="container ma px10px relative z-10">
                <div class="py50px <md:py35px">
                    <h3 class="text-center text-36px <md:text-32px c-#fff">
                        {{ $lang('热门产品', 'Hot Product') }}
                    </h3>
                    <div class="line-icon"> </div>
                </div>
                <div class="min-h100px">
                    <div v-if="newsList.length" class="flex justify-between gap-40px flex-wrap">
                        <NuxtLinkLocale :to="`/news/${newsList?.[0]?.id}`" class="news-left news-a">
                            <CoImage class="news-img block! w100% pb75% mb25px" fit="cover"
                                :src="newsList?.[0]?.img || ''" alt="" />
                            <div class="news_txt flex justify-between">
                                <div class="news-title flex-1">
                                    <h2 class="news-tle">
                                        {{ $lang(newsList?.[0]?.title, newsList?.[0]?.title_en) }}
                                    </h2>
                                    <div class="news-desc"
                                        v-html="$lang(newsList?.[0]?.describe, newsList?.[0]?.describe_en)"></div>
                                </div>
                                <div class="news-date">
                                    <strong class="text-48px lh-48px">{{ formatTime(newsList[0]?.createdAt, 'dd')
                                        }}</strong>
                                    <p>{{ formatTime(newsList[0]?.createdAt, 'YYYY-mm') }}</p>
                                </div>
                            </div>
                        </NuxtLinkLocale>
                        <div class="news-right">
                            <div class="news-grid">

                                <!-- .slice(1) -->
                                <NuxtLinkLocale v-for="item in newsList" :key="item.id" :to="`/news/${item.id}`"
                                    class="news_list news-a flex flex-wrap">
                                    <div class="news-date">
                                        <strong class="text-42px lh-42px">{{ formatTime(item.createdAt, 'dd')
                                            }}</strong>
                                        <p>{{ formatTime(item.createdAt, 'YYYY-mm') }}</p>
                                    </div>
                                    <div class="news-title flex-1">
                                        <h2 class="news-tle">
                                            {{ $lang(item.title, item.title_en) }}
                                        </h2>
                                        <div class="news-desc"
                                            v-html="$lang(newsList?.[0]?.describe, newsList?.[0]?.describe_en)"></div>
                                    </div>
                                </NuxtLinkLocale>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center py50px">
                    <NuxtLinkLocale to="/news">
                        <el-button class="min-w150px" type="primary" round size="large">
                            {{ $lang('查看更多', 'Read More') }} >>
                        </el-button>

                    </NuxtLinkLocale>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { Product, News } from '@prisma/client'
// import { formatTime } from '@cooj/utils'
const { $lang } = useNuxtApp()

const breakpoints = ref({
    750: {
        slidesPerView: 2,
        spaceBetween: 10,
    },
    900: {
        slidesPerView: 3,
        spaceBetween: 10,
    },
    1024: {
        slidesPerView: 4,
        spaceBetween: 15,
    },
    1255: {
        slidesPerView: 5,
        spaceBetween: 15,
    },
})

const { data } = await useCustomFetch<{ productList: IGoodsGetListItem[], newsList: News[] }>('/api/v1/page/index')
// console.log(data.value)
// const productList = computed(() => data.value?.productList || [])
// const newsList = computed(() => data.value?.newsList || [])

// // const menuState = useMenuState()
// // await menuState.getMenuList()
// // console.log(menuState.allList.value)

// // const newMenu = computed(() => {
// //     return menuState.allList.value.find(item => item.href === '/news')
// // })


const productList = computed(() => data.value?.data.productList || [])
const newsList = computed(() => data.value?.data.newsList || [])

// const menuState = useMenuState()
// await menuState.getMenuList()
// console.log(menuState.allList.value)

// const newMenu = computed(() => {
// return menuState.allList.value.find(item => item.href === '/news')
// })
</script>

<style lang="scss" scoped>
// @import url(~/assets/css/home.css);

.swiper-item {

    &:hover {
        transform: scale(1.1);
        transition: transform .3s;
        z-index: 10;
    }
}

.news-left {
    width: 55%;
}

.news-right {
    width: 45%;
    padding-left: 3.5%;

    .news-grid {
        display: grid;
        gap: 20px;
        align-items: start;
    }


    .news-a {
        .new-tle {
            font-size: 22px;
        }

        .news-date {
            width: 90px;
            background-color: #b2b2b2;
            margin-right: 15px;
            margin-left: 0px;
        }

        .news-desc {
            font-size: 14px;

        }
    }
}

.news-a {
    color: #fff;
    font-size: 16px;

    .news-date {
        width: 100px;
        background-color: #b2b2b2;
        margin-left: 10px;
        padding: 10px 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .news-tle {
        font-weight: 700;
        font-size: 24px;
        margin-bottom: 8px;
    }


    .news-desc {
        display: -webkit-box;
        font-size: 16px;
        line-height: 1.5;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
    }

    &:hover {
        .news-tle {
            color: var(--ci-main-color);

        }

        .news-date {
            background-color: var(--ci-main-color);
            color: var(--ci-white)
        }

        :deep(.news-img) {
            img {
                transform: scale(1.1);
                transition: transform .3s;
            }
        }
    }
}

@media screen and (max-width: 1280px) {
    .news-left {
        width: 46%;
    }

    .news-right {
        width: 46%;
        padding-left: 0;
    }
}

@media screen and (max-width: 768px) {
    .news-left {
        width: 100%;
    }

    .news-right {
        width: 100%;
    }
    .news-a{
        .news-date{
            >strong{
                font-size:32px;line-height:32px;
            }
        }
        .news-tle{
        font-size:18px;
        margin-bottom:4px;
    }
    }

}
</style>