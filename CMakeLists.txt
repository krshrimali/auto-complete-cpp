cmake_minimum_required(VERSION 3.0.0)
project(auto-complete-cpp VERSION 0.1.0)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(CTest)
enable_testing()

include_directories("include")
add_executable(auto-complete-cpp src/main.cpp src/act.cpp)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
