//
//  UIKitKeyboardFrameListener.h
//  uikit.keyboard
//
//  Created by Aleksei Savelev on 20/10/2021
//

#ifdef __ANDROID__
#include <jni.h>
#include <fbjni/fbjni.h>
#endif

#include "UIKitKeyboardFrameListener.h"

namespace tonlabs {
namespace uikit {

void UIKitKeyboardFrameListener::addFrameListener(int uid, KeyboardFrameListener listener) {
    #ifdef __ANDROID__
        this->_javaKeyboardFrameListener->cthis()->addFrameListener(uid, listener);
    #elif __APPLE__
        [_iosKeyboardFrameListener addFrameListener:[NSNumber numberWithInt:uid] withListener:[=](CGFloat keyboardTopPosition) {
            listener(keyboardTopPosition);
        }];
    #endif
}

void UIKitKeyboardFrameListener::removeFrameListener(int uid) {
    #ifdef __ANDROID__
        this->_javaKeyboardFrameListener->cthis()->removeFrameListener(uid);
    #elif __APPLE__
        [_iosKeyboardFrameListener removeFrameListener:[NSNumber numberWithInt:uid]];
    #endif
}

}
}
