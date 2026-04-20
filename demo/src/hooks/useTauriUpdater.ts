import { useState, useEffect } from 'react';

interface UpdateInfo {
  version: string;
  date: string;
  body: string;
}

export const isTauri = () => '__TAURI__' in window || '__TAURI_INTERNALS__' in window;

export function useTauriUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = async () => {
    if (!isTauri()) return;

    try {
      setError(null);
      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();
      if (update) {
        setUpdateInfo({
          version: update.version ?? '',
          date: update.date ?? '',
          body: update.body ?? '',
        });
        setUpdateAvailable(true);
      } else {
        setUpdateAvailable(false);
        setUpdateInfo(null);
      }
    } catch (err) {
      console.error('检查更新失败:', err);
      setError(err instanceof Error ? err.message : '检查更新失败');
    }
  };

  const downloadAndInstall = async () => {
    if (!isTauri()) return;

    try {
      setDownloading(true);
      setError(null);
      setProgress(0);

      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();
      if (update) {
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval);
              return prev;
            }
            return prev + Math.random() * 5;
          });
        }, 300);

        await update.downloadAndInstall();

        clearInterval(interval);
        setProgress(100);

        alert('更新下载完成，应用将重启以完成安装');

        if ('__TAURI__' in window) {
          try {
            const tauri = (window as any).__TAURI__;
            if (tauri && tauri.process && tauri.process.relaunch) {
              await tauri.process.relaunch();
            } else {
              window.location.reload();
            }
          } catch (relaunchError) {
            console.error('重启失败:', relaunchError);
            window.location.reload();
          }
        } else {
          window.location.reload();
        }
      }
    } catch (err) {
      console.error('更新安装失败:', err);
      setError(err instanceof Error ? err.message : '更新安装失败');
      setDownloading(false);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!isTauri()) return;

    checkForUpdate();

    const interval = setInterval(checkForUpdate, 4 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    updateAvailable,
    updateInfo,
    downloading,
    progress,
    error,
    checkForUpdate,
    downloadAndInstall,
  };
}
