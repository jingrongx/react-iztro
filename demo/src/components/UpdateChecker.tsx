import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { openUrl } from '../lib/openUrl';
import { isWindows } from '../lib/platformUtils';

const CURRENT_VERSION = __APP_VERSION__;

const GITHUB_REPO = 'jingrongx/react-iztro';

interface ReleaseInfo {
  tag_name: string;
  html_url: string;
  assets: { name: string; browser_download_url: string }[];
}

const UpdateChecker: React.FC = () => {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [apkDownloadUrl, setApkDownloadUrl] = useState<string>('');
  const [apkGhproxyUrl, setApkGhproxyUrl] = useState<string>('');
  const [exeDownloadUrl, setExeDownloadUrl] = useState<string>('');
  const [exeGhproxyUrl, setExeGhproxyUrl] = useState<string>('');
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);

  const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;

  useEffect(() => {
    if (!isTauriEnv) {
      setChecking(false);
      return;
    }

    const checkUpdate = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        if (!res.ok) return;
        const data: ReleaseInfo = await res.json();
        const remoteVersion = data.tag_name.replace(/^v/, '');
        setLatestVersion(remoteVersion);

        const apkAsset = data.assets.find(a => a.name.endsWith('.apk'));
        const exeAsset = data.assets.find(a => a.name.endsWith('.exe'));

        if (apkAsset) {
          setApkDownloadUrl(apkAsset.browser_download_url);
          setApkGhproxyUrl(`https://ghproxy.net/${apkAsset.browser_download_url}`);
        }
        if (exeAsset) {
          setExeDownloadUrl(exeAsset.browser_download_url);
          setExeGhproxyUrl(`https://ghproxy.net/${exeAsset.browser_download_url}`);
        }
      } catch (err) {
        console.error('检查更新失败:', err);
        setError(true);
      } finally {
        setChecking(false);
      }
    };

    const lastCheck = localStorage.getItem('iztro_last_update_check');
    const lastDismissed = localStorage.getItem('iztro_dismissed_version');
    if (lastDismissed) {
      setDismissed(true);
    }

    const now = Date.now();
    if (!lastCheck || now - parseInt(lastCheck) > 4 * 60 * 60 * 1000) {
      checkUpdate();
      localStorage.setItem('iztro_last_update_check', now.toString());
    } else {
      const cached = localStorage.getItem('iztro_latest_version');
      if (cached) setLatestVersion(cached);
      const cachedApkUrl = localStorage.getItem('iztro_apk_download_url');
      if (cachedApkUrl) setApkDownloadUrl(cachedApkUrl);
      const cachedApkProxy = localStorage.getItem('iztro_apk_ghproxy_url');
      if (cachedApkProxy) setApkGhproxyUrl(cachedApkProxy);
      const cachedExeUrl = localStorage.getItem('iztro_exe_download_url');
      if (cachedExeUrl) setExeDownloadUrl(cachedExeUrl);
      const cachedExeProxy = localStorage.getItem('iztro_exe_ghproxy_url');
      if (cachedExeProxy) setExeGhproxyUrl(cachedExeProxy);
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (latestVersion) {
      localStorage.setItem('iztro_latest_version', latestVersion);
      localStorage.setItem('iztro_apk_download_url', apkDownloadUrl);
      localStorage.setItem('iztro_apk_ghproxy_url', apkGhproxyUrl);
      localStorage.setItem('iztro_exe_download_url', exeDownloadUrl);
      localStorage.setItem('iztro_exe_ghproxy_url', exeGhproxyUrl);
    }
  }, [latestVersion, apkDownloadUrl, apkGhproxyUrl, exeDownloadUrl, exeGhproxyUrl]);

  const hasUpdate = !checking && !!latestVersion && latestVersion > CURRENT_VERSION;
  const showBanner = hasUpdate && !(dismissed && localStorage.getItem('iztro_dismissed_version') === latestVersion);

  const handleDismiss = () => {
    setDismissed(true);
    if (latestVersion) localStorage.setItem('iztro_dismissed_version', latestVersion);
  };

  const handleRefresh = () => {
    setChecking(true);
    setError(false);
    setLatestVersion(null);
    localStorage.removeItem('iztro_last_update_check');
    setTimeout(() => window.location.reload(), 300);
  };

  const handleDownload = async (url: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      await openUrl(url);
    } catch (err) {
      console.error('下载打开失败:', err);
      try {
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          window.location.href = url;
        }
      } catch (fallbackError) {
        console.error('回退方法也失败:', fallbackError);
        window.location.href = url;
      }
    }
  };

  const ghproxyUrl = isWindows() ? exeGhproxyUrl : apkGhproxyUrl;
  const downloadUrl = isWindows() ? exeDownloadUrl : apkDownloadUrl;

  if (!isTauriEnv) {
    return (
      <div className="text-center text-xs text-gray-400 py-2 px-4">
        v{CURRENT_VERSION}
      </div>
    );
  }

  return (
    <>
      {showBanner && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">
              发现新版本 <strong>v{latestVersion}</strong>（当前 v{CURRENT_VERSION}）
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={ghproxyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleDownload(ghproxyUrl, e)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
            >
              <Download className="w-3 h-3" />
              国内下载
            </a>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleDownload(downloadUrl, e)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              GitHub
            </a>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-400 py-2 px-4 flex items-center justify-center gap-2">
        <span>
          v{CURRENT_VERSION}
          {!checking && latestVersion && (
            <span className={hasUpdate ? 'text-blue-500 font-medium' : 'text-green-500'}>
              {' / 最新 '}
              v{latestVersion}
              {hasUpdate ? ' （可更新）' : ' （已是最新）'}
            </span>
          )}
          {checking && <span className="text-gray-400"> / 检查中...</span>}
          {error && <span className="text-gray-400"> / 检查失败</span>}
        </span>
        <button
          onClick={handleRefresh}
          title="检查更新"
          className="p-0.5 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </>
  );
};

export default UpdateChecker;
