export function isWindows(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.platform.indexOf('Win') > -1;
}
