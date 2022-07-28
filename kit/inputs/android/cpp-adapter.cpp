#include <jni.h>
#include <jsi/jsi.h>
#include <fbjni/fbjni.h>
#include <ReactCommon/CallInvokerHolder.h>

#include <NativeReanimatedModule.h>

#include "UIKitInputBinderAndroid.h"
#include "UIKitInputBinderModuleAndroid.h"

using namespace facebook;
using namespace reanimated;
using namespace tonlabs::uikit;

struct UIKitInputsJsiModule : jni::JavaClass<UIKitInputsJsiModule> {
public:
    __unused static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/inputs/UIKitInputJSIModulePackage;";

    static void registerNatives() {
        javaClassStatic()->registerNatives({makeNativeMethod("installJSIBindings", UIKitInputsJsiModule::installJSIBindings)});
    }

private:
    static void installJSIBindings(jni::alias_ref<jni::JClass>,
                                   jlong jsContext,
                                   jni::alias_ref<facebook::react::CallInvokerHolder::javaobject> jsCallInvokerHolder,
                                   jni::alias_ref<UIKitInputBinderAndroid::javaobject> javaUIKitInputBinder) {
        jsi::Runtime *runtime = reinterpret_cast<facebook::jsi::Runtime *>(jsContext);

        std::shared_ptr<facebook::react::CallInvoker> jsCallInvoker =
            jsCallInvokerHolder->cthis()->getCallInvoker();

        jsi::Object reanimatedModuleProxy = runtime->global().getPropertyAsObject(*runtime, "__reanimatedModuleProxy");
        std::shared_ptr<reanimated::NativeReanimatedModule> reanimatedModule =
            std::static_pointer_cast<NativeReanimatedModule>(reanimatedModuleProxy.getHostObject(*runtime));

        jsi::Runtime &reanimatedRuntime = *reanimatedModule->runtime.get();

        auto uiKitInputInputBinderModule = std::make_unique<UIKitInputBinderModuleAndroid>(jsCallInvoker,
                                                                     reanimatedRuntime,
                                                                     jni::make_global(javaUIKitInputBinder));

        reanimatedRuntime.global().setProperty(
            reanimatedRuntime,
            "_uiKitInputBinder",
            jsi::Object::createFromHostObject(reanimatedRuntime, std::move(uiKitInputInputBinderModule))
        );
    }
};

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
    return jni::initialize(vm, [] {
        UIKitInputsJsiModule::registerNatives();
    });
}
