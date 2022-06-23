//
//  UIKitInputsManager.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#include <unordered_map>
#include <fbjni/fbjni.h>

namespace tonlabs {
namespace uikit {

using namespace facebook;

//typedef std::function<void(double)> jsi::String;

class UIKitInputsManager : public jni::HybridClass<UIKitInputsManager> {
public:
    static constexpr auto kJavaDescriptor = "tonlabs/uikit/inputs/UIKitInputsManager;";
    static jni::local_ref<jhybriddata> initHybrid(jni::alias_ref<jhybridobject> jThis);
    static void registerNatives();

    void injectInputValue(int uid, std::string value);

private:
    friend HybridBase;
    jni::global_ref<UIKitInputsManager::javaobject> javaPart_;
    std::unordered_map<int, std::string> _strings;

    explicit UIKitInputsManager(
        jni::alias_ref<UIKitInputsManager::jhybridobject> jThis);

};

}
}
