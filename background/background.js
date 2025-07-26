/**
 * GitHub PR AutoComplete Background Script
 * Service worker for the Chrome extension
 */

// Extension installation and update handling
chrome.runtime.onInstalled.addListener((details) => {
    console.log('GitHub PR AutoComplete: Extension installed/updated', details);
    
    if (details.reason === 'install') {
        console.log('GitHub PR AutoComplete: First time installation');
        
        // Set default settings
        chrome.storage.sync.set({
            enabled: true,
            maxSuggestions: 10,
            minWordLength: 2,
            debounceDelay: 300
        });
    }
    
    if (details.reason === 'update') {
        console.log('GitHub PR AutoComplete: Extension updated to version', chrome.runtime.getManifest().version);
    }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('GitHub PR AutoComplete: Extension started');
});

// Message handling for communication with content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('GitHub PR AutoComplete: Message received', request);
    
    switch (request.action) {
        case 'getSettings':
            // Return current settings
            chrome.storage.sync.get([
                'enabled',
                'maxSuggestions', 
                'minWordLength',
                'debounceDelay'
            ], (settings) => {
                sendResponse({
                    success: true,
                    settings: {
                        enabled: settings.enabled !== false, // Default to true
                        maxSuggestions: settings.maxSuggestions || 10,
                        minWordLength: settings.minWordLength || 2,
                        debounceDelay: settings.debounceDelay || 300
                    }
                });
            });
            return true; // Keep message channel open for async response
            
        case 'updateSettings':
            // Update settings
            chrome.storage.sync.set(request.settings, () => {
                sendResponse({ success: true });
            });
            return true;
            
        case 'getStats':
            // Could be used for analytics or debugging
            sendResponse({
                success: true,
                version: chrome.runtime.getManifest().version,
                timestamp: Date.now()
            });
            break;
            
        default:
            console.warn('GitHub PR AutoComplete: Unknown message action', request.action);
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

// Tab update handling (for GitHub page navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only act on GitHub PR pages
    if (changeInfo.status === 'complete' && 
        tab.url && 
        tab.url.includes('github.com') && 
        tab.url.includes('/pull/')) {
        
        console.log('GitHub PR AutoComplete: PR page loaded', tab.url);
        
        // Could send a message to content script to reinitialize if needed
        chrome.tabs.sendMessage(tabId, {
            action: 'pageLoaded',
            url: tab.url
        }).catch(() => {
            // Content script might not be ready yet, that's okay
        });
    }
});

// Error handling
chrome.runtime.onSuspend.addListener(() => {
    console.log('GitHub PR AutoComplete: Extension suspending');
});

// Keep service worker alive if needed (for debugging)
// Note: Only enable this during development to prevent service worker from sleeping
const DEVELOPMENT_MODE = false; // Set to true during development if needed

if (DEVELOPMENT_MODE) {
    setInterval(() => {
        console.log('GitHub PR AutoComplete: Service worker keepalive');
    }, 20000);
}