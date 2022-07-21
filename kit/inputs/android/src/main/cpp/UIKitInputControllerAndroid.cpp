//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//
#ifdef __ANDROID__

#include "UIKitInputControllerAndroid.h"

namespace tonlabs::uikit {
using namespace facebook;

jni::global_ref<UIKitInputBinderAndroid> UIKitInputControllerAndroid::bind(int uid) {
    static const auto method = getClass()->getMethod<UIKitInputBinderAndroid(int)>("bind");
    return jni::make_global(method(self(), uid));
}

}
#endif
