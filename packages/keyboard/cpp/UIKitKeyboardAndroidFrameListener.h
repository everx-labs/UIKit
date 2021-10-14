//
//  UIKitKeyboardAndroidFrameListener.h
//  uikit.keyboard
//
//  Created by Aleksei Savelev on 20/10/2021
//

#pragma once

#include <unordered_map>
#include <fbjni/fbjni.h>

namespace tonlabs {
namespace uikit {

using namespace facebook;

typedef std::function<void(double)> Listener;

class UIKitKeyboardAndroidFrameListener : public jni::HybridClass<UIKitKeyboardAndroidFrameListener> {
public:
    static constexpr auto kJavaDescriptor = "Ltonlabs/uikit/keyboard/UIKitKeyboardFrameListener;";
    static jni::local_ref<jhybriddata> initHybrid(jni::alias_ref<jhybridobject> jThis);
    static void registerNatives();

    void addFrameListener(int uid, Listener listener);

    void removeFrameListener(int uid);
private:
    friend HybridBase;
    jni::global_ref<UIKitKeyboardAndroidFrameListener::javaobject> javaPart_;
    std::unordered_map<int, Listener> _listeners;

    explicit UIKitKeyboardAndroidFrameListener(
        jni::alias_ref<UIKitKeyboardAndroidFrameListener::jhybridobject> jThis);

    void onBottomChange(double bottom);
};

}
}
