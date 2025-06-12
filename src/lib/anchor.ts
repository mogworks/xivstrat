import { nextTick, ref } from 'vue'

export function useAnchorObserver(idList: string[]) {
  const isInitialized = ref<boolean | undefined>(false)
  const activeId = ref<string | undefined>('')
  const scrollTimeout = ref<number | null>(null)
  const observer = ref<IntersectionObserver | null>(null)

  function scrollToElement(id: string, useInstant?: boolean) {
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
          behavior: useInstant ? 'instant' : 'smooth',
        })

        activeId.value = id
      } else {
        setTimeout(() => attemptScroll(attempt + 1), 150)
      }
    }
    attemptScroll()
  }

  return {
    activeId,
    activate: async () => {
      await nextTick()
      observer.value = new IntersectionObserver(
        (entries) => {
          if (!isInitialized.value || scrollTimeout.value) {
            return
          }

          let maxVisible = -Infinity
          let newActiveId = ''

          entries.forEach((entry) => {
            const id = entry.target.id
            if (!id || !idList.includes(id)) {
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

      const hash = window.location.hash.substring(1)
      if (hash && idList.includes(hash)) {
        scrollToElement(hash, !isInitialized.value)
      }

      await new Promise((resolve) => {
        idList.forEach((_id) => {
          const element = document.getElementById(_id)
          if (element) {
            observer.value?.observe(element)
            resolve(true)
          } else {
            // 元素不存在 再尝试
            setTimeout(() => {
              const elem = document.getElementById(_id)
              if (elem) {
                observer.value?.observe(elem)
              }
              resolve(true)
            }, 1000)
          }
        })
      })

      isInitialized.value = true
    },
    deactivate: () => {
      isInitialized.value = void 0
      activeId.value = void 0
      if (observer.value) {
        observer.value.disconnect()
        observer.value = null
      }
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
        scrollTimeout.value = null
      }
    },
    click: (id: string) => {
      if (!observer.value) {
        throw new SyntaxError('Anchor observer is not activated yet.')
      }
      history.replaceState(null, '', `#${id}`)
      scrollToElement(id, !isInitialized.value)

      // 防止滚动事件干扰
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
      }
      scrollTimeout.value = window.setTimeout(() => {
        scrollTimeout.value = null
      }, 500)
    },
  }
}
