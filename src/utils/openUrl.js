import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";

// On native iOS/Android: download the PDF into the cache directory, then
// hand it to the OS's native PDF viewer (Quick Look on iOS) — full
// pinch-zoom, scroll, page navigation, share, all free.
// On web: dispatch to in-app iframe overlay (good enough for desktop).
export async function openUrl(url) {
  if (!Capacitor.isNativePlatform()) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.dispatchEvent(new CustomEvent("open-pdf", { detail: { url: blobUrl } }));
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    return;
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    const filename = url.split("/").pop() || "document.pdf";

    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
    });

    await FileOpener.open({
      filePath: uri,
      contentType: "application/pdf",
    });
  } catch (e) {
    console.error("Failed to open PDF natively", e);
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Strip "data:application/pdf;base64," prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
