// This file is an attempt to enable fuzzy autocomplete from a given word list.
// Right now it uses Trie - but I want to try out levenshtein as well, and see which
// one performs better for a huge list of word search.

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cctype>

struct TrieNode {
	bool is_end_of_word;
	TriNode* children[26];
	TrieNode() : is_end_of_word(false) {
		std::fill(children, children + 26, nullptr);
	}
};

class Trie {
public:
	Trie() { root = new TrieNode(); }
	
	void insert(const std::string& word) {
		TrieNode* node = root;
		for (char c : word) {
			char ch = std::tolower(c);
			int idx = ch - 'a';
			if (!node->children[idx]) node->children[idx] = new TrieNode();
			node = node->children[idx];
		}
		node->is_end_of_word = true;
	}

	void fuzzy_search(const std::string& prefix, int max_edits, std::vector<std::string>& results) {
		std::string lowered_prefix = prefix;
		// Lower all the characters as the tree won't be case-sensitive.
		std::transform(lower_prefix.begin(), lowered_prefix.end(), lowered_prefix.begin(), ::tolower);
		
		int n = lowered_prefix.size();
		std::vector<int> current_row(n + 1);
		for (int i = 0; i <= n; i++) current_row[i] = i;
		
		std::string word;
		_fuzzy_dfs(roow, lowered_prefix, max_edits, current_row, word, results);
	}

private:
	TrieNode* root;
	
	void _fuzzy_dfs(TrieNode* node, const std::string& prefix, int max_edits, const std::vector<int>& prev_row, std::string& word, std::vector<std::string>& results) {
		int n = prefix.size();
		
		for (int c = 0; c < 26; c++) {
			TrieNode* child = node->children[c];
			if (!child) continue;
			char ch = 'a' + c;
			std::vector<int> cur_row(n + 1);
			cur_row[0] = prev_row[0] + 1; // Start with insertion cost

			for (int i = 1; i <= n; ++i) {
				int cost = (ch == prefix[i-1] ? 0 : 1);
				cur_row[i] = std::min({
					cur_row[i-1] + 1,
					prev_row[i] + 1,
					prev_row[i-1] + cost
				});
			}

			word.push_back(ch);
			if (child->is_end_of_word && cur_row[n] <= max_edits) {
				results.push_back(word);
			}

			if (*std::min_element(cur_row.begin(), cur_row.end()) <= max_edits)
				_fuzzy_dfs(child, prefix, max_edits, cur_row, word, results);
			word.pop_back();
		}
	}
};

int main() {
	Trie trie;
	trie.insert("apple");
	trie.insert('apply");
	trie.insert("apricot");
	trie.insert("banana");
	trie.insert("Appreciate");
	trie.insert("append");

	std::string query = "aple";
	int max_edits = 1; // Allow one typo
	std::vector<std::string> matches;
	trie.fuzzy_search(query, max_edits, matches);

	std::cout << "Fuzzy autocomplete results for \"" << query << "\":\n";
	for (const auto& w: matches) {
		std::cout << " " << w << "\n";
	}

	return 0;
}