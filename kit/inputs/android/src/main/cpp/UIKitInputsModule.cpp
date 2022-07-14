//
//  UIKitInputsModule.cpp
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#include "UIKitInputsModule.h"

namespace tonlabs::uikit {
    using namespace facebook;
    using namespace reanimated;

    static jsi::Value __hostFunction_UIKitInputsModuleSpec_injectInputValue(
        jsi::Runtime &rt,
        TurboModule &turboModule,
        const jsi::Value *args,
        size_t count) {
        static_cast<UIKitInputsModuleSpec *>(&turboModule)->callInjectInputValue(std::move(args[0]), std::move(args[1]));
        return jsi::Value::undefined();
    }

    static jsi::Value __hostFunction_UIKitInputsModuleSpec_getInputValueInjector(
            jsi::Runtime &rt,
            TurboModule &turboModule,
            const jsi::Value *args,
            size_t count) {

        return static_cast<UIKitInputsModuleSpec *>(&turboModule)->getInputValueInjector(std::move(args[0]));
    }

    UIKitInputsModuleSpec::UIKitInputsModuleSpec(std::shared_ptr<CallInvoker> jsInvoker) : TurboModule("UIKitInputsModule", jsInvoker) {
        methodMap_["injectInputValue"] = MethodMetadata{
          1, __hostFunction_UIKitInputsModuleSpec_injectInputValue};
        methodMap_["getInputValueInjector"] = MethodMetadata{
                1, __hostFunction_UIKitInputsModuleSpec_getInputValueInjector};
    }

    void UIKitInputsModule::callInjectInputValue(const jsi::Value &reactTag, const jsi::Value &val) {
        int viewTag = static_cast<int>(reactTag.asNumber());
        std::string value = val.getString(runtime).utf8(runtime);
        #ifdef __ANDROID__
            _javaInputsManager->callInjectInputValue(viewTag, value);
        #endif
    }

    jsi::Value UIKitInputsModule::getInputValueInjector(const jsi::Value &reactTag) {
        InputValueAndSelectionInjector inputValueInjector = _javaInputsManager->getInputValueInjector(static_cast<int>(reactTag.asNumber()));
        std::shared_ptr<InputValueAndSelectionInjector> inputValueInjectorShared =
            std::make_shared<InputValueAndSelectionInjector>(
                std::move(inputValueInjector)
            );

        jsi::Object inputValueInjectorObject = jsi::Object::createFromHostObject(runtime, inputValueInjectorShared);
//        if (inputValueInjectorObject.hasProperty(runtime, "injectInputValue")) {
//            return reactTag.asNumber();
//        }
//        return 000;
        return inputValueInjectorObject;
    }
}
