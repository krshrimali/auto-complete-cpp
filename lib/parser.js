/**
 * GitHub PR Content Parser
 * Extracts meaningful words from the "Files changed" tab for auto-complete
 */
class GitHubParser {
    constructor() {
        this.codeKeywords = new Set([
            // Common programming keywords to include
            'function', 'class', 'const', 'let', 'var', 'return', 'import', 'export',
            'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue',
            'try', 'catch', 'finally', 'throw', 'async', 'await', 'promise',
            'public', 'private', 'protected', 'static', 'abstract', 'interface',
            'extends', 'implements', 'constructor', 'super', 'this', 'new',
            'true', 'false', 'null', 'undefined', 'typeof', 'instanceof'
        ]);
        
        this.minWordLength = 2;
        this.maxWordLength = 50;
    }

    /**
     * Extract all meaningful words from GitHub PR files changed tab
     * @returns {Set<string>} Set of unique words found in the PR
     */
    extractWordsFromPR() {
        const words = new Set();
        
        // Wait for the page to load and try multiple times if needed
        const filesChangedContent = this.getFilesChangedContent();
        if (!filesChangedContent) {
            console.log('GitHub PR AutoComplete: Files changed content not found');
            return words;
        }

        // Extract words from different parts of the PR
        this.extractFromCodeBlocks(filesChangedContent, words);
        this.extractFromFileNames(words);
        this.extractFromComments(words);
        
        console.log(`GitHub PR AutoComplete: Extracted ${words.size} unique words`);
        return words;
    }

    /**
     * Get the files changed content from GitHub PR page
     * @returns {Element|null} The files changed container element
     */
    getFilesChangedContent() {
        // Try multiple selectors as GitHub's DOM structure can vary
        const selectors = [
            '#files_bucket',
            '.js-diff-progressive-container',
            '[data-target="diff-layout.diffContainer"]',
            '.diff-view'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }

        // If not found, wait and try again
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        obs.disconnect();
                        resolve(element);
                        return;
                    }
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Timeout after 5 seconds
            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, 5000);
        });
    }

    /**
     * Extract words from code blocks in the diff
     * @param {Element} container - The files changed container
     * @param {Set<string>} words - Set to add words to
     */
    extractFromCodeBlocks(container, words) {
        // Find all code lines (added, removed, and context)
        const codeLines = container.querySelectorAll(
            '.blob-code-inner, .blob-code, .js-file-line, .diff-line-code'
        );

        codeLines.forEach(line => {
            const text = line.textContent || '';
            this.extractWordsFromText(text, words);
        });
    }

    /**
     * Extract words from file names in the PR
     * @param {Set<string>} words - Set to add words to
     */
    extractFromFileNames(words) {
        // Extract from file headers
        const fileHeaders = document.querySelectorAll(
            '.file-header [title], .file-info a, .js-navigation-open'
        );

        fileHeaders.forEach(header => {
            const fileName = header.textContent || header.getAttribute('title') || '';
            this.extractWordsFromFileName(fileName, words);
        });
    }

    /**
     * Extract words from existing comments in the PR
     * @param {Set<string>} words - Set to add words to
     */
    extractFromComments(words) {
        const comments = document.querySelectorAll(
            '.comment-body, .review-comment-contents, .js-comment-body'
        );

        comments.forEach(comment => {
            const text = comment.textContent || '';
            this.extractWordsFromText(text, words);
        });
    }

    /**
     * Extract meaningful words from a text string
     * @param {string} text - Input text
     * @param {Set<string>} words - Set to add words to
     */
    extractWordsFromText(text, words) {
        if (!text) return;

        // Remove common code symbols and split into potential words
        const cleanText = text
            .replace(/[{}()\[\];,.<>!@#$%^&*+=|\\`~"]/g, ' ')
            .replace(/[-_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const potentialWords = cleanText.split(' ');

        potentialWords.forEach(word => {
            word = word.trim();
            
            // Filter words
            if (this.isValidWord(word)) {
                words.add(word);
                
                // Also add camelCase/PascalCase parts
                this.extractCamelCaseWords(word, words);
            }
        });
    }

    /**
     * Extract words from file names (handle extensions, paths, etc.)
     * @param {string} fileName - File name/path
     * @param {Set<string>} words - Set to add words to
     */
    extractWordsFromFileName(fileName, words) {
        if (!fileName) return;

        // Remove file extension and path separators
        const cleanName = fileName
            .replace(/\.[^.]*$/, '') // Remove extension
            .replace(/[\/\\]/g, ' ') // Replace path separators
            .replace(/[-_.]/g, ' '); // Replace common separators

        this.extractWordsFromText(cleanName, words);
    }

    /**
     * Extract individual words from camelCase or PascalCase strings
     * @param {string} word - Input word
     * @param {Set<string>} words - Set to add words to
     */
    extractCamelCaseWords(word, words) {
        // Split camelCase/PascalCase: myVariableName -> my, Variable, Name
        const camelCaseParts = word.split(/(?=[A-Z])/).filter(part => part.length > 0);
        
        camelCaseParts.forEach(part => {
            const cleanPart = part.toLowerCase();
            if (this.isValidWord(cleanPart)) {
                words.add(cleanPart);
            }
        });
    }

    /**
     * Check if a word is valid for auto-complete
     * @param {string} word - Word to validate
     * @returns {boolean} True if word is valid
     */
    isValidWord(word) {
        if (!word || typeof word !== 'string') return false;
        
        // Length check
        if (word.length < this.minWordLength || word.length > this.maxWordLength) {
            return false;
        }

        // Must contain at least one letter
        if (!/[a-zA-Z]/.test(word)) {
            return false;
        }

        // Exclude common noise words but include programming keywords
        const noiseWords = new Set([
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
            'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be',
            'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'can', 'shall'
        ]);

        const lowerWord = word.toLowerCase();
        
        // Include if it's a programming keyword
        if (this.codeKeywords.has(lowerWord)) {
            return true;
        }

        // Exclude common noise words
        if (noiseWords.has(lowerWord)) {
            return false;
        }

        // Exclude words that are just numbers
        if (/^\d+$/.test(word)) {
            return false;
        }

        // Exclude very common single characters
        if (word.length === 1 && !/[a-zA-Z]/.test(word)) {
            return false;
        }

        return true;
    }

    /**
     * Monitor for changes in the Files changed tab and re-extract words
     * @param {Function} callback - Callback function to call when words are updated
     */
    monitorForChanges(callback) {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach(mutation => {
                // Check if files changed content was modified
                if (mutation.target.closest('#files_bucket') || 
                    mutation.target.closest('.js-diff-progressive-container')) {
                    shouldUpdate = true;
                }
            });

            if (shouldUpdate) {
                setTimeout(() => {
                    const words = this.extractWordsFromPR();
                    callback(words);
                }, 500); // Small delay to ensure DOM is updated
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }
}