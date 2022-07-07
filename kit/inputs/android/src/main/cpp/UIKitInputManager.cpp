//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#include <fbjni/fbjni.h>

#include "UIKitInputManager.h"

namespace tonlabs::uikit {

using namespace facebook;

UIKitInputManager::UIKitInputManager(
    jni::alias_ref<UIKitInputManager::javaobject> jThis)
    : javaPart_(jni::make_global(jThis)) {};

    void UIKitInputManager::injectInputValue(int uid, std::string value, std::function<void(std::string)> log) {
        // TODO: somehow turn it into JInteger and JString
        // and call java method
    //    jni::slowCall()
        log("UIKitInputsManager.cpp: injectInputValue -> ");
        return;
    };

}