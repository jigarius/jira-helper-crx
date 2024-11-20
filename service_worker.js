const JIRA_TICKET_URL_PATTERN = 'https://*.atlassian.net/browse/*';

/**
 * Copy the given data to the clipboard.
 *
 * @param {string} data The data.
 * @returns {Promise<void>}
 *
 * @see https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.offscreen-clipboard-write
 */
async function copyToClipboard(data) {
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: 'Write data to the clipboard.'
  });

  chrome.runtime.sendMessage({
    type: 'clipboard_write',
    target: 'offscreen-doc',
    data: data
  });
}

/**
 * Copy the Ticket ID to the clipboard.
 *
 * @param tab
 * @returns {Promise<void>}
 */
async function doCopyTicketId(tab) {
  // Sample value of tab.title: [XQS-38] poop - Jira.
  let matches = tab.title.match(/\[(?<id>[a-z0-9]+\-\d+)\] (?<summary>.+) - Jira/i);
  if (!matches) {
    return;
  }

  const data = `<a href="${tab.url}">${matches.groups.id}</a>`;
  return copyToClipboard(data);
}

/**
 * Copy the Ticket ID and Summary to the clipboard.
 *
 * @param tab
 * @returns {Promise<void>}
 */
async function doCopyTicketIdSummary(tab) {
  // Sample value of tab.title: [XQS-38] poop - Jira.
  let matches = tab.title.match(/\[(?<id>[a-z0-9]+\-\d+)\] (?<summary>.+) - Jira/i);
  if (!matches) {
    return;
  }

  const data = `<a href="${tab.url}">${matches.groups.id} - ${matches.groups.summary}</a>`;
  return copyToClipboard(data);
}

/**
 * Copy the Ticket Title and URL to the clipboard.
 *
 * @param tab
 * @returns {Promise<void>}
 */
async function doCopyTicketSummaryUrl(tab) {
  // Sample value of tab.title: [XQS-38] poop - Jira.
  let matches = tab.title.match(/\[(?<id>[a-z0-9]+\-\d+)\] (?<summary>.+) - Jira/i);
  if (!matches) {
    return;
  }

  const data = `${matches.groups.summary} - ${tab.url}`;
  return copyToClipboard(data);
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'copy_ticket_id':
      doCopyTicketId(tab);
      break;

    case 'copy_ticket_id_summary':
      doCopyTicketIdSummary(tab);
      break;

    case 'copy_ticket_summary_url':
      doCopyTicketSummaryUrl(tab);
      break;

    default:
      throw new Error(`Unsupported menu item: ${info.menuItemId}`);
  }
});

chrome.runtime.onInstalled.addListener(function () {


  // @todo Only apply to JIRA issue URLs.
  chrome.contextMenus.create({
    contexts: ['page'],
    documentUrlPatterns: [JIRA_TICKET_URL_PATTERN],
    id: 'copy_ticket_id',
    title: 'Copy ticket ID',
  });

  chrome.contextMenus.create({
    contexts: ['page'],
    documentUrlPatterns: [JIRA_TICKET_URL_PATTERN],
    id: 'copy_ticket_id_summary',
    title: 'Copy ticket ID and summary',
  });

  chrome.contextMenus.create({
    contexts: ['page'],
    documentUrlPatterns: [JIRA_TICKET_URL_PATTERN],
    id: 'copy_ticket_summary_url',
    title: 'Copy ticket summary and URL',
  });
});
