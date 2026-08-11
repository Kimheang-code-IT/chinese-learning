import wordData from '../data/word.json'

export interface WordItem {
  pinyin: string
  hanzi: string
  khmer_pinyin: string
  english: string
  khmer: string
  sentencePinyin?: string
  sentenceHanzi?: string
  sentenceKhmer?: string
}

export interface BookData {
  title: string
  subtitle: string
  words: WordItem[]
}

interface RawWord {
  hanzi: string
  pinyin: string
  khmer_pinyin?: string
  meaning_english?: string
  meaning_khmer?: string
  example_sentence_pinyin?: string
  example_sentence?: string
  example_sentence_meaning_khmer?: string
}

function mapWords(items: RawWord[]): WordItem[] {
  return items.map(w => ({
    hanzi: w.hanzi || '',
    pinyin: w.pinyin || '',
    khmer_pinyin: w.khmer_pinyin || '',
    english: w.meaning_english || '',
    khmer: w.meaning_khmer || '',
    sentencePinyin: w.example_sentence_pinyin || '',
    sentenceHanzi: w.example_sentence || '',
    sentenceKhmer: w.example_sentence_meaning_khmer || ''
  }))
}

const books: Record<number, BookData> = {
  1: {
    title: 'Book 01 Chinese Words ( 汉字笔画 )',
    subtitle: 'Chinese Character Strokes - Words 1-100',
    words: mapWords((wordData as RawWord[]).slice(0, 100))
  },
  2: {
    title: 'Book 02 Chinese Words ( 基础词汇 )',
    subtitle: 'Foundation Vocabulary - Words 101-200',
    words: mapWords((wordData as RawWord[]).slice(100, 200))
  },
  3: {
    title: 'Book 03 Chinese Words ( 进阶词汇 )',
    subtitle: 'Intermediate Vocabulary - Words 201-300',
    words: mapWords((wordData as RawWord[]).slice(200, 300))
  }
}

export function useWords() {
  const getBook = (bookNo: number): BookData => books[bookNo] || books[1]!

  const getWord = (bookNo: number, wordNo: number): WordItem => {
    const book = getBook(bookNo)
    const index = Math.max(0, wordNo - 1)
    return book.words[index] || book.words[0] || {
      hanzi: '一',
      pinyin: 'yī',
      khmer_pinyin: 'អ៊ី',
      english: 'One',
      khmer: 'មួយ'
    }
  }

  return {
    getBook,
    getWord
  }
}
