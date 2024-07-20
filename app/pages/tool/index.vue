<template>
    <div class="tool_list">
        <section class="sec_top">
            <div class="container">
                <div class="im">
                    <i class="fa fa-eercast"></i>
                </div>
                <h3 class="tle">{{ detail.sub_name }}</h3>
                <div class="intro" v-html="detail.classify_intro"></div>
            </div>
        </section>
        <section class="sec_mid">
            <div class="container">
                <ul class="ul_list">
                    <li v-for="item in listData" :key="item.id">
                        <NuxtLink :to="item.url">
                            <i :class="item.icon"></i>
                            <div class="tle">{{item.name}}</div>
                            <div class="intro">{{item.intro}}</div>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup>
import { reactive, ref, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";


const detail = reactive({
    sub_name: '工具箱( ╯□╰ )',
    classify_intro: '<div>平时会用到的工具,...</div>'
});


const listData=ref([
    {
        id: 1,
        name: 'CSS工具',
        url: '/tool/color',
        icon: 'i-ep-brush',
        intro: 'CSS颜色/透明度渐变、阴影、圆角、噪音/纹理'
    },
    {
        id: 2,
        name: 'CSS3 剪贴路径(Clip-path)',
        url: '/tool/path',
        icon: 'i-ep-paperclip',
        intro: '*'
    },
    {
        id: 3,
        name: '正则可视化',
        url: '/tool/regex',
        icon: 'i-ep-scale-to-original',
        intro: 'JavaScript 正则表达式可视化工具'
    },
    {
        id: 4,
        name: '计算器',
        url: '/tool/calc',
        icon: 'i-ep-calendar',
        intro: '支持键盘输入的计算器'
    },
    {
        id: 5,
        name: 'JSON 生成器',
        url: '/tool/json',
        icon: 'i-ep-aim',
        intro: 'JSON生成器 - 生成随机数据的工具'
    },
    {
        id: 6,
        name: 'JQuery、CSS选择器',
        url: '/tool/select',
        icon: 'i-ep-odometer',
        intro: 'JQuery选择器、CSS选择器大全'
    },
    // {
    //     id: 7,
    //     name: 'cdn',
    //     url: '/tool/cdn',
    //     icon: 'fa-exchange',
    //     intro: '静态资源CDN库'
    // }
])
</script>

<style lang="scss" scoped>
.tool_list {
    min-height: 100vh;
}

.iframe {
    width: 100%;
    height: 100vh;
    display: block;
}

.container {
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 15px;
}

.sec_top {
    padding: 15px 0;

    .im {
        text-align: center;
        padding: 25px 0;

        .fa {
            font-size: 128px;
            color: #03a9f4;
        }
    }

    .tle {
        text-align: center;
        font-size: 42px;
        color: #2c3e50;
        margin: 0;
        padding: 10px 0;
    }

    .intro {
        text-align: center;
        width: 600px;
        max-width: 100%;
        margin: 15px auto;
        font-size: 24px;
        line-height: 1.3;
        color: #6a8bad;
    }
}

.ul_list {
    margin: 0 -15px;
    display: flex;
    flex-wrap: wrap;

    li {
        padding: 15px;
        width: 25%;

        >a {
            display: block;
            position: relative;
            background: #f2f2f2;
            border-radius: 5px;
            font-size: 24px;
            text-align: center;
            padding: 10px;
            color: #000;
            transition: all 0.2s ease-in-out;
            border: 1px solid #ddd;
            height: 100%;

            &:hover {
                background-color: #fff;
                box-shadow: 0 18px 32px -18px #000 !important;
                transform: translateY(-3px);
            }

            >i {
                color: #009999;
                font-size: 48px;
                display: block;
    margin: 10px auto;
            }

            .intro {
                color: #777;
                font-size: 14px;
                line-height: 1.8;
                padding: 10px 0;
            }
        }

        $colors: red, orange, green, blue, purple, #33ff66, #6699ff, #ff6699,
            #ff6600;

        @for $i from 1 through length($colors) {
            &:nth-child(#{length($colors)}n + #{$i}) {
                i {
                    // color:  rgba(random(255), random(255), random(255),1);
                    color: nth($colors, $i);
                    // background: lighten(nth($colors, random(length($colors))), 20%);
                }
            }
        }
    }
}

@media screen and (max-width: 960px) {
    .ul_list {
        li {
            width: calc(100% / 3);
        }
    }
}

@media screen and (max-width: 768px) {
    .ul_list {
        li {
            width: 50%;
        }
    }
}
</style>