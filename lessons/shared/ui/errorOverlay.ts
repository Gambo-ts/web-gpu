export function createErrorOverlay(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.id = 'gambo-error-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.9)',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '10000',
    padding: '24px',
    textAlign: 'center',
  });
  overlay.innerHTML = `
    <div style="max-width: 600px;">
      <h1 style="color: #ff6b6b; margin-bottom: 16px;">⚠️ WebGPU Error</h1>
      <p id="gambo-error-message" style="margin-bottom: 24px; line-height: 1.6;"></p>
      <details style="text-align: left; background: #1a1a1a; padding: 16px; border-radius: 8px;">
        <summary style="cursor: pointer; color: #aaa;">Technical Details</summary>
        <pre id="gambo-error-details" style="margin-top: 12px; white-space: pre-wrap; word-break: break-word;"></pre>
      </details>
      <button id="gambo-error-dismiss" style="
        margin-top: 24px;
        padding: 12px 24px;
        background: #4a4aff;
        border: none;
        border-radius: 6px;
        color: white;
        cursor: pointer;
        font-size: 16px;
      ">Dismiss</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const dismissBtn = overlay.querySelector('#gambo-error-dismiss') as HTMLButtonElement;
  dismissBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  return overlay;
}

let errorOverlay: HTMLElement | null = null;

export function showError(message: string, details?: string): void {
  if (!errorOverlay) {
    errorOverlay = createErrorOverlay();
  }
  const messageEl = errorOverlay.querySelector('#gambo-error-message') as HTMLElement;
  const detailsEl = errorOverlay.querySelector('#gambo-error-details') as HTMLElement;
  messageEl.textContent = message;
  detailsEl.textContent = details ?? 'No additional details';
  errorOverlay.style.display = 'flex';
}

export function hideError(): void {
  if (errorOverlay) {
    errorOverlay.style.display = 'none';
  }
}

export function handleWebGPUError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const details = error instanceof Error ? error.stack : undefined;

  if (message.includes('WebGPU') || message.includes('adapter') || message.includes('device')) {
    showError('WebGPU is not available in this browser or environment.', details);
  } else {
    showError('An unexpected error occurred:', details);
  }
}

window.addEventListener('unhandledrejection', event => {
  handleWebGPUError(event.reason);
});

window.addEventListener('error', event => {
  handleWebGPUError(event.error);
});
