import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'icotPersonal',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      Orientation: 'portrait',
      StatusBarOverlaysWebView: 'false',
      StatusBarBackgroundColor: '#b01c2e',
      StatusBarStyle: 'lightcontent',
      StatusBarDefaultScrollToTop: 'false',
      GradlePluginKotlinEnabled: 'true',
      AndroidXEnabled: 'true',
      AllowNewWindows: 'true',
      AndroidPersistentFileLocation: 'Compatibility'
    }
  }
};

export default config;
