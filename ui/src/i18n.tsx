import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Locale = 'zh-CN' | 'en-US'

const STORAGE_KEY = 'purrcat-locale'

const messages = {
  'zh-CN': {
    common: {
      language: '语言', chinese: '简体中文', english: 'English',
      minimize: '最小化', maximize: '最大化', close: '关闭',
      noWorkspace: '未指定工作区。',
    },
    home: {
      settings: '配置中心', chat: '聊天', chatDescription: '与 Agent 对话',
      task: '任务', taskDescription: 'Agent 工作流', editor: '编辑器', editorDescription: 'DAG 编辑器',
      market: '市场', marketDescription: '技能浏览器', memory: '记忆', memoryDescription: '知识图谱',
      evolve: '进化', evolveDescription: '技能工厂',
    },
    setup: {
      firstRun: '首次运行', title: '设置数据盘',
      description: '沙盒虚拟环境（agent_vm）、向量模型等', largeFiles: '大文件',
      descriptionMiddle: '会存放在数据盘；对话记录、配置等', smallData: '小数据固定在用户目录',
      descriptionEnd: '。之后随时可以在配置中心更换数据盘。', location: '数据盘位置',
      hint: '设置完成后请重启程序生效；日后如需更换，可在配置中心数据根目录旁点击铅笔图标。',
      choose: '选择数据盘…', saving: '保存中…', useSelected: '使用该位置', useDefault: '使用默认位置',
      unsupported: '当前环境不支持选择文件夹', saved: '数据盘设置成功，请手动重启 PurrCat 后生效',
      saveFailed: '保存失败', networkError: '网络错误，无法连接后端',
    },
  },
  'en-US': {
    common: {
      language: 'Language', chinese: '简体中文', english: 'English',
      minimize: 'Minimize', maximize: 'Maximize', close: 'Close',
      noWorkspace: 'No workspace specified.',
    },
    home: {
      settings: 'Settings', chat: 'CHAT', chatDescription: 'Talk to Agent',
      task: 'TASK', taskDescription: 'Agent Workflows', editor: 'EDITOR', editorDescription: 'DAG Editor',
      market: 'MARKET', marketDescription: 'Skills Explorer', memory: 'MEMORY', memoryDescription: 'Knowledge Graph',
      evolve: 'EVOLVE', evolveDescription: 'Skill Factory',
    },
    setup: {
      firstRun: 'FIRST RUN', title: 'Set Up Data Directory',
      description: 'Large files such as the sandbox (agent_vm) and embedding models are stored in the data directory. ',
      largeFiles: '', descriptionMiddle: 'Conversation history and configuration remain in the user directory. ',
      smallData: '', descriptionEnd: 'You can change the data directory later from Settings.', location: 'Data directory',
      hint: 'Restart the application after setup. To move it later, use the pencil icon next to the data directory in Settings.',
      choose: 'Choose data directory…', saving: 'Saving…', useSelected: 'Use this location', useDefault: 'Use default location',
      unsupported: 'Folder selection is not available in this environment', saved: 'Data directory saved. Please restart PurrCat to apply it.',
      saveFailed: 'Save failed', networkError: 'Network error: unable to connect to the backend',
    },
  },
} as const

type Messages = typeof messages['zh-CN']
type TranslationKey =
  | `common.${keyof Messages['common']}`
  | `home.${keyof Messages['home']}`
  | `setup.${keyof Messages['setup']}`

function getInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'zh-CN' || stored === 'en-US') return stored
  } catch {
    // localStorage may be unavailable in restricted browser contexts.
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale)
    } catch {
      // Keep the in-memory locale working when persistence is unavailable.
    }
  }

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18nContextValue>(() => {
    const localeMessages = messages[locale]
    const fallbackMessages = messages['en-US']
    const t = (key: TranslationKey) => {
      const [section, name] = key.split('.') as [keyof Messages, string]
      const sectionMessages = localeMessages[section] as Record<string, string>
      const fallbackSection = fallbackMessages[section] as Record<string, string>
      return sectionMessages[name] || fallbackSection[name] || key
    }
    return {
      locale,
      setLocale,
      toggleLocale: () => setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN'),
      t,
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// The provider and hook intentionally live together so consumers only need one import.
// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useTranslation must be used inside LocaleProvider')
  return context
}
