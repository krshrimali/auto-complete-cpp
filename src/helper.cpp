#include <fstream>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

vector<string> readFile(string fileName) {
  vector<string> fileOutput;
  string line;
  ifstream file(fileName);
  if (file.is_open()) {
    while (getline(file, line)) {
      fileOutput.push_back(line);
    }
    file.close();
  } else {
    cout << "Unable to open file";
  }
  return fileOutput;
}
