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
    task: {
      loading: '正在加载任务…', noHistory: '暂无对话记录。', noLogs: '未找到执行日志。',
      dashboard: '数据面板', launch: '启动任务', selectGraph: '1. 选择已部署的图谱：',
      taskAlias: '2. 任务别名：', configInputs: '3. 配置输入（JSON）：', cancel: '取消', delete: '删除',
      newTrigger: '新建触发器', triggerTitle: '触发器标题…', triggerTime: '时间（HH:MM）',
      workflowInputs: '工作流输入（JSON）…', create: '创建', run: '运行', monitor: '监控',
      noRunning: '当前没有运行中的任务。', visualizer: '图谱可视化', stopProcess: '停止进程',
      selectTask: '请选择任务查看流程…', noAgentNodes: '没有核心 Agent 节点',
    },
    memory: {
      keep: '保留', forget: '遗忘', database: '记忆数据库', search: '搜索', hybrid: '混合检索',
      cognition: '认知', knowledgeGraph: '知识图谱', experiences: '经历', vector: '向量记忆（前 30 条）',
      events: '事件', facts: '客观事实（前 30 条）', rawNotes: '原始记忆笔记', refresh: '刷新',
      ask: '向你的记忆提问…', searchHint: '按 Enter 搜索记忆…', syncing: '正在同步所有三元组…',
      emptyGraph: '图谱为空，请点击刷新。', forgetConfirm: '确定要遗忘这条记忆吗？',
    },
    market: {
      description: '描述：', mcpServers: 'MCP 服务（Schema）：', requiredEnv: '必需环境变量：',
      fetching: '正在获取仓库…', skills: '技能', capabilities: 'Agent 能力', servers: 'MCP 服务',
      providers: '上下文提供者', sensors: '传感器', triggers: '自主触发器', graphs: '图谱',
      templates: '工作流模板', loops: '循环', paradigms: 'Agent Loop 范式', refresh: '刷新',
      searchSkills: '搜索技能名称 / 描述 / 仓库 / 作者…', searchMcp: '搜索 MCP 名称 / 描述 / 仓库 / 服务…',
      searchSensors: '搜索传感器名称 / 描述…', searchGraphs: '搜索图谱名称 / 描述…',
      noWant: '没找到想要的？试试：', comingSoon: '即将上线', loopSoon: 'Agent Loop 市场即将上线，敬请期待。',
      buildMcp: '从零构建 MCP', mcpName: 'MCP 名称：', targetFunction: '目标功能：',
      install: '安装', installed: '已安装', observe: '观察', express: '表达',
    },
    evolve: {
      back: '返回', factory: '工厂', processing: '处理中', noItems: '当前没有处理中的项目。',
      buildGoal: '构建目标', sandboxFiles: '沙盒文件', archives: '归档', noArchives: '暂无归档。',
      selectReport: '请选择一次迭代查看报告…', diffReview: '差异审查', reloadDiff: '重新加载差异',
      revertMain: '恢复主分支', reject: '拒绝并要求返工', approve: '批准并合并',
      selectProcess: '请选择一个处理项目开始。', feedback: '反馈与返工', cancel: '取消',
      deleteSandbox: '删除沙盒？', revertConfirm: '恢复主分支？', editEvals: '编辑 evals.json',
      runEvaluator: '运行评估器', refreshArchives: '刷新归档',
    },
    editor: {
      loadingNodes: '正在加载节点…', workflow: '工作流', open: '打开', savedGraphs: '已保存图谱',
      nothing: '暂无内容', validate: '校验', clearCanvas: '清空画布', deploy: '部署', file: '文件',
      paradigms: '范式', save: '保存', saveWorkflow: '保存工作流', namePrompt: '为你的工作流命名：',
      descriptionPrompt: '添加描述（可选）：', clearConfirm: '清空画布？', deleteParadigm: '删除范式？',
    },
    chat: {
      greeting: '今天我们要构建什么？', todayCalls: '今日调用', tokensBurnt: '消耗 Token', cacheHit: '缓存命中',
      annualContributions: '年度贡献', copied: '已复制！', assistant: '助手', dropFiles: '将文件拖到这里以添加！',
      writePrompt: '在这里输入你的指令…', selectChat: '请先选择一个会话！', moreTools: '更多工具',
      openBrowser: '在浏览器中打开', linkPreview: '链接预览', loadingMarkdown: '正在加载 Markdown…',
      allFilesClean: '所有文件都已处理！', selectFile: '请选择文件…', noVisualDiff: '未检测到可视差异。',
      seconds: '秒', saveConfig: '保存配置', openExternally: '在外部浏览器打开', cancel: '取消',
      noMcpLoaded: '尚未加载 MCP', noSkillsLoaded: '尚未加载技能', noAlarms: '尚未配置提醒', noSensors: '未找到传感器',
      noFileOpen: '没有打开文件', selectFileExplorer: '请从文件浏览器选择文件', newChat: '新建会话',
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
    task: {
      loading: 'LOADING TASK...', noHistory: 'No conversation history yet.', noLogs: 'No execution logs found.',
      dashboard: 'Data Dashboard View', launch: 'LAUNCH MISSION', selectGraph: '1. Select Deployed Graph:',
      taskAlias: '2. Task Alias:', configInputs: '3. Configuration inputs (JSON):', cancel: 'CANCEL', delete: 'DELETE',
      newTrigger: 'NEW TRIGGER', triggerTitle: 'Trigger Title...', triggerTime: 'Time (HH:MM)',
      workflowInputs: 'Workflow Inputs (JSON)...', create: 'CREATE', run: 'Run', monitor: 'MONITOR',
      noRunning: 'No tasks running.', visualizer: 'GRAPH VISUALIZER', stopProcess: 'STOP PROCESS',
      selectTask: 'Select a task to view its flow...', noAgentNodes: 'No Core Agent Nodes',
    },
    memory: {
      keep: 'KEEP', forget: 'FORGET', database: 'MEMORY DB', search: 'SEARCH', hybrid: 'Hybrid Retrieval',
      cognition: 'COGNITION', knowledgeGraph: 'Knowledge Graph', experiences: 'EXPERIENCES', vector: 'Vector Memory (Top 30)',
      events: 'EVENTS', facts: 'Objective Facts (Top 30)', rawNotes: 'Raw Memory Notes', refresh: 'REFRESH',
      ask: 'Ask your memory anything...', searchHint: 'Hit Enter to search the void...', syncing: 'Syncing All Triples...',
      emptyGraph: 'Graph is empty. Try clicking REFRESH.', forgetConfirm: 'Forget this memory?',
    },
    market: {
      description: 'DESCRIPTION:', mcpServers: 'MCP SERVERS (SCHEMA):', requiredEnv: 'REQUIRED ENV:',
      fetching: 'Fetching Repositories...', skills: 'SKILLS', capabilities: 'Agent Capabilities', servers: 'MCP SERVERS',
      providers: 'Context Providers', sensors: 'SENSORS', triggers: 'Autonomous Triggers', graphs: 'GRAPHS',
      templates: 'Workflow Templates', loops: 'LOOPS', paradigms: 'Agent Loop Paradigms', refresh: 'REFRESH',
      searchSkills: 'Search skills / descriptions / repositories / authors…', searchMcp: 'Search MCP names / descriptions / repositories / servers…',
      searchSensors: 'Search sensor names / descriptions…', searchGraphs: 'Search graph names / descriptions…',
      noWant: 'No want? Try:', comingSoon: 'COMING SOON', loopSoon: 'Agent Loop marketplace is coming soon.',
      buildMcp: 'Build a MCP from Scratch', mcpName: 'MCP NAME:', targetFunction: 'TARGET FUNCTION:',
      install: 'Install', installed: 'Installed', observe: 'OBSERVE', express: 'EXPRESS',
    },
    evolve: {
      back: 'BACK', factory: 'FACTORY', processing: 'Processing Lines', noItems: 'No items processing.',
      buildGoal: 'Build Goal', sandboxFiles: 'SANDBOX FILES', archives: 'ARCHIVES', noArchives: 'No archives yet.',
      selectReport: 'Select an iteration to view report...', diffReview: 'DIFF REVIEW', reloadDiff: 'Reload Diff',
      revertMain: 'Revert Main to Previous', reject: 'Reject & Request Rework', approve: 'Approve & Merge',
      selectProcess: 'Select a process to start.', feedback: 'FEEDBACK & REWORK', cancel: 'CANCEL',
      deleteSandbox: 'DELETE SANDBOX?', revertConfirm: 'REVERT MAIN?', editEvals: 'Edit Evals.json',
      runEvaluator: 'Run Evaluator', refreshArchives: 'Refresh Archives',
    },
    editor: {
      loadingNodes: 'Loading Nodes...', workflow: 'WORKFLOW', open: 'OPEN', savedGraphs: 'SAVED GRAPHS',
      nothing: 'Nothing here', validate: 'Validate', clearCanvas: 'Clear Canvas', deploy: 'DEPLOY', file: 'FILE',
      paradigms: 'PARADIGMS', save: 'Save', saveWorkflow: 'SAVE WORKFLOW', namePrompt: 'Give your cat-powered graph a name:',
      descriptionPrompt: 'Add a description (optional):', clearConfirm: 'CLEAR CANVAS?', deleteParadigm: 'DELETE PARADIGM?',
    },
    chat: {
      greeting: 'Hi, what are we building today?', todayCalls: 'TODAY CALLS', tokensBurnt: 'TOKENS BURNT', cacheHit: 'CACHE HIT',
      annualContributions: 'ANNUAL CONTRIBUTIONS', copied: 'Copied!', assistant: 'ASSISTANT', dropFiles: 'Drop files here to attach!',
      writePrompt: 'Write your prompt here...', selectChat: 'Select a chat first!', moreTools: 'More Tools',
      openBrowser: 'Open in Browser', linkPreview: 'Link Preview', loadingMarkdown: 'LOADING MARKDOWN...',
      allFilesClean: 'All files clean!', selectFile: 'Select a file...', noVisualDiff: 'No visual difference detected.',
      seconds: 'SECONDS', saveConfig: 'SAVE CONFIG', openExternally: 'OPEN EXTERNALLY', cancel: 'CANCEL',
      noMcpLoaded: 'No MCP loaded', noSkillsLoaded: 'No Skills loaded', noAlarms: 'No Alarms configured', noSensors: 'No Sensors found',
      noFileOpen: 'No file open', selectFileExplorer: 'Select a file from the explorer', newChat: 'NEW CHAT',
    },
  },
} as const

type Messages = typeof messages['zh-CN']
type TranslationKey = string

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
