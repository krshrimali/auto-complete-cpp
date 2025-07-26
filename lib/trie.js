/**
 * TrieNode class - equivalent to the C++ TrieNode
 */
class TrieNode {
    constructor() {
        this.data = '';
        this.isEndOfWord = false;
        this.children = new Map(); // Using Map instead of unordered_map
    }
}

/**
 * Auto Complete Tree (ACT) class - JavaScript port of the C++ implementation
 */
class ACT {
    constructor() {
        this.root = new TrieNode();
        this.root.data = '\0';
        this.root.isEndOfWord = false;
    }

    /**
     * Insert a word into the Trie
     * @param {string} word - The word to insert
     */
    insert(word) {
        if (!word || typeof word !== 'string') return;
        this.insertAllLetters(this.root, word, 0);
    }

    /**
     * Recursive helper to insert all letters of a word
     * @param {TrieNode} node - Current node
     * @param {string} word - Word being inserted
     * @param {number} index - Current character index
     */
    insertAllLetters(node, word, index) {
        if (index === word.length) {
            // End of word
            node.isEndOfWord = true;
            return;
        }

        const letter = word[index];
        if (!node.children.has(letter)) {
            // Letter not found in children
            const newNode = new TrieNode();
            newNode.data = letter;
            newNode.isEndOfWord = false;
            node.children.set(letter, newNode);
            this.insertAllLetters(newNode, word, index + 1);
        } else {
            // Letter found in children
            this.insertAllLetters(node.children.get(letter), word, index + 1);
        }
    }

    /**
     * Find all words starting from a given node
     * @param {TrieNode} node - Starting node
     * @param {string} prefix - Current prefix
     * @param {string[]} suggestions - Array to store suggestions
     */
    findAllWordsFromNode(node, prefix, suggestions) {
        if (node.isEndOfWord) {
            suggestions.push(prefix);
        }
        
        for (const [char, childNode] of node.children) {
            this.findAllWordsFromNode(childNode, prefix + char, suggestions);
        }
    }

    /**
     * Get auto-complete suggestions for a prefix
     * @param {string} prefix - The prefix to search for
     * @returns {string[]} Array of suggestions
     */
    autoComplete(prefix) {
        const suggestions = [];
        let node = this.root;

        // Navigate to the end of the prefix
        for (const letter of prefix) {
            if (!node.children.has(letter)) {
                // Letter not found in children
                return suggestions;
            } else {
                // Letter found in children
                node = node.children.get(letter);
            }
        }

        // Node is now at the end of the prefix
        this.findAllWordsFromNode(node, prefix, suggestions);
        return suggestions;
    }

    /**
     * Get the size of the trie (number of words)
     * @returns {number} Number of words in the trie
     */
    size() {
        return this.countWords(this.root);
    }

    /**
     * Count total words in the trie
     * @param {TrieNode} node - Current node
     * @returns {number} Number of words
     */
    countWords(node) {
        let count = node.isEndOfWord ? 1 : 0;
        for (const [char, childNode] of node.children) {
            count += this.countWords(childNode);
        }
        return count;
    }

    /**
     * Check if a word exists in the trie
     * @param {string} word - Word to search for
     * @returns {boolean} True if word exists
     */
    contains(word) {
        let node = this.root;
        for (const letter of word) {
            if (!node.children.has(letter)) {
                return false;
            }
            node = node.children.get(letter);
        }
        return node.isEndOfWord;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TrieNode, ACT };
}