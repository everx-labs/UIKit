#include <jni.h>
#include <jsi/jsi.h>
#include <fbjni/fbjni.h>
#include <ReactCommon/CallInvokerHolder.h>

#include <NativeReanimatedModule.h>

#include "UIKitKeyboardModule.h"
#include "UIKitKeyboardAndroidFrameListener.h"

using namespace facebook;
using namespace reanimated;
using namespace tonlabs::uikit;

struct UIKitKeyboardJsiModule : jni::JavaClass<UIKitKeyboardJsiModule> {
public:
    __unused static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/keyboard/UIKitKeyboardJSIModulePackage;";

    static void registerNatives() {
        javaClassStatic()->registerNatives({makeNativeMethod("installJSIBindings", UIKitKeyboardJsiModule::installJSIBindings)});
    }

private:
    static void installJSIBindings(jni::alias_ref<jni::JClass>,
                                   jlong jsContext,
                                   jni::alias_ref<facebook::react::CallInvokerHolder::javaobject> jsCallInvokerHolder,
                                   jni::alias_ref<UIKitKeyboardAndroidFrameListener::javaobject> javaKeyboardFrameListener) {
        jsi::Runtime *runtime = reinterpret_cast<facebook::jsi::Runtime *>(jsContext);

        std::shared_ptr<facebook::react::CallInvoker> jsCallInvoker =
            jsCallInvokerHolder->cthis()->getCallInvoker();

        jsi::Object reanimatedModuleProxy = runtime->global().getPropertyAsObject(*runtime, "__reanimatedModuleProxy");
        std::shared_ptr<reanimated::NativeReanimatedModule> reanimatedModule = 
            std::static_pointer_cast<NativeReanimatedModule>(reanimatedModuleProxy.getHostObject(*runtime));

        auto keyboardFrameListener =
            std::make_unique<UIKitKeyboardFrameListener>(jni::make_global(javaKeyboardFrameListener));

        auto keyboardModule = std::make_shared<UIKitKeyboardModule>(jsCallInvoker,
                                                                    *runtime,
                                                                    reanimatedModule,
                                                                    std::move(keyboardFrameListener));

        runtime->global().setProperty(
            *runtime, 
            jsi::PropNameID::forAscii(*runtime, "__uikitKeyboard"),
            jsi::Object::createFromHostObject(*runtime, std::move(keyboardModule)));
    }
};

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
    return jni::initialize(vm, [] { 
        UIKitKeyboardJsiModule::registerNatives();
        UIKitKeyboardAndroidFrameListener::registerNatives();
    });
}