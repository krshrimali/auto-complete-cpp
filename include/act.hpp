#include "node.hpp"
#include <iostream>
#include <string>
#include <vector>

using namespace std;

// Auto Complete Tree
class ACT {
public:
  ACT() {
    root = new TrieNode();
    root->data = '\0';
    root->isEndOfWord = false;
  }

  TrieNode *root;
  void insert(const string &word);
  vector<string> autoComplete(const string &prefix);

private:
  void insertAllLetters(TrieNode *node, const string &word, int index);
  void findAllWordsFromNode(TrieNode *node, string prefix,
                            vector<string> &suggestions);
};
