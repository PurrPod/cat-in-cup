// src/components/DataSetupModal.tsx
// 首次启动数据盘引导：选一次数据盘（或使用默认位置）；日后可在配置中心随时更换
import { useEffect, useState } from 'react';
import { Folder, FolderRoot, HardDrive, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { sketchyShape1, sketchyShape2, sketchyShape3 } from './chat/ChatShared';
import { useTranslation } from '../i18n';

export default function DataSetupModal({ onDone }: { onDone: () => void }) {
  const purrcat = (window as any).purrcat;
  const { t } = useTranslation();
  const [defaultDir, setDefaultDir] = useState('~/.purrcat');
  const [selected, setSelected] = useState('');   // 用户选的数据盘；空 = 用默认位置
  const [submitting, setSubmitting] = useState(false);

  // 展示默认数据位置（~/.purrcat）
  useEffect(() => {
    fetch('/api/config/meta')
      .then((r) => r.json())
      .then((m) => { if (m?.PURRCAT_DIR) setDefaultDir(m.PURRCAT_DIR); })
      .catch(() => {});
  }, []);

  const pickDir = async () => {
    if (!purrcat?.openDialog) { toast(t('setup.unsupported'), { icon: '🔔' }); return; }
    const dirs = await purrcat.openDialog({ directory: true });
    if (dirs && dirs.length > 0) setSelected(dirs[0]);
  };

  const submit = async (dataRoot: string) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/config/setup-data-root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data_root: dataRoot }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        // 🌟 不再自动重启：实测部分机器上 app:restart 的强杀看门狗会被安全软件/注入
        // DLL 干扰，重启变成 JS 报错卡死。改为明确提示用户手动重启，data_root 重启后生效
        toast.success(t('setup.saved'), { duration: 8000 });
        onDone();
      } else {
        toast.error(typeof data?.detail === 'string' ? data.detail : t('setup.saveFailed'));
      }
    } catch {
      toast.error(t('setup.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2147483646] flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4 md:p-8 pointer-events-auto">
      <div
        style={sketchyShape2}
        className="bg-cream border-4 border-ink shadow-[16px_16px_0px_0px_rgba(26,26,26,1)] w-full max-w-xl flex flex-col relative p-8 md:p-10"
      >
        <div
          className="absolute -top-5 right-10 w-28 h-12 bg-[#EBCB8B]/70 border-2 border-ink -rotate-3 z-50 pointer-events-none flex items-center justify-center font-black text-sm tracking-widest"
          style={sketchyShape1}
        >
          {t('setup.firstRun')}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <HardDrive size={40} strokeWidth={2.5} className="text-terracotta" />
          <h2 className="text-3xl font-black tracking-widest" style={{ fontFamily: '"Comic Sans MS", cursive' }}>{t('setup.title')}</h2>
        </div>

        <div className="text-[15px] font-bold text-ink/80 leading-relaxed mb-6">
          {t('setup.description')}<b className="text-ink">{t('setup.largeFiles')}</b>{t('setup.descriptionMiddle')}
          <b className="text-ink">{t('setup.smallData')}</b>{t('setup.descriptionEnd')}
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {/* 当前选择 */}
          <div style={sketchyShape1} className="bg-paper border-4 border-ink p-4 flex items-center gap-3">
            <FolderRoot size={24} strokeWidth={2.5} className={selected ? 'text-[#a3be8c]' : 'text-terracotta'} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-ink/50 tracking-widest mb-1">{t('setup.location')}</div>
              <div className="font-mono text-[15px] font-bold text-ink break-all">
                {selected || defaultDir}
              </div>
            </div>
          </div>

          {/* 说明：可随时更换 */}
          <div className="flex items-start gap-2 text-xs font-bold text-ink/50">
            <span className="shrink-0">💡</span>
            {t('setup.hint')}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={pickDir}
            disabled={submitting}
            style={sketchyShape1}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#a3be8c] border-4 border-ink text-ink font-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-[#8eb072] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
          >
            <Folder size={20} strokeWidth={3} />
            {t('setup.choose')}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => submit(selected || defaultDir)}
              disabled={submitting}
              style={sketchyShape3}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-paper border-4 border-ink text-ink font-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-sand hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
            >
              {submitting ? <Loader2 size={20} strokeWidth={3} className="animate-spin" /> : null}
              {submitting ? t('setup.saving') : t('setup.useSelected')}
            </button>
            <button
              onClick={() => submit(defaultDir)}
              disabled={submitting}
              style={sketchyShape2}
              className="flex-1 px-6 py-3 bg-paper border-4 border-ink text-ink/70 font-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-sand hover:text-ink hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
            >
              {t('setup.useDefault')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
