cmake_minimum_required(VERSION 3.4.1)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)
set (CMAKE_CXX_FLAGS "-DON_ANDROID -DONANDROID -DFOR_HERMES=${FOR_HERMES}")

set(PACKAGE_NAME "UIKitKeyboard")

set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)
set(TURBOMODULE_DIR ${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core/ReactCommon)

add_library(${PACKAGE_NAME}
    SHARED
    ../cpp/UIKitKeyboardAndroidFrameListener.cpp
    ../cpp/UIKitKeyboardFrameListener.cpp
    ../cpp/UIKitKeyboardModule.cpp
    cpp-adapter.cpp
)

# includes

file (GLOB LIBFBJNI_INCLUDE_DIR "${BUILD_DIR}/fbjni-*-headers.jar/")

target_include_directories(
    ${PACKAGE_NAME}
    PRIVATE
    ${LIBFBJNI_INCLUDE_DIR}
    ${NODE_MODULES_DIR}/react-native/React
    ${NODE_MODULES_DIR}/react-native/React/Base
    ${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni
    ${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/jni
    ${NODE_MODULES_DIR}/react-native/ReactCommon
    ${NODE_MODULES_DIR}/react-native/ReactCommon/jsi
    ${NODE_MODULES_DIR}/react-native/ReactCommon/callinvoker
    ${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core
    ${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core/ReactCommon
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/Tools
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/SpecTools
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/SharedItems
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/Registries
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/NativeModules
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/LayoutAnimations
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/hidden_headers
    ../cpp
)

# find libraries

file(GLOB LIBRN_DIR "${BUILD_DIR}/react-native-0*/jni/${ANDROID_ABI}")

if(${FOR_HERMES})
    # Use Reanimated Hermes
    file(GLOB LIBREANIMATED_DIR "${BUILD_DIR}/react-native-reanimated-*-hermes.aar/jni/${ANDROID_ABI}")
else()
    # Use Reanimated JSC
    file(GLOB LIBREANIMATED_DIR "${BUILD_DIR}/react-native-reanimated-*-jsc.aar/jni/${ANDROID_ABI}")
endif()

find_library(
    FBJNI_LIB
    fbjni
    PATHS ${LIBRN_DIR}
    NO_CMAKE_FIND_ROOT_PATH
)
# find_library(
#     JSI_LIB
#     jsi
#     PATHS ${LIBRN_DIR}
#     NO_CMAKE_FIND_ROOT_PATH
# )
find_library(
    REACT_NATIVE_JNI_LIB
    reactnativejni
    PATHS ${LIBRN_DIR}
    NO_CMAKE_FIND_ROOT_PATH
)
find_library(
    REANIMATED_LIB
    reanimated
    PATHS ${LIBREANIMATED_DIR}
    NO_CMAKE_FIND_ROOT_PATH
)

# linking

target_link_libraries(${PACKAGE_NAME}
    # ${JSI_LIB}
    ${REANIMATED_LIB}
    ${REACT_NATIVE_JNI_LIB}
    ${FBJNI_LIB}
    android
)