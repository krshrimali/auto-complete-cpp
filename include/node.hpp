#include <unordered_map>

using namespace std;

class TrieNode {
public:
  char data;
  bool isEndOfWord; // whether this node marks the end of the word coming from
                    // the root
  unordered_map<char, TrieNode *> children;
};
