<script setup lang="ts">
interface StrokeRow {
  id: number
  shape: string
  chinese: string
  pinyin: string
  english: string
  khmer: string
}

const strokeRows: StrokeRow[] = [
  { id: 1, shape: '丶', chinese: '点', pinyin: 'diǎn', english: 'dot', khmer: 'ចំណុច' },
  { id: 2, shape: '一', chinese: '横', pinyin: 'héng', english: 'horizontal', khmer: 'បន្ទាត់ផ្ដេក' },
  { id: 3, shape: '丨', chinese: '竖', pinyin: 'shù', english: 'vertical', khmer: 'បន្ទាត់ឈរ' },
  { id: 4, shape: '丿', chinese: '撇', pinyin: 'piě', english: 'left-falling', khmer: 'បន្ទាត់ឆ្វេងចុះ' },
  { id: 5, shape: '㇏', chinese: '捺', pinyin: 'nà', english: 'right-falling', khmer: 'បន្ទាត់ស្ដាំចុះ' },
  { id: 6, shape: '㇀', chinese: '提', pinyin: 'tí', english: 'rising', khmer: 'បន្ទាត់ឡើង' },

  { id: 7, shape: '㇜', chinese: '撇点', pinyin: 'piě diǎn', english: 'left-fall + dot', khmer: 'ឆ្វេងចុះ + ចំណុច' },
  { id: 8, shape: '㇙', chinese: '竖提', pinyin: 'shù tí', english: 'vertical + rise', khmer: 'ឈរ + បន្ទាត់ឡើង' },
  { id: 9, shape: '㇊', chinese: '横折提', pinyin: 'héng zhé tí', english: 'horiz-turn + rise', khmer: 'ផ្ដេកបត់ + បន្ទាត់ឡើង' },
  { id: 10, shape: '㇉', chinese: '弯钩', pinyin: 'wān gōu', english: 'curved hook', khmer: 'កោងមានកន្ទុយ' },
  { id: 11, shape: '亅', chinese: '竖钩', pinyin: 'shù gōu', english: 'vertical hook', khmer: 'ឈរមានកន្ទុយ' },
  { id: 12, shape: '乚', chinese: '竖弯钩', pinyin: 'shù wān gōu', english: 'vert-curve hook', khmer: 'ឈរបត់ កោង មានកន្ទុយ' },
  { id: 13, shape: '㇂', chinese: '斜钩', pinyin: 'xié gōu', english: 'slanted hook', khmer: 'ទ្រេតមានកន្ទុយ' },
  { id: 14, shape: '乚', chinese: '卧钩', pinyin: 'wò gōu', english: 'lying hook', khmer: 'កន្ទុយបត់' },
  { id: 15, shape: '乛', chinese: '横钩', pinyin: 'héng gōu', english: 'horizontal hook', khmer: 'ផ្ដេកមានកន្ទុយ' },
  { id: 16, shape: '𠃌', chinese: '横折钩', pinyin: 'héng zhé gōu', english: 'horiz-turn hook', khmer: 'ផ្ដេកបត់មានកន្ទុយ' },
  { id: 17, shape: '㇈', chinese: '横折弯钩', pinyin: 'héng zhé wān gōu', english: 'turn-curve hook', khmer: 'ផ្ដេកបត់កោងមានកន្ទុយ' },
  { id: 18, shape: '㇌', chinese: '横撇弯钩', pinyin: 'héng piě wān gōu', english: 'horiz-left-curve hook', khmer: 'ផ្ដេក + ឆ្វេង + កោងមានកន្ទុយ' },
  { id: 19, shape: '㇡', chinese: '横折折折钩', pinyin: 'héng zhé zhé zhé gōu', english: 'triple-turn hook', khmer: 'ផ្ដេកបត់ច្រើនមានកន្ទុយ' },
  { id: 20, shape: '㇞', chinese: '竖折折折钩', pinyin: 'shù zhé zhé zhé gōu', english: 'vert-double-turn hook', khmer: 'ឈរបត់ច្រើនមានកន្ទុយ' },
  { id: 21, shape: 'L', chinese: '竖弯', pinyin: 'shù wān', english: 'vertical curve', khmer: 'បញ្ឈរកោង' },
  { id: 22, shape: '㇍', chinese: '横折弯', pinyin: 'héng zhé wān', english: 'horiz-turn curve', khmer: 'ផ្ដេកបត់កោង' },
  { id: 23, shape: '𠃍', chinese: '横折', pinyin: 'héng zhé', english: 'horizontal turn', khmer: 'ផ្ដេកបត់' },
  { id: 24, shape: '𠄎', chinese: '竖折', pinyin: 'shù zhé', english: 'vertical turn', khmer: 'បញ្ឈរបត់' },
  { id: 25, shape: '𠃋', chinese: '撇折', pinyin: 'piě zhé', english: 'left-fall turn', khmer: 'ឆ្វេងចុះបត់' },
  { id: 26, shape: '㇇', chinese: '横撇', pinyin: 'héng piě', english: 'horiz + left-fall', khmer: 'ផ្ដេក + ឆ្វេងចុះ' },
  { id: 27, shape: '㇋', chinese: '横折折撇', pinyin: 'héng zhé zhé piě', english: 'double-turn left-fall', khmer: 'ផ្ដេកបត់ពីរដង + ឆ្វេងចុះ' },
  { id: 28, shape: '㇅', chinese: '竖折撇', pinyin: 'shù zhé piě', english: 'vert-turn left-fall', khmer: 'បញ្ឈរបត់ + ឆ្វេងចុះ' },
  { id: 29, shape: '㇃', chinese: '横斜钩', pinyin: 'héng xié gōu', english: 'horiz slanted hook', khmer: 'ផ្ដេកទ្រេតមានកន្ទុយ' },
  { id: 30, shape: '㇍', chinese: '竖折折', pinyin: 'shù zhé zhé', english: 'vertical double-turn', khmer: 'បញ្ឈរបត់ពីរដង' },
  { id: 31, shape: '㇎', chinese: '横折折', pinyin: 'héng zhé zhé', english: 'horizontal double-turn', khmer: 'ផ្ដេកបត់ពីរដង' },
  { id: 32, shape: '㇟', chinese: '横折折折', pinyin: 'héng zhé zhé zhé', english: 'horizontal triple-turn', khmer: 'ផ្ដេកបត់បីដង' }
]

useSeoMeta({
  title: 'ប្រភេទពាក្យ - Word Types',
  description: 'ប្រភេទពាក្យចិនផ្សេងៗ (Different types of Chinese words)'
})
</script>

<template>
  <UPageSection
    title="ប្រភេទគំនូសអក្សរចិន"
    description="តារាងគំនូសអក្សរចិនដែលប្រើញឹកញាប់ ជាមួយភីងអ៊ីន អង់គ្លេស និងខ្មែរ។"
    :ui="{ title: 'mb-1 lg:mb-3', description: 'mt-0 lg:mt-2' }"
    class="-mt-14"
  >
    <StocktypeTable :rows="strokeRows" />
  </UPageSection>
</template>
