//
//  UIKitInputsModuleAndroid.cpp
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//
#ifdef __ANDROID__

#include "UIKitInputsModuleAndroid.h"

#include <utility>
#include "UIKitInputBinderAndroid.h"
#include "UIKitInputBinderHostObjectAndroid.h"

namespace tonlabs::uikit {
using namespace facebook;
using namespace reanimated;

static jsi::Value __hostFunction_UIKitInputsModuleSpec_bind(
        jsi::Runtime &rt,
        TurboModule &turboModule,
        const jsi::Value *args,
        [[maybe_unused]] size_t count) {
    return dynamic_cast<UIKitInputsModuleSpec *>(&turboModule)->bind(std::move(args[0]));
}

UIKitInputsModuleSpec::UIKitInputsModuleSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitInputsModuleAndroid", std::move(jsInvoker)) {
    methodMap_["bind"] = MethodMetadata{
      1, __hostFunction_UIKitInputsModuleSpec_bind};
}

jsi::Object UIKitInputsModuleAndroid::bind(const jsi::Value &reactTag) {
    int viewTag = static_cast<int>(reactTag.asNumber());

    // Get a Java class that contains resolved view (UIKitInputBinderAndroid.java)
    jni::global_ref<UIKitInputBinderAndroid> javaInputBinder = _javaInputsManager->bind(viewTag);

    auto uiKitBinderHostObject = std::make_unique<UIKitInputBinderHostObjectAndroid>(_jsInvoker,
                                                                                     _runtime,
                                                                                     javaInputBinder);

    return jsi::Object::createFromHostObject(_runtime, std::move(uiKitBinderHostObject));
}

}
#endif
