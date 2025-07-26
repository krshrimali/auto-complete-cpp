# GitHub PR AutoComplete Extension

A Chrome/Edge browser extension that provides intelligent auto-complete suggestions when reviewing GitHub Pull Requests. The extension extracts words from the "Files changed" tab and provides context-aware suggestions while typing comments or reviews.

## Features

- 🔍 **Smart Word Extraction**: Analyzes code changes, file names, and existing comments
- ⚡ **Fast Auto-Complete**: Uses a Trie data structure (ported from C++) for efficient prefix matching
- 🎨 **GitHub-Native UI**: Seamlessly integrates with GitHub's design language
- ⌨️ **Keyboard Navigation**: Full keyboard support (↑↓ arrows, Enter, Tab, Escape)
- 🌙 **Dark Mode Support**: Automatically adapts to GitHub's light/dark themes
- 📱 **Mobile Responsive**: Works on mobile GitHub interface
- ♿ **Accessibility**: Supports screen readers and high contrast mode

## How It Works

1. **Page Load**: When you visit a GitHub PR page, the extension scans the "Files changed" tab
2. **Word Extraction**: Intelligently extracts meaningful words from:
   - Code changes (added, removed, and context lines)
   - File names and paths
   - Existing comments and reviews
   - Variable names, function names, and programming keywords
3. **Trie Building**: Builds a fast Trie data structure for efficient auto-complete
4. **Real-time Suggestions**: As you type in comment boxes, provides relevant suggestions
5. **Smart Filtering**: Prioritizes shorter, more relevant words and excludes common noise words

## Installation

### From Source (Development)

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd github-pr-autocomplete
   ```

2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the extension directory

5. The extension will now be active on GitHub PR pages

### From Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store once published.

## Usage

1. **Navigate to a GitHub PR**: Visit any GitHub Pull Request page
2. **Wait for Initialization**: The extension will automatically scan the PR content (check console for "GitHub PR AutoComplete: Initialized" message)
3. **Start Typing**: Click in any comment box and start typing
4. **See Suggestions**: Auto-complete suggestions will appear after typing 2+ characters
5. **Navigate**: Use ↑↓ arrow keys to navigate suggestions
6. **Select**: Press Enter or Tab to apply a suggestion
7. **Dismiss**: Press Escape to hide suggestions

### Supported Input Fields

The extension works in:
- PR review comments
- General PR comments  
- Commit comments
- Code review suggestions
- Issue comments (on PR pages)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` | Navigate up in suggestions |
| `↓` | Navigate down in suggestions |
| `Enter` | Apply selected suggestion |
| `Tab` | Apply selected suggestion |
| `Escape` | Hide suggestions |

## Development

### Architecture

The extension consists of several key components:

- **`lib/trie.js`**: JavaScript port of the C++ Trie implementation
- **`lib/parser.js`**: GitHub content parser for extracting words
- **`lib/autocomplete.js`**: Main auto-complete engine
- **`content/content.js`**: UI handling and user interactions
- **`styles/autocomplete.css`**: GitHub-integrated styling
- **`background/background.js`**: Extension background service worker

### Building from C++ Source

The original C++ implementation is available in the repository. To build and test:

```bash
mkdir build && cd build
cmake ..
make
./auto-complete-cpp ../inputSamples/input.txt "h"
```

### Debugging

1. Open Chrome DevTools on a GitHub PR page
2. Check the Console for extension logs
3. Access the global object: `window.githubPRAutoComplete`
4. Get statistics: `window.githubPRAutoComplete.getStats()`
5. Manually refresh: `window.githubPRAutoComplete.engine.refresh()`

## Configuration

The extension stores settings in Chrome's sync storage:

- `enabled`: Enable/disable the extension (default: true)
- `maxSuggestions`: Maximum suggestions to show (default: 10)
- `minWordLength`: Minimum word length to include (default: 2)
- `debounceDelay`: Typing delay before showing suggestions (default: 300ms)

## Privacy

This extension:
- ✅ Only runs on GitHub.com PR pages
- ✅ Processes content locally in your browser
- ✅ Does not send any data to external servers
- ✅ Does not track or store personal information
- ✅ Only accesses publicly visible PR content

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Other Chromium-based browsers

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly on various GitHub PRs
5. Submit a pull request

### Development Setup

```bash
# Install dependencies (if any)
npm install

# For C++ development
mkdir build && cd build
cmake ..
make

# Load extension in Chrome for testing
# Go to chrome://extensions/, enable Developer mode, click "Load unpacked"
```

## Roadmap

- [ ] Firefox extension support
- [ ] Custom word lists
- [ ] Frequency-based ranking
- [ ] Multi-language code parsing
- [ ] Settings UI panel
- [ ] Export/import word lists
- [ ] GitHub Enterprise support

## License

MIT License - see LICENSE file for details.

## Credits

- Original C++ Trie implementation by [Your Name]
- Inspired by modern IDE auto-complete features
- Built for the GitHub developer community

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify you're on a GitHub PR page with file changes
3. Try refreshing the page
4. Open an issue with reproduction steps

---

**Made with ❤️ for the GitHub community**