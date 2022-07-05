//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#include <fbjni/fbjni.h>

namespace tonlabs::uikit {

using namespace facebook;

class UIKitInputsManager : public jni::HybridClass<UIKitInputsManager> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputsManager;";

    explicit UIKitInputsManager(
        jni::alias_ref<UIKitInputsManager::javaobject> jThis);

    void injectInputValue(int uid, std::string value);

private:
    jni::global_ref<UIKitInputsManager::javaobject> javaPart_;
};

}
