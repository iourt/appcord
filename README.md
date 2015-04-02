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

platforms/ios/CordovaLib/Classes/CDVViewController.m

for (id subview in self.webView.subviews){  //webView是要被禁止滚动和回弹的UIWebView

    if ([[subview class] isSubclassOfClass: [UIScrollView class]])

        ((UIScrollView *)subview).bounces = NO;

}


三、IOS7 隐藏状态栏 (电池栏)

platforms/ios/Club/Club-Info.plist

首先设置key：Status bar is initially hidden    为YES

然后设置key：View controller-based status bar appearance  为NO



