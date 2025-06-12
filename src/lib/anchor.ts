import { nextTick, ref } from 'vue'

export function useAnchorObserver(idList: string[]) {
  const THRESHOLD_FOR_ZERO_HEIGHT = 0.01
  const TOP_THRESHOLD = 100
  const BOTTOM_THRESHOLD_RATE = 0.5

  const activeId = ref<string | undefined>('')
  const scrollTimeout = ref<number | null>(null)
  const observer = ref<IntersectionObserver | null>(null)

  const isInitialized = ref<boolean | undefined>(false) // 初始化
  const anchorPositions = ref<Map<string, number>>(new Map()) // 锚点位置表
  const viewportHeight = ref(0) // 视口高度

  const updateAnchorPositions = () => {
    const positions = new Map<string, number>()
    idList.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        positions.set(id, element.getBoundingClientRect().top + window.scrollY)
      }
    })
    anchorPositions.value = positions
  }

  const scrollToElement = (id: string, useInstant?: boolean) => {
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

  const getBestAnchorForScrollPosition = (scrollY: number) => {
    const positions = anchorPositions.value
    const vh = viewportHeight.value
    const middleScreenPos = scrollY + vh * 0.4 // 视口中偏上位置

    const sortedPositions = Array.from(positions.entries())
      .map(([id, top]) => ({ id, top }))
      .sort((a, b) => a.top - b.top)

    // 边界锚点
    if (sortedPositions.length === 0) {
      return ''
    }
    if (sortedPositions.length === 1) {
      return sortedPositions[0].id
    }

    // 遍历找到最适合的锚点
    for (let i = 0; i < sortedPositions.length; i++) {
      const current = sortedPositions[i]
      const next = sortedPositions[i + 1]

      // 如果当前锚点区域包含视口中部
      if (!next || middleScreenPos < next.top) {
        return current.id
      }
    }

    return sortedPositions[sortedPositions.length - 1].id
  }

  return {
    activeId,
    activate: async () => {
      await nextTick()

      viewportHeight.value = window.innerHeight
      updateAnchorPositions()

      observer.value = new IntersectionObserver(
        (entries) => {
          if (!isInitialized.value || scrollTimeout.value) {
            return
          }

          const scrollY = window.scrollY
          updateAnchorPositions()

          let maxVisibleRatio = -Infinity
          let visibleCandidateId = ''

          entries.forEach((entry) => {
            const id = entry.target.id
            if (!id || !idList.includes(id)) {
              return
            }

            const rect = entry.boundingClientRect
            const isZeroHeight = rect.height < 1
            let visibleRatio = 0

            if (isZeroHeight) {
              // 0高元素
              const topThreshold = TOP_THRESHOLD
              const bottomThreshold = viewportHeight.value * BOTTOM_THRESHOLD_RATE
              const visibleInViewport = rect.top <= bottomThreshold && rect.bottom >= topThreshold

              if (visibleInViewport) {
                visibleRatio = THRESHOLD_FOR_ZERO_HEIGHT
              }
            } else {
              // 可见元素
              // 计算可见比例
              const visibleHeight = Math.min(rect.bottom, viewportHeight.value) - Math.max(rect.top, 0)
              visibleRatio = Math.max(0, visibleHeight) / rect.height
            }

            if (visibleRatio > maxVisibleRatio) {
              maxVisibleRatio = visibleRatio
              visibleCandidateId = id
            }
          })

          // 优先使用可见的候选锚点
          if (visibleCandidateId && maxVisibleRatio > 0) {
            activeId.value = visibleCandidateId
            return
          }

          // 没有可见锚点时，获取最佳锚点
          activeId.value = getBestAnchorForScrollPosition(scrollY)
        },
        {
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
          rootMargin: `-${TOP_THRESHOLD}px 0px -${BOTTOM_THRESHOLD_RATE * 100}% 0px`,
        }
      )

      const hash = window.location.hash.substring(1)
      if (hash && idList.includes(hash)) {
        scrollToElement(hash, true)
      }

      await new Promise((resolve) => {
        let resolved = false
        const resolveIfNeeded = () => {
          if (!resolved) {
            resolved = true
            resolve(true)
          }
        }

        idList.forEach((id) => {
          const element = document.getElementById(id)
          if (element) {
            observer.value?.observe(element)
            if (!resolved) {
              resolveIfNeeded()
            }
          } else {
            // 如果元素不存在，重试
            const timer = setInterval(() => {
              const elem = document.getElementById(id)
              if (elem) {
                observer.value?.observe(elem)
                clearInterval(timer)
                if (!resolved) {
                  resolveIfNeeded()
                }
              }
            }, 100)
          }
        })
        setTimeout(resolveIfNeeded, 1000)
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
