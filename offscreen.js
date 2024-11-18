chrome.runtime.onMessage.addListener(handleMessages);

async function handleMessages(message) {
  console.log('Received message', message);
  if (message.target !== 'offscreen-doc') {
    return;
  }

  switch (message.type) {
    case 'clipboard_write':
      doClipboardWrite(message.data);
      break;

    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }
}

/**
 * Copy the given data to the Clipboard.
 *
 * @param {string} data The data.
 * @returns {Promise<void>}
 */
async function doClipboardWrite(data) {
  try {
    if (typeof data !== 'string') {
      throw new TypeError(`Argument must be a 'string', got '${typeof data}'.`);
    }

    const sandbox = document.createElement('div');
    sandbox.innerHTML = data;
    document.body.appendChild(sandbox);

    const range = document.createRange();
    range.selectNode(sandbox);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Copy the selection to the clipboard.
    document.execCommand("copy");

    selection.removeAllRanges();
    document.body.removeChild(sandbox);
  } finally {
    window.close();
  }
}
