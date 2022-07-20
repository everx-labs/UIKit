cmake_minimum_required(VERSION 3.5.1)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)
set (CMAKE_CXX_FLAGS "-DON_ANDROID -DONANDROID -DFOR_HERMES=${FOR_HERMES}")

set(PACKAGE_NAME "UIKitInputs")

set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)
set(RN_SO_DIR ${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/first-party/react/jni)

add_library(${PACKAGE_NAME}
    SHARED
    ./src/main/cpp/UIKitInputController.cpp
    ./src/main/cpp/UIKitInputsModule.cpp
    ./src/main/cpp/UIKitInputBinder.cpp
    ./src/main/cpp/UIKitInputBinderHostObject.cpp
    cpp-adapter.cpp
)

# includes

file (GLOB LIBFBJNI_INCLUDE_DIR "${BUILD_DIR}/fbjni-*-headers.jar/")

if(${REACT_NATIVE_VERSION} LESS 66)
    set(
        INCLUDE_JSI_CPP
        "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/jsi.cpp"
    )
    set(
        INCLUDE_JSIDYNAMIC_CPP
        "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/JSIDynamic.cpp"
    )
endif()

target_include_directories(
    ${PACKAGE_NAME}
    PRIVATE
    # --- fbjni ---
    ${LIBFBJNI_INCLUDE_DIR}
    # --- React Native ---
    ${NODE_MODULES_DIR}/react-native/React
    ${NODE_MODULES_DIR}/react-native/React/Base
    ${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni
    ${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/jni
    ${NODE_MODULES_DIR}/react-native/ReactCommon
    ${NODE_MODULES_DIR}/react-native/ReactCommon/callinvoker
    ${NODE_MODULES_DIR}/react-native/ReactCommon/jsi
    ${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core
    ${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core/ReactCommon
    ${INCLUDE_JSI_CPP} # only on older RN versions
    ${INCLUDE_JSIDYNAMIC_CPP} # only on older RN versions
    # --- Reanimated ---
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/Tools
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/SpecTools
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/SharedItems
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/Registries
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/NativeModules
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/LayoutAnimations
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/headers/AnimatedSensor
    ${NODE_MODULES_DIR}/react-native-reanimated/Common/cpp/hidden_headers
    ./src/main/cpp
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

if(${REACT_NATIVE_VERSION} LESS 66)
    # JSI lib didn't exist on RN 0.65 and before. Simply omit it.
    set (JSI_LIB "")
else()
    # RN 0.66 distributes libjsi.so, can be used instead of compiling jsi.cpp manually.
    find_library(
            JSI_LIB
            jsi
            PATHS ${LIBRN_DIR}
            NO_CMAKE_FIND_ROOT_PATH
    )
endif()

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

find_library(
    LOG_LIB
    log
)

# linking

target_link_libraries(
    ${PACKAGE_NAME}
    ${LOG_LIB}
    ${JSI_LIB}
    ${JS_ENGINE_LIB} # <-- Hermes or JSC
    ${REANIMATED_LIB}
    ${REACT_NATIVE_JNI_LIB}
    ${FBJNI_LIB}
    android
)