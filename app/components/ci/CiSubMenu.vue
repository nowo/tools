<template>
    <section class="child-menu-box">
        <div class="container px10px ma flex items-center justify-center gap-10px">
            <ClientOnly>
                <NuxtLinkLocale v-for="(item, index) in activeMenu?.children?.filter(i => i.status)" :key="item.id"
                    :to="item.href || ''" class="link-a"
                    :class="{ active: setActiveClassName(item.href || '', index) }">
                    {{ $lang(item.title, item.title_en) }}
                </NuxtLinkLocale>
            </ClientOnly>
        </div>
    </section>
</template>

<script lang="ts" setup>
const { $lang } = useNuxtApp()
const props = defineProps<{
    type?: 'news'
    value?: number
}>()

const { activeMenu, menuList } = await useMenuState()

const route = useRoute()
const setActiveClassName = (url: string, index: number) => {
    if (route.path.startsWith('/en')) {
        return route.path === `/en${url}`
    } else {
        return route.path === url || props.value === index + 1
    }
}
</script>

<style></style>

<style lang="scss" scoped></style>
