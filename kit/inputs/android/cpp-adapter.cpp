#include <jni.h>
#include <jsi/jsi.h>
#include <fbjni/fbjni.h>
#include <ReactCommon/CallInvokerHolder.h>

#include <NativeReanimatedModule.h>

#include "UIKitInputsManager.h"
#include "UIKitInputsModule.h"
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

        auto uiKitInputsModule = std::make_shared<UIKitInputsModule>(jsCallInvoker,
                                                                    *runtime,
                                                                    jni::make_global(javaUIKitInputsManager),
                                                                    reanimatedModule);

        runtime->global().setProperty(
            *runtime, 
            jsi::PropNameID::forAscii(*runtime, "__uikitInputs"),
            jsi::Object::createFromHostObject(*runtime, std::move(uiKitInputsModule)));
    }
};

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
    return jni::initialize(vm, [] { 
        UIKitInputsJsiModule::registerNatives();
//        UIKitInputsManager::registerNatives();
    });
}
