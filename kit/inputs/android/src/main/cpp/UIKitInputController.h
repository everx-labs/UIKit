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

#include "UIKitInputBinder.h"

namespace tonlabs::uikit {
using namespace facebook;

class UIKitInputController : public jni::JavaClass<UIKitInputController> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputController;";

    jni::global_ref<UIKitInputBinder> bind(int reactTag);

    private:
};

}
#endif
