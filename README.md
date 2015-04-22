# appcord

cordova create cordova com.example.club Club
cordova platform add ios
cordova platform add android

cordova build ios
[
cordova prepare ios
cordova compile ios
]


一、安装插件：
1、com.telerik.plugins.nativepagetransitions
cordova plugin add https://github.com/Telerik-Verified-Plugins/NativePageTransitions.git



二、修改webView是要被禁止滚动和回弹的UIWebView：

修改文件：platforms/ios/CordovaLib/Classes/CDVViewController.m

代码如下：
for (id subview in self.webView.subviews){

    if ([[subview class] isSubclassOfClass: [UIScrollView class]])

        ((UIScrollView *)subview).bounces = NO;

}


三、IOS7 隐藏状态栏 (电池栏)

修改文件：platforms/ios/Club/Club-Info.plist

方法如下：

首先设置key：Status bar is initially hidden    为YES

然后设置key：View controller-based status bar appearance  为NO



四、For a simple test, you can add the following to the didFinishLaunchingWithOptions method of the AppDelegate.m, after the MainViewController is initialized:


platforms/ios/Club/Classes/AppDelegate.m

self.viewController.baseUserAgent = @"My Custom User Agent";

platforms/android/CordovaLib/src/org/apache/cordova/CordovaActivity.java

----------------------
        String userAgent = appView.getSettings().getUserAgentString();
        // can append or redefine here
        userAgent += " AppUeWirelessAndroid";

        appView.getSettings().setUserAgentString(userAgent);

        appView.loadUrlIntoView(url, true);
