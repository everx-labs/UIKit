//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#ifdef __ANDROID__
#include <fbjni/fbjni.h>

#include <jsi/jsi.h>

#include "UIKitInputControllerAndroid.h"

namespace tonlabs::uikit {
using namespace facebook;

class UIKitInputBinderAndroid : public jni::JavaClass<UIKitInputBinderAndroid> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputBinder;";

    jni::global_ref<UIKitInputControllerAndroid> bind(int reactTag);

    private:
};

}
#endif
