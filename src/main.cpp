#include "act.hpp"
#include "helper.cpp"

#include <sstream>

using namespace std;

int main(int argc, char *argv[]) {
  vector<string> fileOutput = readFile("input.txt");

  // AutoComplete Tree
  ACT *tree = new ACT();
  for (auto line : fileOutput) {
    // Split line into multiple words
    vector<string> words = [&] {
      vector<string> result;
      string word;
      istringstream iss(line);
      while (iss >> word) {
        result.push_back(word);
      }
      return result;
    }();

    for (auto word : words) {
      // string word = line.substr(0, line.find(" "));
      tree->insert(word);
    }
  }
  vector<string> suggestions = tree->autoComplete("h");
  if (suggestions.empty()) {
    cout << "No suggestions found\n";
  } else {
    cout << "Suggestions:\n";
    for (auto suggestion : suggestions) {
      cout << suggestion << endl;
    }
  }

  return 0;
}
