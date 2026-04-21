import { isTauri } from '../hooks/useTauriUpdater';

let tauriOpenUrl: ((url: string) => Promise<void>) | null = null;
let openerLoadAttempted = false;

async function loadOpener(): Promise<boolean> {
  if (tauriOpenUrl) return true;
  if (openerLoadAttempted) return false;
  openerLoadAttempted = true;
  try {
    const plugin = await import('@tauri-apps/plugin-opener');
    tauriOpenUrl = plugin.openUrl;
    return true;
  } catch {
    console.warn('[openUrl] plugin-opener 加载失败，将使用备用方案');
    return false;
  }
}

export async function openUrl(url: string): Promise<void> {
  if (isTauri()) {
    const loaded = await loadOpener();
    if (loaded && tauriOpenUrl) {
      try {
        await Promise.race([
          tauriOpenUrl(url),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000)),
        ]);
        return;
      } catch (err) {
        console.warn('[openUrl] opener 调用失败:', err);
      }
    }

    try {
      const { open } = await import('@tauri-apps/plugin-shell');
      await open(url);
      return;
    } catch (shellErr) {
      console.warn('[openUrl] shell.open 失败:', shellErr);
    }
  }

  fallbackOpenUrl(url);
}

function fallbackOpenUrl(url: string): void {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => document.body.removeChild(link), 100);
  } catch (error) {
    console.error('[openUrl] 所有方案均失败:', error);
    window.location.href = url;
  }
}
