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

class UIKitInputManager : public jni::HybridClass<UIKitInputManager> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputManager;";

    explicit UIKitInputManager(
        jni::alias_ref<UIKitInputManager::javaobject> jThis);

    void injectInputValue(int uid, std::string value, std::function<void(std::string)> log);

private:
    jni::global_ref<UIKitInputManager::javaobject> javaPart_;
};

}
