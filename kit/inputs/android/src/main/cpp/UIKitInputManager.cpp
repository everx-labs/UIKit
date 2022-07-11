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

    void UIKitInputManager::injectInputValue(int uid, std::string value) {
        // TODO: somehow turn it into JInteger and JString
        // and call java method
    //    jni::slowCall()
//        javaPart_.get()->injectInputValue(uid, value, log);
//        static_cast<UIKitInputManager>(javaPart_).injectInputValue(uid, value, log);
        javaPart_->cthis()->injectInputValue(123, "123132");

        return;
    };

}