//
//  UIKitInputsModule.cpp
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#include "UIKitInputsModule.h"
#include "UIKitInputsBinder.h"
#include "UIKitInputsBinderHostObject.h"

namespace tonlabs::uikit {
using namespace facebook;
using namespace reanimated;

static jsi::Value __hostFunction_UIKitInputsModuleSpec_bind(
        jsi::Runtime &rt,
        TurboModule &turboModule,
        const jsi::Value *args,
        size_t count) {
    return static_cast<UIKitInputsModuleSpec *>(&turboModule)->bind(std::move(args[0]));
}

UIKitInputsModuleSpec::UIKitInputsModuleSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitInputsModule", jsInvoker) {
    methodMap_["bind"] = MethodMetadata{
      1, __hostFunction_UIKitInputsModuleSpec_bind};
}

jsi::Object UIKitInputsModule::bind(const jsi::Value &reactTag) {
    int viewTag = static_cast<int>(reactTag.asNumber());

    // Get a Java class that contains resolved view (UIKitInputBinder.java)
    jni::global_ref<UIKitInputsBinder> javaInputsBinder = _javaInputsManager->bind(viewTag);

    auto uiKitBinderHostObject = std::make_unique<UIKitInputsBinderHostObject>(_jsInvoker,
                                                                               _runtime,
                                                                               javaInputsBinder);

    return jsi::Object::createFromHostObject(_runtime, std::move(uiKitBinderHostObject));
}
}
