// This file has no dependency on any other file.
(function() {
  const googleSettingOneTapSignIn = "google_one_tap_signin";
  const googleSettingAutomaticSignIn = "google_one_automatic_signin";
  const googleSettingRevokeGrantOnSignOut = "google_revoke_grant_on_signout";
  let eventHandlers = [];

  const googleBtnStyle = {
    getStringFromLocalStorage: function(style, defaultStyle) {
      const val = window.localStorage.getItem(style);
      if (!val)
        return defaultStyle;
      return val;
    },
    get theme() {
      return this.getStringFromLocalStorage('theme', 'outline');
    },
    get text() {
      return this.getStringFromLocalStorage('text', 'signin_with');
    },
    get size() {
      return this.getStringFromLocalStorage('size', 'large');
    },
    get shape() {
      return this.getStringFromLocalStorage('shape', 'pill');
    },
    get type() {
      return this.getStringFromLocalStorage('type', 'standard');
    },
    get logo_alignment() {
      return this.getStringFromLocalStorage('alignment', 'left');
    },
    get width() {
      return parseInt(this.getStringFromLocalStorage('width', '400'));
    }
  };
  const googleSettingsState = {
    oneTapSignInOn: true,
    automaticSignInOn: false,
    revokeGrantOnSignOutOn: false,
    googleBtnStyle: googleBtnStyle,
    getProps: function() {
      return ['oneTapSignInOn', 'automaticSignInOn', 'revokeGrantOnSignOutOn', 'googleBtnStyle'];
    },
    getMappedPropString: function(value) {
      if (googleSettingOneTapSignIn === value)
        return 'oneTapSignInOn';
      if (googleSettingAutomaticSignIn === value)
        return 'automaticSignInOn';
      if (googleSettingRevokeGrantOnSignOut === value)
        return 'revokeGrantOnSignOutOn';
      return '';
    },
    getCurrentState: function() {
      let obj = {};
      this.getProps().forEach((value) => {
        obj[value] = this[value];
      });
      return obj;
    },
    hasStateChanged: function(oldState, newState) {
      return this.getProps().some((value) => {
        return oldState[value] !== newState[value];
      });
    },
    save: function() {
      let storage = window.localStorage;
      storage.setItem(googleSettingOneTapSignIn, this.oneTapSignInOn);
      storage.setItem(googleSettingAutomaticSignIn, this.automaticSignInOn);
      storage.setItem(googleSettingRevokeGrantOnSignOut, this.revokeGrantOnSignOutOn);
    },
    getBoolFromLocalStorage: function(propName, defaultValue) {
      // bools are stored as strings ("true", "false"), hence need conversion.
      let storage = window.localStorage;
      const val = storage.getItem(propName);
      if (!val)
        return defaultValue;
      return val === 'true';
    },
    load: function() {
      const previousState = this.getCurrentState();
      this.oneTapSignInOn = this.getBoolFromLocalStorage(googleSettingOneTapSignIn, this.oneTapSignInOn);
      this.automaticSignInOn = this.getBoolFromLocalStorage(googleSettingAutomaticSignIn, this.automaticSignInOn);
      this.revokeGrantOnSignOutOn = this.getBoolFromLocalStorage(googleSettingRevokeGrantOnSignOut,
        this.revokeGrantOnSignOutOn);
      const newState = this.getCurrentState();
      if (this.hasStateChanged(previousState, newState)) {
        console.log("Google Sign-in state has changed after load");
      }

      raiseEvent('google-settings-changed', googleBtnStyle);
    },
    handlePropUpdate(propName, oldValue, newValue) {
      const propString = this.getMappedPropString(propName);
      if (propString === '') {
        console.log("googleSettingsState.handlePropUpdate: Bad property update: ", propName);
        return;
      }
      if (this[propString] !== newValue) {
        this[propString] = newValue;
        console.log(`Property ${propString} modified: saving`);
        this.save();
      }
    }
  };

  const saveGoogleBtnStyle = (style) => {
    let storage = window.localStorage;
    storage.setItem('theme', style.theme);
    storage.setItem('text', style.text);
    storage.setItem('size', style.size);
    storage.setItem('shape', style.shape);
    storage.setItem('type', style.type);
    storage.setItem('alignment', style.logo_alignment);
    storage.setItem('width', style.width.toString());
    raiseEvent('google-settings-changed', googleBtnStyle);
  };

  const addEventHandler = (handler) => {
    eventHandlers.push(handler);
  }

  const raiseEvent = (name, eventData) => {
    for (const handler of eventHandlers) {
      const handled = handler(name, eventData);
      if (handled)
        break;
    }
  }

  window.addEventListener('load', (event) => {
    googleSettingsState.load();
  });

  window.settingUIModel = {
    eventNames: {
      googleSettingsChanged: 'google-settings-changed',
    },
    googleSettings: {
      oneTapPropName: googleSettingOneTapSignIn,
      autoSignInPropName: googleSettingAutomaticSignIn,
      revokeGrantSignOutPropName: googleSettingRevokeGrantOnSignOut,
      getCurrentState: function() {
        return googleSettingsState.getCurrentState();
      },
      googleBtnStyle: googleBtnStyle,
      saveGoogleBtnStyle: saveGoogleBtnStyle,
      updatePropChange: function(propName, oldValue, newValue) {
        googleSettingsState.handlePropUpdate(propName, oldValue, newValue);
      },
    },
    addEventHandler: addEventHandler,
    raiseEvent: raiseEvent,
  }
}());
