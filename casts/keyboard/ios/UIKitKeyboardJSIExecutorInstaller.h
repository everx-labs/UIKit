//
//  UIKitKeyboardJSIExecutorInstaller.h
//  uikit.keyboard
//
//  Created by Aleksei Saveliev on 12.10.2021.
//

#import <React/RCTBridge+Private.h>
#import <ReactCommon/RCTTurboModuleManager.h>
#import <jsireact/JSIExecutor.h>

NS_ASSUME_NONNULL_BEGIN

namespace tonlabs {
namespace uikit {
  using namespace facebook::react;

  JSIExecutor::RuntimeInstaller UIKitKeyboardJSIExecutorInstaller(
      RCTBridge *bridge,
      JSIExecutor::RuntimeInstaller runtimeInstallerToWrap);

} // namespace uikit
} // namespace tonlabs

NS_ASSUME_NONNULL_END
