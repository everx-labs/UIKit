#include <jni.h>
#include <jsi/jsi.h>
#include <fbjni/fbjni.h>
#include <ReactCommon/CallInvokerHolder.h>

#include <NativeReanimatedModule.h>

#include "UIKitInputsManager.h"
#include <jni.h>

using namespace facebook;
using namespace reanimated;
using namespace tonlabs::uikit;

struct UIKitInputsJsiModule : jni::JavaClass<UIKitInputsJsiModule> {
public:
    __unused static constexpr auto kJavaDescriptor = "tonlabs/uikit/inputs/UIKitInputsJSIModulePackage;";

    static void registerNatives() {
        javaClassStatic()->registerNatives({makeNativeMethod("installJSIBindings", UIKitInputsJsiModule::installJSIBindings)});
    }

private:
    static void installJSIBindings(jni::alias_ref<jni::JClass>,
                                   jlong jsContext,
                                   jni::alias_ref<facebook::react::CallInvokerHolder::javaobject> jsCallInvokerHolder,
                                   jni::alias_ref<UIKitInputsManager::javaobject> javaUIKitInputsManager) {
        jsi::Runtime *runtime = reinterpret_cast<facebook::jsi::Runtime *>(jsContext);

        std::shared_ptr<facebook::react::CallInvoker> jsCallInvoker =
            jsCallInvokerHolder->cthis()->getCallInvoker();

        jsi::Object reanimatedModuleProxy = runtime->global().getPropertyAsObject(*runtime, "__reanimatedModuleProxy");
        std::shared_ptr<reanimated::NativeReanimatedModule> reanimatedModule = 
            std::static_pointer_cast<NativeReanimatedModule>(reanimatedModuleProxy.getHostObject(*runtime));

        auto uiKitInputsManager =
            std::make_unique<UIKitInputsManager>(jni::make_global(javaUIKitInputsManager));

        auto uiKitInputsModule = std::make_shared<UIKitInputsManager>(jsCallInvoker,
                                                                    *runtime,
                                                                    reanimatedModule,
                                                                    std::move(uiKitInputsManager));

        auto clb4 = [uiKitInputsModule](
                jsi::Runtime &rt,
                const jsi::Value &thisValue,
                const jsi::Value *args,
                const size_t count) -> jsi::Value {
            int viewTag = static_cast<int>(args[0].asNumber());
            std::string value = args[1].getString(rt).utf8(rt);
            uiKitInputsModule->injectInputValue(viewTag, value);
        };

        jsi::Value injectInputValue = jsi::Function::createFromHostFunction(
                *runtime, jsi::PropNameID::forAscii(*runtime, "_injectInputValue"), 2, clb4);

        runtime->global().setProperty(
            *runtime,
            "_injectInputValue",
            std::move(injectInputValue));
    }
};

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
    return jni::initialize(vm, [] { 
        UIKitInputsJsiModule::registerNatives();
        UIKitInputsManager::registerNatives();
    });
}
