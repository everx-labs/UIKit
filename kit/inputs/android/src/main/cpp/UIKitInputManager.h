//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#include <fbjni/fbjni.h>
#include <jsi/jsi.h>

#include "UIKitInputsBinder.h"
#include ""

namespace tonlabs::uikit {
using namespace facebook;

class UIKitInputManager : public jni::JavaClass<UIKitInputManager> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputManager;";

    jni::alias_ref<UIKitInputManager::javaobject> bind(int reactTag);

    private:
//    jni::global_ref<UIKitInputManager::javaobject> javaPart_;
};

}
