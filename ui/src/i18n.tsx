import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Locale = 'zh-CN' | 'en-US'

const STORAGE_KEY = 'purrcat-locale'

const messages = {
  'zh-CN': {
    common: {
      language: '语言', chinese: '简体中文', english: 'English',
      minimize: '最小化', maximize: '最大化', close: '关闭',
      cancel: '取消', delete: '删除', save: '保存', clear: '清空', complete: '完成',
      confirm: '确认', yes: '是', no: '否', leave: '离开', loading: '加载中…',
      noWorkspace: '未指定工作区。',
    },
    home: {
      settings: '配置中心', chat: '聊天', chatDescription: '与 Agent 对话',
      task: '任务', taskDescription: 'Agent 工作流', editor: '编辑器', editorDescription: 'DAG 编辑器',
      market: '市场', marketDescription: '技能市场', memory: '记忆', memoryDescription: '知识图谱',
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
      dashboard: '运行数据', launch: '运行工作流', selectGraph: '1. 选择已部署的图谱：',
      taskAlias: '2. 任务别名：', configInputs: '3. 配置输入（JSON）：', cancel: '取消', delete: '删除',
      newTrigger: '新建触发器', triggerTitle: '触发器标题…', triggerTime: '时间（HH:MM）',
      workflowInputs: '工作流输入（JSON）…', create: '创建', run: '运行', monitor: '监控',
      noRunning: '当前没有运行中的任务。', visualizer: '工作流运行图', stopProcess: '停止进程',
      selectTask: '请选择任务查看流程…', noAgentNodes: '没有核心 Agent 节点', noGraphs: '暂无已部署图谱', selectGraphPlaceholder: '选择图谱…', launchAction: '运行', destroyRecord: '删除记录？',
    },
    memory: {
      keep: '保留', forget: '遗忘', database: '记忆数据库', search: '搜索', hybrid: '混合检索',
      cognition: '知识图谱', knowledgeGraph: '知识图谱', experiences: '经验记忆', vector: '向量记忆（最多 30 条）',
      events: '事件记录', facts: '客观事实（最多 30 条）', rawNotes: '原始记忆笔记', refresh: '刷新',
      ask: '向你的记忆提问…', searchHint: '按 Enter 搜索记忆…', syncing: '正在同步所有三元组…',
      emptyGraph: '图谱为空，请点击刷新。', forgetConfirm: '确定要遗忘这条记忆吗？', hybridTitle: '混合搜索', graphTitle: '知识图谱', vectorTitle: '向量记忆', eventsTitle: '客观事件', tip: '提示：点击任意边（连线）即可遗忘关系。', saveToDisk: '保存到磁盘',
    },
    market: {
      description: '描述：', mcpServers: 'MCP 服务（Schema）：', requiredEnv: '必需环境变量：',
      fetching: '正在获取仓库…', skills: '技能', capabilities: 'Agent 能力', servers: 'MCP 服务',
      providers: 'MCP 上下文服务', sensors: '传感器', triggers: '自动感知与触发', graphs: '图谱',
      templates: '工作流模板', loops: '循环', paradigms: 'Agent Loop 范式', refresh: '刷新',
      searchSkills: '搜索技能名称 / 描述 / 仓库 / 作者…', searchMcp: '搜索 MCP 名称 / 描述 / 仓库 / 服务…',
      searchSensors: '搜索传感器名称 / 描述…', searchGraphs: '搜索图谱名称 / 描述…',
      noWant: '没找到想要的？试试：', comingSoon: '即将上线', loopSoon: 'Agent Loop 市场即将上线，敬请期待。', skillTitle: '技能市场', mcpTitle: 'MCP 市场', sensorTitle: '传感器市场', graphTitle: '工作流模板', loopTitle: 'Agent Loop',
      buildMcp: '从零构建 MCP', mcpName: 'MCP 名称：', targetFunction: '目标功能：',
      install: '安装', installed: '已安装', observe: '观察', express: '表达',
    },
    evolve: {
      back: '返回', factory: '工厂', processing: '进行中的工作区', noItems: '当前没有进行中的工作区。',
      buildGoal: '构建目标', sandboxFiles: '沙盒文件', archives: '归档', noArchives: '暂无归档。',
      selectReport: '请选择一次迭代查看报告…', diffReview: '变更审查', reloadDiff: '重新加载差异',
      revertMain: '回退主分支', reject: '拒绝并要求返工', approve: '批准并合并',
      selectProcess: '请选择一个处理项目开始。', feedback: '反馈与返工', cancel: '取消',
      deleteSandbox: '删除沙盒？', revertConfirm: '恢复主分支？', editEvals: '编辑 evals.json',
      runEvaluator: '运行评估器', refreshArchives: '刷新归档', mcpTools: 'MCP 工具', noFileSelected: '未选择文件', sendFeedback: '发送反馈', destroyIt: '彻底删除', doRevert: '确认回退',
    },
    editor: {
      loadingNodes: '正在加载节点…', workflow: '工作流', open: '打开', savedGraphs: '已保存图谱',
      nothing: '暂无内容', validate: '校验', clearCanvas: '清空画布', deploy: '部署', file: '文件',
      paradigms: '范式', save: '保存', saveWorkflow: '保存工作流', namePrompt: '为你的工作流命名：',
      descriptionPrompt: '添加描述（可选）：', clearConfirm: '清空画布？', deleteParadigm: '删除范式？', toolkit: '工具箱', agentLoop: 'Agent Loop', cancel: '取消', clear: '清空', delete: '删除', leave: '离开',
    },
    config: {
      tabModel: '模型配置', tabSensor: '传感器', tabFile: '文件白名单', tabMcp: 'MCP 服务', tabApp: '应用白名单',
      tipModel: 'model.json · 核心模型 / 后台模型 / 视觉顾问',
      tipSensor: 'activate_sensor.json · 钩子/定时任务',
      tipFile: 'file.json · 文件系统可见范围',
      tipMcp: 'mcp_config.json · MCP 服务端注册',
      tipApp: 'app_config.json · 系统可见应用',
      configDir: '配置目录', dataRoot: '数据根目录',
      changeDataRoot: '更改数据根目录（自动搬迁数据并重启）',
      mainModelDesc: 'Agent 对话主脑', taskModelDesc: '后台任务 / 工作流执行', visionModelDesc: '图片 / 视频多模态理解',
      unconfigured: '未配置',
      loadFailed: '无法加载配置：', networkError: '网络错误，无法连接后端',
      visualEdit: '可视化编辑', rawEdit: '原始 JSON 编辑', reloadFromDisk: '重新从磁盘加载',
      goToMarketMcp: '前往市场浏览 / 安装 MCP 服务', goToMarketSensor: '前往市场浏览 / 安装传感器',
      rawEditHint: '直接编辑完整 JSON。保存时整体覆盖写盘。',
      emptyConfig: '空配置 — 可以在下方添加',
      editValueHint: '修改 value（保持合法 JSON，字符串要加引号）',
      applyStaged: '应用修改（暂存内存）',
      modifiedHint: '已修改，请点击“全部保存”保存到磁盘', deletedHint: '已删除，请点击“全部保存”保存到磁盘',
      addedHint: '已添加，请点击“全部保存”保存到磁盘',
      fillThenSave: '填写完成后点击右侧“添加”，再点击“全部保存”保存到磁盘',
      jsonInvalidItem: 'JSON 格式不合法，无法保存此项', jsonInvalidServer: 'JSON 格式不合法，无法保存此服务器',
      serverNameRequired: '请输入服务器名称', serverExists: '该服务器已存在，想修改请展开它',
      serverJsonInvalid: '服务器配置不是合法 JSON',
      addServerTitle: '新增 MCP 服务器', serverNamePh: '服务器名称，例：github',
      deleteServerTitle: '删除此服务器', deleteItemTitle: '删除此项',
      addEntryTitle: '新增配置项', keyNamePh: 'Key 名称', stringValuePh: '字符串值',
      keyRequired: '请输入 key 名称', keyExists: '该 key 已存在，想修改请展开它',
      valueTypeInvalid: '值格式不合法',
      saveSuccess: '🎉 配置已成功保存到磁盘！', saveRejected: '保存失败：后端拒绝请求',
      saveFailed: '保存失败：JSON 格式不合法或网络错误',
      notObjectError: '原始 JSON 不是对象/数组，无法切回可视化模式',
      changeRootTitle: '更换数据根目录', currentRoot: '当前数据根目录', newRoot: '新数据根目录',
      migrateHint: '确认后将把 agent_vm / embedding 等大型数据搬迁到新位置，随后自动重启程序生效。搬迁期间请勿操作。',
      confirmMigrate: '确认搬迁并重启', migrating: '搬迁中…',
      migrateSuccess: '数据已搬迁，即将重启生效', migrateFailed: '数据目录迁移失败',
      noFolderPicker: '当前环境不支持选择文件夹',
      modelNameLabel: '模型名（MODEL NAME）', modelNamePh: '例：deepseek-v4-flash',
    },
    agentLoop: {
      hook_on_build_system_prompt: '构建系统提示词时', hook_on_loop_start: '循环开始时',
      hook_on_loop_epoch: '每轮循环迭代时', hook_on_loop_end: '循环结束时', hook_on_tool_calling: '工具调用时',
      act_injection: '提示注入', act_injectionDesc: '注入一段提示文本',
      act_file_operation: '文件操作', act_file_operationDesc: '读写 / 检查工作区文件',
      act_skill_info: '技能注入', act_skill_infoDesc: '注入主库技能的名称与描述',
      act_memo_injection: '记忆注入', act_memo_injectionDesc: '装载系统共享记忆缓存',
      act_tool_use_check: '工具使用检查', act_tool_use_checkDesc: '校验本轮工具调用记录',
      act_command_run: '命令执行', act_command_runDesc: '在终端执行一条命令',
      fContent: '注入内容', fContentPh: '注入给 Agent 的提示文本',
      fAction: '操作', fPath: '路径', fPathPh: '例如 @RULES / @SYS（系统信息）/ agent_vm/xxx.txt',
      fWriteContent: '写入内容', fWriteContentPh: 'write_in / add_in 时写入的内容',
      fFailedPrompt: '失败提示 failed_prompt',
      fMemoType: '记忆类型', fMemoTypePh: 'full / light / 其它键名', fCount: '条数 count',
      fToolName: '工具名 name', fToolNamePh: '例如 Memo / ComputerUse',
      fSuccessPrompt: '成功提示 successed_prompt',
      fCommand: '命令', fCommandPh: '要执行的 shell 命令', fReturnLog: '回传输出 return_log',
      notSet: '（未设置）', jsonPh: 'JSON 文本（留空则删除该配置）', jsonInvalid: 'JSON 格式有误，未保存',
      timingInterval: '间隔', timingDelay: '延迟',
      timingIntervalTitle: '当前：间隔触发，点击切换为延迟', timingDelayTitle: '当前：延迟触发，点击切换为间隔',
      paramCheckHint: '任一项匹配即算使用该工具；一项内多个条件需同时满足',
      paramCheckEmpty: '无参数约束（点击下方添加）', checkItem: '检查项',
      addParamCond: '在该检查项内新增参数条件', deleteCheckItem: '删除该检查项',
      paramNamePh: '参数名', expectedValuePh: '期望值', removeCond: '移除该条件',
      newCheckItem: '新检查项（待填写）', pendingKeyPh: '参数名（例如 action）', pendingValuePh: '期望值（例如 add）',
      discardCheckItem: '放弃该检查项', addCheckItem: '添加检查项',
      fetchSkillsFailed: '获取技能列表失败', pickSkills: '从主库勾选技能', addSkill: '添加技能',
      searchSkillPh: '搜索技能关键词…', loadingSkills: '正在加载技能…',
      noLibrarySkills: '主库暂无技能', noMatchSkills: '无匹配的技能',
      expectFail: '期望失败', expectSuccess: '期望成功', timingLabel: '触发时机',
      intervalRounds: '间隔轮次 interval', delayRounds: '延迟轮次 delay',
      intervalPh: '每隔 N 轮触发一次', delayPh: '仅在第 N 轮触发一次',
      expectLabel: '退出期望（决定能否跳出循环）',
      expectFailHint: '期望“失败”= 该条件未满足才算通过，允许结束本轮',
      noSchemaPrefix: '该动作类型暂无结构化解（', noSchemaSuffix: '），直接编辑完整配置：',
      paramCheckLabel: '参数约束 parameter_check', skillsLabel: '技能选择 skills',
      otherFieldsPrefix: '其他字段（', otherFieldsSuffix: '）',
      fetchListFailed: '获取 paradigm 列表失败', notFoundPrefix: 'paradigm 不存在：',
      loadFailed: '加载失败', draftRestored: '已恢复未保存草稿：', backendUnreachable: '无法连接后端',
      saveFailed: '保存失败', savedToast: '已保存', deleteFailed: '删除失败', deletedToast: '已删除',
      fileNameRequired: '请输入文件名', createFailed: '新建失败', createdToast: '已新建',
      stationEmpty: '未配置动作（点击左侧 + 添加）',
      userNode: '用户输入', endNode: '结束',
      edgeHasTool: '有工具调用', edgeNoTool: '无工具调用',
      edgeFailNext: '失败 · 下一轮', edgeSuccessEnd: '成功 · 结束',
      componentsTitle: '组件', hookOrchestration: 'Hook 动作编排', loadingParens: '（加载中…）',
      addAction: '添加动作', noActions: '暂无动作，点击上方 + 添加', deleteAction: '删除动作',
      dirtyPrefix: '当前文件有未保存的修改。切换到 ', dirtySuffix: ' 将丢弃这些修改，确定要继续吗？',
      switchBtn: '切换', newTitle: '新建 Paradigm',
      newHint: '将创建 ~/.purrcat/paradigms/{名称}.yaml，初始只有空的五个 Hook',
      nameExamplePh: '例如 my_agent_loop', createBtn: '创建', newLoopDesc: '新的 Agent Loop',
    },
    chat: {
      greeting: '今天我们要构建什么？', todayCalls: '今日调用次数', tokensBurnt: 'Token 消耗量', cacheHit: '缓存命中 Token',
      annualContributions: '年度活跃度', copied: '已复制！', assistant: '助手', dropFiles: '将文件拖到这里以添加！',
      writePrompt: '在这里输入你的指令…', selectChat: '请先选择一个会话！', moreTools: '更多工具',
      openBrowser: '在浏览器中打开', linkPreview: '链接预览', loadingMarkdown: '正在加载 Markdown…',
      allFilesClean: '所有文件都已处理！', selectFile: '请选择文件…', noVisualDiff: '未检测到可视差异。',
      seconds: '秒', saveConfig: '保存配置', openExternally: '在外部浏览器打开', cancel: '取消',
      noMcpLoaded: '尚未加载 MCP', noSkillsLoaded: '尚未加载技能', noAlarms: '尚未配置提醒', noSensors: '未找到传感器',
      noFileOpen: '没有打开文件', selectFileExplorer: '请从文件浏览器选择文件', newChat: '新建会话', config: '配置', saveAll: '全部保存', edit: '编辑', closeEdit: '收起', coreModel: '核心模型', backgroundModel: '后台模型', visionAdvisor: '视觉顾问', back: '返回', switchSession: '切换会话', evolve: '进化', alarms: '提醒', sensors: '传感器', addAlarm: '添加提醒',
      filesModified: '个文件已修改', acknowledgeAll: '全部接受', acknowledge: '接受', revert: '回退', pending: '待处理', noRequests: '暂无请求', dependency: '依赖检查', reason: '原因', timeLimit: '时间限制：', mins: '分钟', todayUnlimited: '今日不限时', approve: '批准', reject: '拒绝', feedbackOptional: '反馈（可选）…', ignoreSilent: '忽略（静默）', branchChat: '创建分支会话', deleteChat: '删除会话？', destroyBranch: '删除分支？', destroy: '删除', newAlarm: '新建提醒', installSkill: '安装 Skill', installMcp: '安装 MCP', addSensor: '添加传感器', selectSkills: '选择技能', selectMcp: '选择 MCP', referenceFile: '引用文件', addPath: '添加路径', selectGraph: '选择图谱', upgradeExisting: '升级现有', createNew: '新建', switchChat: '切换会话', checkingOut: '正在切换工作区…', agentBusy: 'Agent 正在工作！', fileChanges: '文件变更', extractSkill: '提取 Skill', newLabel: '新增', deletedLabel: '已删除', waitingAgent: '等待 Agent 完成当前任务…', download: '下载', alarmTitle: '提醒标题…', triggerTime: '触发时间（HH:MM）', saveLoad: '保存并加载', saveFile: '保存文件', traceSkill: '追踪到 Skill',
    },
  },
  'en-US': {
    common: {
      language: 'Language', chinese: '简体中文', english: 'English',
      minimize: 'Minimize', maximize: 'Maximize', close: 'Close',
      cancel: 'Cancel', delete: 'Delete', save: 'Save', clear: 'Clear', complete: 'Complete',
      confirm: 'Confirm', yes: 'Yes', no: 'No', leave: 'Leave', loading: 'Loading…',
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
      selectTask: 'Select a task to view its flow...', noAgentNodes: 'No Core Agent Nodes', noGraphs: 'No deployed graphs', selectGraphPlaceholder: 'Select a graph…', launchAction: 'Launch', destroyRecord: 'DELETE RECORD?',
    },
    memory: {
      keep: 'KEEP', forget: 'FORGET', database: 'MEMORY DB', search: 'SEARCH', hybrid: 'Hybrid Retrieval',
      cognition: 'COGNITION', knowledgeGraph: 'Knowledge Graph', experiences: 'EXPERIENCES', vector: 'Vector Memory (Top 30)',
      events: 'EVENTS', facts: 'Objective Facts (Top 30)', rawNotes: 'Raw Memory Notes', refresh: 'REFRESH',
      ask: 'Ask your memory anything...', searchHint: 'Hit Enter to search the void...', syncing: 'Syncing All Triples...',
      emptyGraph: 'Graph is empty. Try clicking REFRESH.', forgetConfirm: 'Forget this memory?', hybridTitle: 'HYBRID SEARCH', graphTitle: 'KNOWLEDGE GRAPH', vectorTitle: 'VECTOR EXPERIENCES', eventsTitle: 'OBJECTIVE EVENTS', tip: 'Tip: Click any edge (line) to forget a relationship.', saveToDisk: 'SAVE TO DISK',
    },
    market: {
      description: 'DESCRIPTION:', mcpServers: 'MCP SERVERS (SCHEMA):', requiredEnv: 'REQUIRED ENV:',
      fetching: 'Fetching Repositories...', skills: 'SKILLS', capabilities: 'Agent Capabilities', servers: 'MCP SERVERS',
      providers: 'Context Providers', sensors: 'SENSORS', triggers: 'Autonomous Triggers', graphs: 'GRAPHS',
      templates: 'Workflow Templates', loops: 'LOOPS', paradigms: 'Agent Loop Paradigms', refresh: 'REFRESH',
      searchSkills: 'Search skills / descriptions / repositories / authors…', searchMcp: 'Search MCP names / descriptions / repositories / servers…',
      searchSensors: 'Search sensor names / descriptions…', searchGraphs: 'Search graph names / descriptions…',
      noWant: 'No want? Try:', comingSoon: 'COMING SOON', loopSoon: 'Agent Loop marketplace is coming soon.', skillTitle: 'SKILL EXPLORER', mcpTitle: 'MCP EXPLORER', sensorTitle: 'SENSOR EXPLORER', graphTitle: 'GRAPH EXPLORER', loopTitle: 'AGENT LOOP',
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
      runEvaluator: 'Run Evaluator', refreshArchives: 'Refresh Archives', mcpTools: 'MCP TOOLS', noFileSelected: 'No file selected', sendFeedback: 'SEND FEEDBACK', destroyIt: 'DESTROY IT', doRevert: 'DO REVERT',
    },
    editor: {
      loadingNodes: 'Loading Nodes...', workflow: 'WORKFLOW', open: 'OPEN', savedGraphs: 'SAVED GRAPHS',
      nothing: 'Nothing here', validate: 'Validate', clearCanvas: 'Clear Canvas', deploy: 'DEPLOY', file: 'FILE',
      paradigms: 'PARADIGMS', save: 'Save', saveWorkflow: 'SAVE WORKFLOW', namePrompt: 'Give your cat-powered graph a name:',
      descriptionPrompt: 'Add a description (optional):', clearConfirm: 'CLEAR CANVAS?', deleteParadigm: 'DELETE PARADIGM?', toolkit: 'TOOLKIT', agentLoop: 'AGENT LOOP', cancel: 'CANCEL', clear: 'CLEAR', delete: 'DELETE', leave: 'LEAVE',
    },
    config: {
      tabModel: 'Model Config', tabSensor: 'Sensors', tabFile: 'File Whitelist', tabMcp: 'MCP Servers', tabApp: 'App Whitelist',
      tipModel: 'model.json · core / background / vision models',
      tipSensor: 'activate_sensor.json · hooks / cron jobs',
      tipFile: 'file.json · filesystem visibility',
      tipMcp: 'mcp_config.json · MCP server registry',
      tipApp: 'app_config.json · visible system apps',
      configDir: 'Config Directory', dataRoot: 'Data Root',
      changeDataRoot: 'Change data root (auto-migrate & restart)',
      mainModelDesc: 'Agent main brain', taskModelDesc: 'Background tasks / workflow execution', visionModelDesc: 'Image / video multimodal understanding',
      unconfigured: 'Not configured',
      loadFailed: 'Failed to load config: ', networkError: 'Network error: cannot reach the backend',
      visualEdit: 'Visual Edit', rawEdit: 'Raw JSON Edit', reloadFromDisk: 'Reload from disk',
      goToMarketMcp: 'Browse / install MCP servers in Market', goToMarketSensor: 'Browse / install sensors in Market',
      rawEditHint: 'Edit the full JSON directly. Saving overwrites the whole file.',
      emptyConfig: 'Empty config — add below',
      editValueHint: 'Edit value (keep valid JSON; quote strings)',
      applyStaged: 'Apply (staged in memory)',
      modifiedHint: 'Modified — click SAVE ALL to persist to disk', deletedHint: 'Deleted — click SAVE ALL to persist to disk',
      addedHint: 'Added — click SAVE ALL to persist to disk',
      fillThenSave: 'Fill in and click ADD, then click SAVE ALL to persist to disk',
      jsonInvalidItem: 'Invalid JSON; cannot save this item', jsonInvalidServer: 'Invalid JSON; cannot save this server',
      serverNameRequired: 'Please enter a server name', serverExists: 'This server already exists — expand it to edit',
      serverJsonInvalid: 'Server config is not valid JSON',
      addServerTitle: 'Add MCP Server', serverNamePh: 'Server name, e.g. github',
      deleteServerTitle: 'Delete this server', deleteItemTitle: 'Delete this item',
      addEntryTitle: 'Add Config Entry', keyNamePh: 'Key name', stringValuePh: 'String value',
      keyRequired: 'Please enter a key name', keyExists: 'This key already exists — expand it to edit',
      valueTypeInvalid: 'Invalid value format',
      saveSuccess: '🎉 Config saved to disk!', saveRejected: 'Save failed: backend rejected the request',
      saveFailed: 'Save failed: invalid JSON or network error',
      notObjectError: 'Raw JSON is not an object/array — cannot switch back to visual mode',
      changeRootTitle: 'Change Data Root', currentRoot: 'Current data root', newRoot: 'New data root',
      migrateHint: 'Large data such as agent_vm / embeddings will be moved to the new location, then the app restarts to apply. Do not operate during migration.',
      confirmMigrate: 'Migrate & Restart', migrating: 'Migrating…',
      migrateSuccess: 'Data migrated; restarting to apply', migrateFailed: 'Data root migration failed',
      noFolderPicker: 'Folder selection is not available in this environment',
      modelNameLabel: 'Model Name', modelNamePh: 'e.g. deepseek-v4-flash',
    },
    agentLoop: {
      hook_on_build_system_prompt: 'On Build System Prompt', hook_on_loop_start: 'On Loop Start',
      hook_on_loop_epoch: 'On Loop Epoch', hook_on_loop_end: 'On Loop End', hook_on_tool_calling: 'On Tool Calling',
      act_injection: 'Injection', act_injectionDesc: 'Inject a prompt text',
      act_file_operation: 'File Operation', act_file_operationDesc: 'Read / write / check workspace files',
      act_skill_info: 'Skill Info', act_skill_infoDesc: 'Inject names & descriptions of library skills',
      act_memo_injection: 'Memo Injection', act_memo_injectionDesc: 'Load the shared memory cache',
      act_tool_use_check: 'Tool Use Check', act_tool_use_checkDesc: 'Validate tool calls of this round',
      act_command_run: 'Command Run', act_command_runDesc: 'Run a shell command in terminal',
      fContent: 'Content', fContentPh: 'Prompt text injected to the Agent',
      fAction: 'Action', fPath: 'Path', fPathPh: 'e.g. @RULES / @SYS / agent_vm/xxx.txt',
      fWriteContent: 'Write Content', fWriteContentPh: 'Content written by write_in / add_in',
      fFailedPrompt: 'Failed Prompt',
      fMemoType: 'Memo Type', fMemoTypePh: 'full / light / other keys', fCount: 'Count',
      fToolName: 'Tool Name', fToolNamePh: 'e.g. Memo / ComputerUse',
      fSuccessPrompt: 'Success Prompt',
      fCommand: 'Command', fCommandPh: 'Shell command to execute', fReturnLog: 'Return Log',
      notSet: '(not set)', jsonPh: 'JSON text (empty to remove this field)', jsonInvalid: 'Invalid JSON, not saved',
      timingInterval: 'Interval', timingDelay: 'Delay',
      timingIntervalTitle: 'Now: interval trigger. Click to switch to delay', timingDelayTitle: 'Now: delay trigger. Click to switch to interval',
      paramCheckHint: 'Any match counts as using the tool; conditions within one item must all hold',
      paramCheckEmpty: 'No parameter constraints (add below)', checkItem: 'Check Item',
      addParamCond: 'Add a parameter condition to this check item', deleteCheckItem: 'Delete this check item',
      paramNamePh: 'Param name', expectedValuePh: 'Expected value', removeCond: 'Remove this condition',
      newCheckItem: 'New check item (pending)', pendingKeyPh: 'Param name (e.g. action)', pendingValuePh: 'Expected value (e.g. add)',
      discardCheckItem: 'Discard this check item', addCheckItem: 'Add Check Item',
      fetchSkillsFailed: 'Failed to load skills', pickSkills: 'Pick skills from the library', addSkill: 'Add Skill',
      searchSkillPh: 'Search skills…', loadingSkills: 'Loading skills…',
      noLibrarySkills: 'No skills in the library yet', noMatchSkills: 'No matching skills',
      expectFail: 'Expect Fail', expectSuccess: 'Expect Success', timingLabel: 'Timing',
      intervalRounds: 'Interval rounds (interval)', delayRounds: 'Delay rounds (delay)',
      intervalPh: 'Trigger every N rounds', delayPh: 'Trigger once at round N',
      expectLabel: 'Exit Expectation (decides whether the loop can exit)',
      expectFailHint: '"Fail" expected = passes only when the condition is NOT met, allowing this round to end',
      noSchemaPrefix: 'No structured schema for this action type (', noSchemaSuffix: ') — edit the full config directly:',
      paramCheckLabel: 'Parameter Check', skillsLabel: 'Skills',
      otherFieldsPrefix: 'Other fields (', otherFieldsSuffix: ')',
      fetchListFailed: 'Failed to load paradigm list', notFoundPrefix: 'Paradigm not found: ',
      loadFailed: 'Load failed', draftRestored: 'Restored unsaved draft:', backendUnreachable: 'Cannot reach the backend',
      saveFailed: 'Save failed', savedToast: 'Saved', deleteFailed: 'Delete failed', deletedToast: 'Deleted',
      fileNameRequired: 'Please enter a file name', createFailed: 'Create failed', createdToast: 'Created',
      stationEmpty: 'No actions configured (click + on the left to add)',
      userNode: 'User Input', endNode: 'End',
      edgeHasTool: 'Tool called', edgeNoTool: 'No tool call',
      edgeFailNext: 'Fail · Next Round', edgeSuccessEnd: 'Success · End',
      componentsTitle: 'Components', hookOrchestration: 'Hook action orchestration', loadingParens: ' (loading…)',
      addAction: 'Add action', noActions: 'No actions yet — click + above to add', deleteAction: 'Delete action',
      dirtyPrefix: 'This file has unsaved changes. Switching to ', dirtySuffix: ' will discard them. Continue?',
      switchBtn: 'SWITCH', newTitle: 'New Paradigm',
      newHint: 'Creates ~/.purrcat/paradigms/{name}.yaml with five empty hooks',
      nameExamplePh: 'e.g. my_agent_loop', createBtn: 'CREATE', newLoopDesc: 'New Agent Loop',
    },
    chat: {
      greeting: 'Hi, what are we building today?', todayCalls: 'TODAY CALLS', tokensBurnt: 'TOKENS BURNT', cacheHit: 'CACHE HIT',
      annualContributions: 'ANNUAL CONTRIBUTIONS', copied: 'Copied!', assistant: 'ASSISTANT', dropFiles: 'Drop files here to attach!',
      writePrompt: 'Write your prompt here...', selectChat: 'Select a chat first!', moreTools: 'More Tools',
      openBrowser: 'Open in Browser', linkPreview: 'Link Preview', loadingMarkdown: 'LOADING MARKDOWN...',
      allFilesClean: 'All files clean!', selectFile: 'Select a file...', noVisualDiff: 'No visual difference detected.',
      seconds: 'SECONDS', saveConfig: 'SAVE CONFIG', openExternally: 'OPEN EXTERNALLY', cancel: 'CANCEL',
      noMcpLoaded: 'No MCP loaded', noSkillsLoaded: 'No Skills loaded', noAlarms: 'No Alarms configured', noSensors: 'No Sensors found',
      noFileOpen: 'No file open', selectFileExplorer: 'Select a file from the explorer', newChat: 'NEW CHAT', config: 'CONFIG', saveAll: 'SAVE ALL', edit: 'EDIT', closeEdit: 'CLOSE', coreModel: 'Core Model', backgroundModel: 'Background Model', visionAdvisor: 'Vision Advisor', back: 'Back', switchSession: 'SWITCH', evolve: 'EVOLVE', alarms: 'ALARMS', sensors: 'SENSORS', addAlarm: 'ADD ALARM',
      filesModified: 'files modified', acknowledgeAll: 'ACK ALL', acknowledge: 'ACKNOWLEDGE', revert: 'REVERT', pending: 'PENDING', noRequests: 'No requests.', dependency: 'DEPENDENCY', reason: 'Reason', timeLimit: 'TIME LIMIT:', mins: 'MINS', todayUnlimited: 'TODAY UNLIMITED', approve: 'APPROVE', reject: 'REJECT', feedbackOptional: 'Feedback (Optional)…', ignoreSilent: 'Ignore (Silent)', branchChat: 'BRANCH CHAT', deleteChat: 'DELETE CHAT?', destroyBranch: 'DESTROY BRANCH?', destroy: 'DESTROY', newAlarm: 'NEW ALARM', installSkill: 'INSTALL SKILL', installMcp: 'INSTALL MCP', addSensor: 'ADD SENSOR', selectSkills: 'SELECT SKILLS', selectMcp: 'SELECT MCP', referenceFile: 'REFERENCE FILE', addPath: 'ADD PATH', selectGraph: 'SELECT GRAPH', upgradeExisting: 'UPGRADE EXIST', createNew: 'CREATE NEW', switchChat: 'SWITCH CHAT', checkingOut: 'CHECKING OUT…', agentBusy: 'AGENT IS BUSY!', fileChanges: 'FILE CHANGES', extractSkill: 'EXTRACT SKILL', newLabel: 'NEW', deletedLabel: 'DELETED', waitingAgent: 'Waiting for the agent to complete tasks…', download: 'DOWNLOAD', alarmTitle: 'Alarm Title…', triggerTime: 'Trigger Time (HH:MM)', saveLoad: 'SAVE & LOAD', saveFile: 'SAVE FILE', traceSkill: 'TRACE 2 SKILL',
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
