/**
 * Print Utilities for Museum Bait Al-Qur'an TMII Application
 * Provides isolated document printing to bypass iframe/modal viewport constraints
 */

export const printUtils = {
  /**
   * Print a specific DOM element cleanly via an isolated hidden iframe
   */
  printElement(elementId: string, documentTitle: string = 'Dokumen Museum Bait Al-Qur\'an TMII') {
    const targetEl = document.getElementById(elementId);
    if (!targetEl) {
      console.warn(`Element with id ${elementId} not found, falling back to window.print()`);
      window.print();
      return;
    }

    try {
      // Create hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.setAttribute('title', 'Print Frame');
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc) {
        window.print();
        return;
      }

      // Collect all head stylesheets and styles from parent
      const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map(el => el.outerHTML)
        .join('\n');

      // Construct print-ready HTML
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${documentTitle}</title>
          ${headStyles}
          <style>
            @page {
              size: auto;
              margin: 10mm 12mm 10mm 12mm;
            }
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
              padding: 0 !important;
              margin: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print, button, nav, header {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          </style>
        </head>
        <body class="p-4 bg-white text-slate-900">
          ${targetEl.outerHTML}
        </body>
        </html>
      `);
      iframeDoc.close();

      // Trigger print after iframe renders
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error('Error invoking iframe print, fallback to window.print()', e);
          window.print();
        } finally {
          // Cleanup iframe after a delay
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 3000);
        }
      }, 500);
    } catch (err) {
      console.error('printElement error, using standard print', err);
      window.print();
    }
  },

  /**
   * Trigger standard browser print with error boundary
   */
  triggerPrint() {
    try {
      window.print();
    } catch (err) {
      console.error('window.print() error:', err);
    }
  }
};
