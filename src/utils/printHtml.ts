import * as Print from 'expo-print';
import { Platform } from 'react-native';

/**
 * Shared "render HTML to the print / save-as-PDF dialog" helper.
 *
 * `expo-print` on web ignores the supplied HTML and prints the whole page, so
 * for the web build we drive the browser print dialog ourselves via a hidden
 * iframe — that way the dialog (and the "Save as PDF" destination) contains
 * only our document. On native we hand the HTML to `expo-print` directly.
 */

function printHtmlOnWeb(html: string): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  // `srcdoc` fires `load` deterministically once the document is parsed, so we
  // print exactly this document (and only after it has rendered).
  iframe.onload = () => {
    const frameWindow = iframe.contentWindow;
    if (!frameWindow) {
      iframe.remove();
      return;
    }
    frameWindow.focus();
    frameWindow.print();
    // Give the print dialog time to grab the document before removing it.
    window.setTimeout(() => iframe.remove(), 1000);
  };

  iframe.srcdoc = html;
  document.body.appendChild(iframe);
}

/**
 * Opens the platform print / "Save as PDF" dialog for a self-contained HTML
 * document. On web this is the browser print dialog; on native the system sheet.
 */
export async function printHtml(html: string): Promise<void> {
  if (Platform.OS === 'web') {
    printHtmlOnWeb(html);
    return;
  }
  await Print.printAsync({ html });
}
