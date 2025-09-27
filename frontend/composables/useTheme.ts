import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'theme:dark'
const isDark = ref<boolean>(false)

export function useTheme() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    isDark.value = saved ? saved === '1' : window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  watchEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      root.classList.toggle('dark', isDark.value)
      localStorage.setItem(STORAGE_KEY, isDark.value ? '1' : '0')
    }
  })

  const toggle = () => { isDark.value = !isDark.value }
  const setDark = (v: boolean) => { isDark.value = v }

  return { isDark, toggle, setDark }
}


