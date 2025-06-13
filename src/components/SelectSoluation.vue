<script setup lang="ts">

import { onMounted, onUnmounted, ref, type HTMLAttributes } from 'vue';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './shadcn-vue/tabs';

const prop = defineProps<{
    soluationList: Array<{
        name: string,
        href: string
    }>,
    defaultSoluation: string,
    class?: HTMLAttributes['class']
}>();

let defaultNameRef = ref(prop.defaultSoluation)

onMounted(() => {
    window.addEventListener('hashchange', e => {
        //修改当前解法
        const hash = window.location.hash
        for (let l of prop.soluationList) {
            if (hash === l.href) {
                defaultNameRef.value = l.name
            }
        }
    }, false)
})
onUnmounted(() => {
    window.removeEventListener('hashchange', () => { })
})


</script>

<template>
    <Tabs :default-value="defaultSoluation" v-model:model-value="defaultNameRef">
        <TabsList class="flex flex-row gap-4 ml-68">
            <TabsTrigger v-for="l in soluationList" :value="l.name">
                {{ l.name }}
            </TabsTrigger>
        </TabsList>
        <TabsContent class="mt-2" v-for="l in soluationList" :value="l.name">
            <slot :name="l.name"></slot>
        </TabsContent>
    </Tabs>
</template>