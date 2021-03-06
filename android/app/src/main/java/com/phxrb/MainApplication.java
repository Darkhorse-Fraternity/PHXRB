package com.phxrb;

import android.app.Application;

import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.avos.avoscloud.AVOSCloud;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.phxrb.CWebView.RNWebViewPackage;
import com.theweflex.react.WeChatPackage;

import java.util.Arrays;
import java.util.List;

import cn.reactnative.modules.qq.QQPackage;
import io.liaoyuan.reactnative.leancloudpush.LeanCloudPushPackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new WeChatPackage(),
                    new QQPackage(),
                    new LeanCloudPushPackage(),
                    new ReactNativePushNotificationPackage(),
                    new VectorIconsPackage(),
                    new ImagePickerPackage(),
                    new ReactNativeDialogsPackage(),
                    new RNDeviceInfo(),
                    new RNWebViewPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        // 初始化参数依次为 this, AppId, AppKey
        AVOSCloud.initialize(this, "GBIbrXdg1bSeqzfmWVhYhD4g-gzGzoHsz",
                "btDa8Ixuj8nsvueRwKjxl4x5");
    }
}
