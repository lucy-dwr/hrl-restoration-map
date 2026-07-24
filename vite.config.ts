import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function getPublicBasePath(value: string | undefined): string {
  if (value === undefined || value.trim() === '') return '/'

  const path = value.trim()
  if (!path.startsWith('/') || path.includes('?') || path.includes('#') || path.includes('\\')) {
    throw new Error(
      'PUBLIC_BASE_PATH must be an absolute path such as / or /restoration-map/.'
    )
  }

  return `${path.replace(/\/+$/, '') || ''}/`
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '.', '')

  return {
    base: getPublicBasePath(environment.PUBLIC_BASE_PATH),
    plugins: [react()],
  }
})
