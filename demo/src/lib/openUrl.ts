import { isTauri } from '../hooks/useTauriUpdater';

export async function openUrl(url: string): Promise<void> {
  if (isTauri()) {
    try {
      const { openUrl: tauriOpenUrl } = await import('@tauri-apps/plugin-opener');
      await tauriOpenUrl(url);
    } catch (error) {
      console.error('打开链接失败:', error);
      fallbackOpenUrl(url);
    }
  } else {
    fallbackOpenUrl(url);
  }
}

function fallbackOpenUrl(url: string): void {
  try {
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('打开链接失败:', error);
    window.location.href = url;
  }
}
