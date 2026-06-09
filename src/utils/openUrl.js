import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

export async function openUrl(url) {
  if (Capacitor.isNativePlatform()) {
    // On iOS/Android, resolve relative URLs against the Capacitor server origin
    const absolute = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    await Browser.open({ url: absolute });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
