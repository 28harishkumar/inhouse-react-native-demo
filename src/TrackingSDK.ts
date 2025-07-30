import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

const { TrackingSDK } = NativeModules;

export interface TrackingSDKCallback {
  callbackType: string;
  data: string;
}

export interface TrackingSDKInterface {
  initialize(
    projectId: string,
    projectToken: string,
    shortLinkDomain: string,
    serverUrl?: string,
    enableDebugLogging?: boolean,
  ): Promise<string>;

  onAppResume(): Promise<void>;

  trackAppOpen(shortLink?: string): Promise<string>;

  trackSessionStart(shortLink?: string): Promise<string>;

  trackShortLinkClick(shortLink: string, deepLink?: string): Promise<string>;

  getInstallReferrer(): Promise<string>;

  fetchInstallReferrer(): Promise<string>;

  resetFirstInstall(): Promise<void>;
}

class TrackingSDKManager implements TrackingSDKInterface {
  private eventEmitter: NativeEventEmitter;
  private listeners: EmitterSubscription[] = [];

  constructor() {
    this.eventEmitter = new NativeEventEmitter(TrackingSDK);
  }

  initialize(
    projectId: string,
    projectToken: string,
    shortLinkDomain: string,
    serverUrl?: string,
    enableDebugLogging: boolean = false,
  ): Promise<string> {
    return TrackingSDK.initialize(
      projectId,
      projectToken,
      shortLinkDomain,
      serverUrl,
      enableDebugLogging,
    );
  }

  onAppResume(): Promise<void> {
    return TrackingSDK.onAppResume();
  }

  trackAppOpen(shortLink?: string): Promise<string> {
    return TrackingSDK.trackAppOpen(shortLink);
  }

  trackSessionStart(shortLink?: string): Promise<string> {
    return TrackingSDK.trackSessionStart(shortLink);
  }

  trackShortLinkClick(shortLink: string, deepLink?: string): Promise<string> {
    return TrackingSDK.trackShortLinkClick(shortLink, deepLink);
  }

  getInstallReferrer(): Promise<string> {
    return TrackingSDK.getInstallReferrer();
  }

  fetchInstallReferrer(): Promise<string> {
    return TrackingSDK.fetchInstallReferrer();
  }

  resetFirstInstall(): Promise<void> {
    return TrackingSDK.resetFirstInstall();
  }

  addCallbackListener(
    callback: (data: TrackingSDKCallback) => void,
  ): EmitterSubscription {
    const subscription = this.eventEmitter.addListener(
      'onSdkCallback',
      callback,
    );
    this.listeners.push(subscription);
    return subscription;
  }

  removeCallbackListener(subscription: EmitterSubscription): void {
    subscription.remove();
    const index = this.listeners.indexOf(subscription);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  removeAllListeners(): void {
    this.listeners.forEach(subscription => subscription.remove());
    this.listeners = [];
  }
}

export default new TrackingSDKManager();
