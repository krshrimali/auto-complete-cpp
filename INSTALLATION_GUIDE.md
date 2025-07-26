# GitHub PR AutoComplete - Installation Guide

This guide will walk you through installing and using the GitHub PR AutoComplete extension.

## Prerequisites

- Chrome 88+ or Edge 88+ (Chromium-based browser)
- Access to GitHub.com
- Basic familiarity with browser extensions

## Installation Steps

### Method 1: Load as Unpacked Extension (Development)

1. **Download the Extension**
   - Clone or download this repository to your local machine
   - Extract if downloaded as ZIP

2. **Open Chrome Extension Management**
   - Open Chrome/Edge browser
   - Navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
   - Alternatively: Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top right corner
   - This enables the "Load unpacked" button

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the extension directory (containing `manifest.json`)
   - Click "Select Folder"

5. **Verify Installation**
   - The extension should appear in your extensions list
   - You should see "GitHub PR AutoComplete" with version 1.0.0
   - Make sure it's enabled (toggle switch is on)

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store once published. This guide will be updated with the store link.

## First Time Setup

1. **Test the Installation**
   - Open the included `test_extension.html` file in your browser
   - Click "Run All Tests" to verify the Trie implementation works
   - Click "Test with Sample Data" to load sample words
   - Type in the textarea to see auto-complete suggestions

2. **Visit a GitHub PR**
   - Navigate to any GitHub Pull Request page
   - Make sure the PR has file changes (go to "Files changed" tab)
   - Open browser DevTools (F12) and check the Console tab

3. **Look for Initialization Messages**
   ```
   GitHub PR AutoComplete: Starting UI initialization...
   GitHub PR AutoComplete: Initializing...
   GitHub PR AutoComplete: Extracted X unique words
   GitHub PR AutoComplete: Building Trie with X words
   GitHub PR AutoComplete: Trie built successfully
   GitHub PR AutoComplete: UI initialized successfully
   ```

## Using the Extension

### Basic Usage

1. **Navigate to a GitHub PR page** with file changes
2. **Wait for initialization** (usually 2-3 seconds)
3. **Click in any comment box** (review comments, PR comments, etc.)
4. **Start typing** - suggestions appear after 2+ characters
5. **Use keyboard navigation**:
   - `↑/↓` arrows to navigate suggestions
   - `Enter` or `Tab` to accept a suggestion
   - `Escape` to close suggestions

### Supported Areas

The extension works in these GitHub input areas:
- ✅ PR review comments
- ✅ General PR comments
- ✅ Commit comments
- ✅ Code review suggestions
- ✅ Issue comments (on PR pages)

### Word Sources

The extension extracts words from:
- 📄 **Code changes**: All added, removed, and context lines
- 📁 **File names**: Including directory paths and file names
- 💬 **Existing comments**: PR and review comments
- 🔤 **Programming keywords**: Common language keywords
- 🐪 **CamelCase parsing**: Splits camelCase/PascalCase words

## Troubleshooting

### Extension Not Working

1. **Check if you're on a PR page**
   - URL should contain `/pull/` (e.g., `github.com/user/repo/pull/123`)
   - Make sure you're on the "Files changed" tab or have visited it

2. **Check browser console**
   - Press F12 to open DevTools
   - Look for error messages in Console tab
   - Look for "GitHub PR AutoComplete" messages

3. **Verify extension is loaded**
   - Go to `chrome://extensions/`
   - Make sure "GitHub PR AutoComplete" is enabled
   - Check for any error messages

4. **Try refreshing the page**
   - GitHub uses dynamic loading, sometimes a refresh helps
   - Wait a few seconds after page load for initialization

### No Suggestions Appearing

1. **Check minimum requirements**
   - Type at least 2 characters
   - Make sure you're in a supported input field
   - Ensure the PR has file changes to extract words from

2. **Verify word extraction**
   - Open browser console
   - Type: `window.githubPRAutoComplete.getStats()`
   - Check if `totalWords > 0` and `isInitialized: true`

3. **Test manually**
   - Type: `window.githubPRAutoComplete.engine.getSuggestions('fun')`
   - Should return an array of suggestions

### Suggestions Not Styled Correctly

1. **Check for CSS conflicts**
   - Other extensions might interfere with styling
   - Try disabling other extensions temporarily

2. **Clear browser cache**
   - Sometimes cached CSS can cause issues
   - Hard refresh with Ctrl+Shift+R

### Performance Issues

1. **Large PRs**
   - Very large PRs (1000+ files) might take longer to process
   - Consider the `updateThreshold` setting (default 5 seconds)

2. **Memory usage**
   - The extension stores words in memory
   - Very large PRs might use significant memory

## Advanced Usage

### Debugging

1. **Access the global object**:
   ```javascript
   // In browser console on a GitHub PR page
   window.githubPRAutoComplete
   ```

2. **Get statistics**:
   ```javascript
   window.githubPRAutoComplete.getStats()
   ```

3. **Manually refresh word list**:
   ```javascript
   window.githubPRAutoComplete.engine.refresh()
   ```

4. **Add custom words**:
   ```javascript
   window.githubPRAutoComplete.engine.addCustomWords(['myword', 'anotherword'])
   ```

### Customization

The extension uses these default settings:
- `maxSuggestions`: 10
- `minWordLength`: 2
- `debounceDelay`: 300ms
- `updateThreshold`: 5000ms

These can be modified in the code if needed.

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "GitHub PR AutoComplete"
3. Click "Remove"
4. Confirm removal

## Getting Help

If you encounter issues:

1. **Check this guide** for common solutions
2. **Look at browser console** for error messages
3. **Test with the included test file** (`test_extension.html`)
4. **Try on different PRs** to isolate the issue
5. **Report issues** with:
   - Browser version
   - GitHub PR URL (if public)
   - Console error messages
   - Steps to reproduce

## Privacy & Security

This extension:
- ✅ Only runs on GitHub.com PR pages
- ✅ Processes content locally in your browser
- ✅ Does not send data to external servers
- ✅ Does not track or store personal information
- ✅ Only accesses publicly visible PR content
- ✅ Uses minimal permissions

---

**Enjoy faster PR reviews with intelligent auto-complete! 🚀**