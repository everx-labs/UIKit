//
//  UIKitKeyboardAndroidFrameListener.h
//  uikit.keyboard
//
//  Created by Aleksei Savelev on 20/10/2021
//

#include <fbjni/fbjni.h>

#include "UIKitKeyboardAndroidFrameListener.h"

namespace tonlabs {
namespace uikit {

using namespace facebook;

UIKitKeyboardAndroidFrameListener::UIKitKeyboardAndroidFrameListener(
    jni::alias_ref<UIKitKeyboardAndroidFrameListener::jhybridobject> jThis) 
    : javaPart_(jni::make_global(jThis)) {};

jni::local_ref<UIKitKeyboardAndroidFrameListener::jhybriddata> UIKitKeyboardAndroidFrameListener::initHybrid(jni::alias_ref<jhybridobject> jThis) {
    return makeCxxInstance(jThis);
};

void UIKitKeyboardAndroidFrameListener::registerNatives() {
    javaClassStatic()->registerNatives({
        makeNativeMethod("initHybrid", UIKitKeyboardAndroidFrameListener::initHybrid),
        makeNativeMethod("onBottomChange", UIKitKeyboardAndroidFrameListener::onBottomChange)
    });
};

void UIKitKeyboardAndroidFrameListener::addFrameListener(int uid, Listener listener) {
    _listeners.insert(std::make_pair(uid, listener));
};

void UIKitKeyboardAndroidFrameListener::removeFrameListener(int uid) {
    _listeners.erase(uid);
};

void UIKitKeyboardAndroidFrameListener::onBottomChange(double bottom) {
    for (auto item : _listeners) {
        item.second(bottom);
    }
};

}
}