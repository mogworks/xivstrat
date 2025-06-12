<script setup lang="ts">
import { motion } from 'motion-v'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  navList: {
    label: string
    id: string
  }[]
}>()

const baseNavItemStyle = 'relative py-1.5 px-2 rounded-md transition-colors duration-300 text-sm flex items-center'
const activeNavItemStyle = 'bg-primary/10 text-primary font-medium'
const hoverNavItemStyle = 'hover:bg-muted/50'

const activeId = ref('')
const scrollTimeout = ref<number | null>(null)
const observer = ref<IntersectionObserver | null>(null)

const scrollToElement = (id: string) => {
  const attemptScroll = (attempt = 0) => {
    if (attempt > 5) {
      return
    }
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      activeId.value = id
    } else {
      setTimeout(() => attemptScroll(attempt + 1), 150)
    }
  }
  attemptScroll()
}

const handleNavClick = (id: string) => {
  activeId.value = id
  history.replaceState(null, '', `#${id}`)
  scrollToElement(id)

  // 防止滚动事件干扰
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  scrollTimeout.value = window.setTimeout(() => {
    scrollTimeout.value = null
  }, 500)
}

const setupIntersectionObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      if (scrollTimeout.value) {
        return
      }

      let maxVisible = -Infinity
      let newActiveId = ''

      entries.forEach((entry) => {
        const id = entry.target.id
        if (!id || !props.navList.some(nav => nav.id === id)) {
          return
        }

        // 计算可见度比例
        const visibleHeight =
          Math.min(entry.boundingClientRect.bottom, window.innerHeight) - Math.max(entry.boundingClientRect.top, 0)
        const visibleRatio = Math.max(0, visibleHeight) / entry.boundingClientRect.height
        if (visibleRatio > maxVisible) {
          maxVisible = visibleRatio
          newActiveId = id
        }
      })

      // 可见度超过10% 激活
      if (maxVisible > 0.1 && newActiveId) {
        activeId.value = newActiveId
      }
    },
    {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      rootMargin: '-100px 0px -50% 0px',
    }
  )

  props.navList.forEach((nav) => {
    const element = document.getElementById(nav.id)
    if (element) {
      observer.value?.observe(element)
    } else {
      // 元素不存在 再尝试
      setTimeout(() => {
        const elem = document.getElementById(nav.id)
        if (elem) {
          observer.value?.observe(elem)
        }
      }, 500)
    }
  })
}

onMounted(async () => {
  await nextTick()
  const hash = window.location.hash.substring(1)
  if (hash && props.navList.some(nav => nav.id === hash)) {
    activeId.value = hash
    scrollToElement(hash)
  }

  setupIntersectionObserver()

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
      scrollTimeout.value = null
    }
  })
})
</script>

<template>
  <aside
    class="bg-card text-card-foreground sticky top-[calc(5rem+1px)] mx-4 space-y-4 self-start rounded-lg border p-4 shadow-md"
  >
    <nav class="space-y-2">
      <h2 class="text-md font-semibold">
        导航
      </h2>
      <ul class="space-y-1">
        <motion.li
          v-for="nav in navList"
          :key="nav.id"
          :while-hover="{ x: 2 }"
          :transition="{ type: 'tween', duration: 0.2 }"
          @click.prevent="handleNavClick(nav.id)"
        >
          <a
            :href="`#${nav.id}`"
            :class="`${baseNavItemStyle} ${hoverNavItemStyle} ${activeId === nav.id ? activeNavItemStyle : ''}`"
          >
            <span v-if="activeId === nav.id" class="bg-primary absolute left-0 h-4 w-1 rounded-full" />
            <span class="ml-1">{{ nav.label }}</span>
          </a>
        </motion.li>
      </ul>
    </nav>
  </aside>
</template>
