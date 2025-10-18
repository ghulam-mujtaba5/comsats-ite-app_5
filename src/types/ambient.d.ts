// Ambient declarations for path aliases that may resolve at runtime but confuse TS in some files
declare module '@/lib/theme/useThemeMode' {
  export function useThemeMode(): { theme: 'light' | 'dark'; isDark: boolean; toggle: () => void }
  export default function useThemeMode(): { theme: 'light' | 'dark'; isDark: boolean; toggle: () => void }
}
