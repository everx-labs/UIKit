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

//UIKitInputManager::UIKitInputManager(
//    jni::alias_ref<UIKitInputManager::javaobject> jThis) {};

// Java methods should usually be wrapped by C++ methods for ease-of-use.
    // (Most other examples in this document will inline these for brevity.)
//    void callVoidMethod() {
//        static const auto method = getClass()->getMethod<void()>("voidMethod");
//        // self() returns the raw JNI reference to this object.
//        method(self());
//    }
//
    void UIKitInputManager::callInjectInputValue(int uid, std::string value) {
        // TODO: somehow turn it into JInteger and JString
        // and call java method
    //    jni::slowCall()
//        javaPart_.get()->injectInputValue(uid, value, log);
//        static_cast<UIKitInputManager>(javaPart_).injectInputValue(uid, value, log);
//        javaPart_->cthis()->injectInputValue(123, "123132");

        auto method = getClass()->getMethod<void(int, std::string)>("injectInputValue");
        method(self(), uid, value);
        return;
    }

    InputValueAndSelectionInjector
    UIKitInputManager::getInputValueInjector(int reactTag) {
        auto method = getClass()->getMethod<void(int, std::string)>("injectInputValue");
        return InputValueAndSelectionInjector(method, reactTag, self());
    }

    void
    InputValueAndSelectionInjector::callInjectInputValue(std::string value) {
        _method(_inputManager, _reactTag, value);
    }
}