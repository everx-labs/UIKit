//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#include "UIKitInputManager.h"

namespace tonlabs::uikit {
using namespace facebook;

jni::alias_ref<UIKitInputManager::javaobject> UIKitInputManager::bind(int uid, std::string value) {
    auto method = getClass()->getMethod<void(int, std::string)>("bind");
    return method(self(), uid, value);
}

}