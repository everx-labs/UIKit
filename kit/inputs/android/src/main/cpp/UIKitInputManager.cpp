//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#include "UIKitInputManager.h"

namespace tonlabs::uikit {
using namespace facebook;

jni::global_ref<UIKitInputBinder> UIKitInputManager::bind(int uid) {
    static const auto method = getClass()->getMethod<UIKitInputBinder(int)>("bind");
    return jni::make_global(method(self(), uid));
}

}