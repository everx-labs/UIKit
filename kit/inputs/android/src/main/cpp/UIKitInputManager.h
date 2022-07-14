//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#include <fbjni/fbjni.h>
#include <jsi/jsi.h>

namespace tonlabs::uikit {

using namespace facebook;

class InputValueAndSelectionInjector: public jni::JavaClass<InputValueAndSelectionInjector>, public jsi::HostObject {

private:
    int _reactTag;
    std::function<void(jobject, int, std::string)> _method;
    jobject _inputManager;

public:
    explicit InputValueAndSelectionInjector(
            std::function<void(jobject, int, std::string)> method,
            int reactTag,
            jobject inputManager
            ) :
                _reactTag(reactTag),
                _method(method),
                _inputManager(inputManager) {}

    void callInjectInputValue(std::string value);
};

class UIKitInputManager : public jni::JavaClass<UIKitInputManager> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputManager;";

//    explicit UIKitInputManager(
//        jni::alias_ref<UIKitInputManager::javaobject> jThis);

    void callInjectInputValue(int uid, std::string value);

    InputValueAndSelectionInjector getInputValueInjector(int reactTag);



    private:
//    jni::global_ref<UIKitInputManager::javaobject> javaPart_;
};

}
