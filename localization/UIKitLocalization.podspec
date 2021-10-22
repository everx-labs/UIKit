require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "UIKitLocalization"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/tonlabs/UIKit/localization#readme"
  s.license      = "Apache-2.0"
  s.author       = { "author" => "tonlabs.io" }
  s.platforms    = { :ios => "9.0", :tvos => "11.0" }
  s.source       = { :git => "https://github.com/tonlabs/UIKit.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React-Core"
end