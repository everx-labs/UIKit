//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#include <fbjni/fbjni.h>
#include <jsi/jsi.h>

#include "UIKitInputBinder.h"

namespace tonlabs::uikit {
using namespace facebook;

class UIKitInputManager : public jni::JavaClass<UIKitInputManager> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputManager;";

    jni::global_ref<UIKitInputBinder> bind(int reactTag);

    private:
};

}
