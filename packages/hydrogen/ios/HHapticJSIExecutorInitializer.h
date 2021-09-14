//
//  HHapticJSIExecutorInitializer.h
//  uikit.hydrogen
//
//  Created by Aleksei Saveliev on 20.08.2021.
//

#import <React/RCTBridge+Private.h>
#import <ReactCommon/RCTTurboModuleManager.h>
#import <jsireact/JSIExecutor.h>

NS_ASSUME_NONNULL_BEGIN

namespace tonlabs {
namespace uikit {
  using namespace facebook::react;

  JSIExecutor::RuntimeInstaller HHapticJSIExecutorRuntimeInstaller(
      RCTBridge *bridge,
      JSIExecutor::RuntimeInstaller runtimeInstallerToWrap);

} // namespace uikit
} // namespace tonlabs

NS_ASSUME_NONNULL_END
