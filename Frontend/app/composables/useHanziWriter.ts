import HanziWriter from "hanzi-writer"
import { ref, shallowRef, nextTick } from 'vue'
import type { ComputedRef } from 'vue'

type WriterWithQuiz = HanziWriter & {
  quiz?: (options: {
    showHintAfterMisses?: number
    highlightOnComplete?: boolean
    onComplete?: () => void
  }) => void
  cancelQuiz?: () => void
}

function devLog(message: string, error: unknown): void {
  if (import.meta.dev) console.debug(message, error)
}

export function useHanziWriter(
  chars: ComputedRef<string[]>,
  bookNo: ComputedRef<number>,
  wordNo: ComputedRef<number>
) {
  const charWriterIds = computed(() =>
    chars.value.map((_, index) => `hanzi-writer-${bookNo.value}-${wordNo.value}-${index}`)
  )
  const _unmounted = false
  const charWriters = shallowRef<HanziWriter[]>([])
  const writersReady = ref(false)
  const isAnimating = ref(false)
  const isQuizActive = ref(false)
  const activeQuizIndex = ref<number | null>(null)
  const showSuccessAnimation = ref<number | null>(null)
  const strokeOrderGroups = ref<Array<{ char: string; steps: string[] }>>([])

  async function initWriters(): Promise<void> {
    if (!import.meta.client) return
    await nextTick()
    const instances: HanziWriter[] = []
    for (let i = 0; i < chars.value.length; i++) {
      const targetId = charWriterIds.value[i]
      const char = chars.value[i]
      if (!targetId || !char) continue
      const target = document.getElementById(targetId)
      if (!target) continue
      target.innerHTML = ""
      const targetRect = target.getBoundingClientRect()
      const boxSize = Math.max(96, Math.floor(Math.min(targetRect.width || 150, targetRect.height || 150)))
      const padding = Math.max(5, Math.round(boxSize * 0.06))
      const writer = HanziWriter.create(target, char, {
        width: boxSize,
        height: boxSize,
        padding,
        showCharacter: true,
        showOutline: true,
        strokeAnimationSpeed: 0.5,
        delayBetweenStrokes: 500,
        strokeColor: "#dc2626",
        radicalColor: "#dc2626",
        outlineColor: "#cbd5e1",
        drawingColor: "#0f172a",
        highlightColor: "#f59e0b",
      })
      writer.showCharacter?.({ duration: 0 })
      writer.showOutline?.({ duration: 0 })
      instances.push(writer)
    }
    if (_unmounted) return
    charWriters.value = instances
    writersReady.value = true
  }

  async function loadStrokeOrderGroups(): Promise<void> {
    if (!import.meta.client) return
    const groups: Array<{ char: string; steps: string[] }> = []
    for (const char of chars.value) {
      if (!char) continue
      try {
        const charData = await HanziWriter.loadCharacterData(char)
        if (!charData?.strokes?.length) {
          groups.push({ char, steps: [] })
          continue
        }
        const transform = HanziWriter.getScalingTransform(72, 72, 6)
        const steps = charData.strokes.map((_: string, index: number) => {
          const paths = charData.strokes
            .slice(0, index + 1)
            .map((strokePath: string, strokeIndex: number) => {
              const fill = strokeIndex === index ? "#dc2626" : "#6b6a69"
              return `<path d="${strokePath}" fill="${fill}" />`
            })
            .join("")
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72"><g transform="${transform.transform}">${paths}</g></svg>`
        })
        groups.push({ char, steps })
      } catch (error: unknown) {
        devLog('Failed to load stroke order data', error)
        groups.push({ char, steps: [] })
      }
    }
    if (_unmounted) return
    strokeOrderGroups.value = groups
  }

  function stopAnimation(): void {
    isAnimating.value = false
    charWriters.value.forEach((writer: HanziWriter) => {
      try { (writer as WriterWithQuiz)?.cancelQuiz?.() } catch (error: unknown) { devLog('Failed to cancel quiz', error) }
    })
  }

  function resetWriterDisplay(): void {
    activeQuizIndex.value = null
    charWriters.value.forEach((writer: HanziWriter) => {
      try {
        (writer as WriterWithQuiz)?.cancelQuiz?.();
        writer?.showCharacter?.({ duration: 0 });
        writer?.showOutline?.({ duration: 0 });
      } catch (error: unknown) {
        devLog('Failed to reset writer display', error)
      }
    })
  }

  async function playAnimation(): Promise<void> {
    if (!writersReady.value) await initWriters()
    if (!charWriters.value.length) return
    isAnimating.value = true
    isQuizActive.value = false
    activeQuizIndex.value = null
    resetWriterDisplay()
    charWriters.value.forEach((writer: HanziWriter) => {
      try { writer?.hideCharacter?.({ duration: 0 }); writer?.showOutline?.({ duration: 0 }) } catch (error: unknown) { devLog('Failed to prepare animation', error) }
    })
    for (const writer of charWriters.value) {
      if (!isAnimating.value) break
      await new Promise<void>((resolve) => {
        try {
          writer?.animateCharacter?.({ onComplete: () => resolve() })
        } catch (error: unknown) { devLog('Failed to animate character', error); resolve() }
      })
    }
    if (_unmounted) return
    isAnimating.value = false
    if (!_unmounted) resetWriterDisplay()
  }

  function toggleAnimation(): void {
    if (isAnimating.value) { stopAnimation(); return }
    playAnimation()
  }

  async function toggleQuiz(): Promise<void> {
    if (!writersReady.value) await initWriters()
    if (!charWriters.value.length) return
    if (isQuizActive.value) {
      isQuizActive.value = false
      activeQuizIndex.value = null
      resetWriterDisplay()
      return
    }
    isQuizActive.value = true
    isAnimating.value = false
    resetWriterDisplay()
    charWriters.value.forEach((writer: HanziWriter) => {
      try { writer?.hideCharacter?.({ duration: 0 }); writer?.showOutline?.({ duration: 0 }) } catch (error: unknown) { devLog('Failed to prepare quiz mode', error) }
    })
    const startQuizAt = (index: number) => {
      if (!isQuizActive.value) return
      const writer = charWriters.value[index]
      if (!writer) {
        isQuizActive.value = false
        activeQuizIndex.value = null
        resetWriterDisplay()
        return
      }
      activeQuizIndex.value = index
      try {
        (writer as WriterWithQuiz)?.quiz?.({
          showHintAfterMisses: 2,
          highlightOnComplete: true,
          onComplete: () => {
            if (!isQuizActive.value) return
            try { writer?.showCharacter?.({ duration: 0 }) } catch (error: unknown) { devLog('Failed to show character after quiz complete', error) }
            try { writer?.showOutline?.({ duration: 0 }) } catch (error: unknown) { devLog('Failed to show outline after quiz complete', error) }
            showSuccessAnimation.value = index
            setTimeout(() => {
              if (!isQuizActive.value) return
              showSuccessAnimation.value = null
              startQuizAt(index + 1)
            }, 1500)
          },
        })
      } catch (error: unknown) {
        devLog('Failed to start quiz', error)
        isQuizActive.value = false
        activeQuizIndex.value = null
        resetWriterDisplay()
      }
    }
    startQuizAt(0)
  }

  function destroyWriters(): void {
    charWriters.value.forEach((writer: HanziWriter) => {
      try { (writer as WriterWithQuiz)?.cancelQuiz?.() } catch (error: unknown) { devLog('Failed to cancel quiz during destroy', error) }
    })
    charWriters.value = []
    writersReady.value = false
  }

  return {
    charWriterIds,
    charWriters,
    writersReady,
    isAnimating,
    isQuizActive,
    activeQuizIndex,
    showSuccessAnimation,
    strokeOrderGroups,
    initWriters,
    loadStrokeOrderGroups,
    playAnimation,
    toggleAnimation,
    toggleQuiz,
    resetWriterDisplay,
    stopAnimation,
    destroyWriters
  }
}
