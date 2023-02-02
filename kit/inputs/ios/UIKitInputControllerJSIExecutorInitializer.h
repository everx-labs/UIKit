//
//  UIKitInputControllerJSIExecutorInitializer.h
//  kit.inputs
//
//  Created by Sergeev Anatolii on 01.06.2022.
//

#import <React/RCTBridge+Private.h>
#import <ReactCommon/RCTTurboModuleManager.h>
#import <jsireact/JSIExecutor.h>

NS_ASSUME_NONNULL_BEGIN

namespace tonlabs {
namespace uikit {
  using namespace facebook::react;

  JSIExecutor::RuntimeInstaller UIKitInputControllerJSIExecutorRuntimeInstaller(
      RCTBridge *bridge,
      JSIExecutor::RuntimeInstaller runtimeInstallerToWrap);

} // namespace uikit
} // namespace tonlabs

NS_ASSUME_NONNULL_END
