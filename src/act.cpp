#include "act.hpp"

void ACT::insert(const string &word) {
  insertAllLetters(root, word, /*index=*/0);
}

void ACT::insertAllLetters(TrieNode *node, const string &word, int index) {
  if (index == word.size()) {
    /* end of word */
    node->isEndOfWord = true;
    return;
  }

  char letter = word[index];
  if (node->children.find(letter) == node->children.end()) {
    /* letter not found in children */
    TrieNode *newNode = new TrieNode();
    newNode->data = letter;
    newNode->isEndOfWord = false;
    node->children[letter] = newNode;
    insertAllLetters(newNode, word, index + 1);
  } else {
    /* letter found in children */
    insertAllLetters(node->children[letter], word, index + 1);
  }
}

void ACT::findAllWordsFromNode(TrieNode *node, string prefix,
                               vector<string> &suggestions) {
  if (node->isEndOfWord) {
    suggestions.push_back(prefix);
  }
  for (auto child : node->children) {
    findAllWordsFromNode(child.second, prefix + child.first, suggestions);
  }
}

vector<string> ACT::autoComplete(const string &prefix) {
  vector<string> suggestions = {};
  TrieNode *node = root;
  // cout << "Autocompleting\n";
  for (auto letter : prefix) {
    if (node->children.find(letter) == node->children.end()) {
      /* letter not found in children */
      return suggestions;
    } else {
      /* letter found in children */
      node = node->children[letter];
    }
  }
  /* node is now at the end of the prefix */
  findAllWordsFromNode(node, prefix, suggestions);
  return suggestions;
}
