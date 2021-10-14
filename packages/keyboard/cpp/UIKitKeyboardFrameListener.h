//
//  UIKitKeyboardFrameListener.h
//  uikit.keyboard
//
//  Created by Aleksei Savelev on 20/10/2021
//

#pragma once

#include <functional>

#ifdef __ANDROID__

#include <fbjni/fbjni.h>
#include "UIKitKeyboardAndroidFrameListener.h"

#elif __APPLE__

#ifdef __OBJC__ // when compiled as Objective-C++
#import "UIKitKeyboardIosFrameListener.h"
#else // when compiled as C++
typedef struct objc_object UIKitKeyboardIosFrameListener;
#endif // __OBJC__

#endif // __APPLE__

namespace tonlabs {
namespace uikit {

#ifdef __ANDROID__
using namespace facebook;
#endif

typedef std::function<void(double)> KeyboardFrameListener;

class UIKitKeyboardFrameListener {
public:
    void addFrameListener(int uid, KeyboardFrameListener listener);
    void removeFrameListener(int uid);

#ifdef __ANDROID__
    UIKitKeyboardFrameListener(jni::global_ref<UIKitKeyboardAndroidFrameListener::javaobject> javaKeyboardFrameListener) : _javaKeyboardFrameListener(javaKeyboardFrameListener) {};
#elif __APPLE__
    UIKitKeyboardFrameListener(UIKitKeyboardIosFrameListener *iosKeyboardFrameListener) : _iosKeyboardFrameListener(iosKeyboardFrameListener) {};
#endif

private:
#ifdef __ANDROID__
    jni::global_ref<UIKitKeyboardAndroidFrameListener::javaobject> _javaKeyboardFrameListener;
#elif __APPLE__
    UIKitKeyboardIosFrameListener *_iosKeyboardFrameListener;
#endif
};

}
}
