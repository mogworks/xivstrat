const initTheme = () => {
  const localStorageTheme = localStorage.getItem('theme') ?? ''
  const resolvedTheme = (() => {
    if (['dark', 'light'].includes(localStorageTheme)) {
      return localStorageTheme
    } else if (localStorageTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      return 'dark'
    }
  })()
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
}

initTheme()

// See https://docs.astro.build/en/guides/view-transitions/#script-re-execution
// Runs in response to the astro:after-swap event, which happens immediately after the new page has replaced the old page and before the DOM elements are painted to the screen.
// This avoids a flash of light theme after page navigation by checking and, if necessary, setting the dark mode theme before the new page is rendered
document.addEventListener('astro:after-swap', initTheme)
