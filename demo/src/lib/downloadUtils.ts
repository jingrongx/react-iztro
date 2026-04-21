const GITHUB_REPO = 'jingrongx/react-iztro';

export const getApkDownloadUrl = (version: string) =>
  `https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_v${version}.apk`;

export const getGhproxyApkDownloadUrl = (version: string) =>
  `https://ghproxy.net/https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_v${version}.apk`;

export const getExeDownloadUrl = (version: string) =>
  `https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_${version}_x64-setup.exe`;

export const getGhproxyExeDownloadUrl = (version: string) =>
  `https://ghproxy.net/https://github.com/${GITHUB_REPO}/releases/download/v${version}/react-iztro_${version}_x64-setup.exe`;

export async function fetchLatestVersion(): Promise<string | null> {
  const cached = localStorage.getItem('iztro_latest_version');
  const lastFetch = localStorage.getItem('iztro_version_fetch_time');
  const now = Date.now();

  if (cached && lastFetch && now - parseInt(lastFetch) < 4 * 60 * 60 * 1000) {
    return cached;
  }

  const tryFetch = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const version = data.tag_name?.replace(/^v/, '') ?? null;
      if (version) {
        localStorage.setItem('iztro_latest_version', version);
        localStorage.setItem('iztro_version_fetch_time', now.toString());
      }
      return version;
    } catch {
      return null;
    }
  };

  const version = await tryFetch(`https://ghproxy.net/https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
  if (version) return version;

  return await tryFetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
}
