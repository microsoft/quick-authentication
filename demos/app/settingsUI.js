// Depends on settingsModel.
(function() {
  const googleSettings = {
    oneTapCheckBox: null,
    autoSignInCheckBox: null,
    revokeGrantSignOutCheckBox: null,
    attachEventHandlers: function() {
      this.oneTapCheckBox = document.getElementById('google-one-tap-prompt');
      this.oneTapCheckBox.addEventListener(
        'change', () => this.handleOneTapSignInCheckBox());
      this.autoSignInCheckBox = document.getElementById('google-auto-sign-in');
      this.autoSignInCheckBox.addEventListener(
        'change', () => this.handleAutomaticSignInCheckBox());
      this.revokeGrantSignOutCheckBox = document.getElementById('google-revoke-on-sign-out');
      this.revokeGrantSignOutCheckBox.addEventListener(
        'change', () => this.handleRevokeGrantOnSignOutCheckBox());
      const theme = document.getElementById('theme');
      const size = document.getElementById('size');
      const text = document.getElementById('text');
      const shape = document.getElementById('shape');
      const type = document.getElementById('type');
      const alignment = document.getElementById('alignment');
      const width = document.getElementById('width');
      if (theme && size && text && shape && type && alignment && width) {
        [theme, size, text, shape, type, alignment, width].forEach((select) => {
          select.onchange = () => {
            const style = {
              theme: theme.value, size: size.value, text: text.value,
              shape: shape.value, type: type.value, logo_alignment: alignment.value, width: width.value
            };
            window.settingUIModel.googleSettings.saveGoogleBtnStyle(style);
          }
        });
      }
    },
    handleOneTapSignInCheckBox: function() {
      console.log("In handleOneTapSignInCheckBox");
      const checked = this.oneTapCheckBox.checked;
      let uiModel = window.settingUIModel.googleSettings;
      uiModel.updatePropChange(uiModel.oneTapPropName, !checked, checked);
      this.autoSignInCheckBox.disabled = !checked;
      if (!checked && this.autoSignInCheckBox.checked) {
        this.autoSignInCheckBox.checked = false;
        this.handleAutomaticSignInCheckBox();
      }
    },
    handleAutomaticSignInCheckBox: function() {
      console.log("In handleAutomaticSignInCheckBox");
      const checked = this.autoSignInCheckBox.checked;
      let uiModel = window.settingUIModel.googleSettings;
      uiModel.updatePropChange(uiModel.autoSignInPropName, !checked, checked);
      if (checked) {
        window.commonUI.showAlert("Please reload page to see automatic sign-in behavior");
      } else {
        window.commonUI.showAlert("Please reload page to see <strong>NO</strong> automatic sign-in behavior");
      }
    },
    handleRevokeGrantOnSignOutCheckBox: function() {
      console.log("In handleRevokeGrantOnSignOutCheckBox");
      const checked = this.revokeGrantSignOutCheckBox.checked;
      let uiModel = window.settingUIModel.googleSettings;
      uiModel.updatePropChange(uiModel.revokeGrantSignOutPropName, !checked, checked);
    },
    handleBeforeSettingsOpen: function() {
      const uiModel = window.settingUIModel.googleSettings;
      const currentState = uiModel.getCurrentState();
      this.oneTapCheckBox.checked = currentState.oneTapSignInOn;
      this.autoSignInCheckBox.checked = currentState.automaticSignInOn;
      this.autoSignInCheckBox.disabled = !currentState.oneTapSignInOn;
      this.revokeGrantSignOutCheckBox.checked = currentState.revokeGrantOnSignOutOn;
    },
  };

  let settingButtonOpen = false;
  let isListeningToClicks = false;
  const getSettingsPanel = () => {
    return document.getElementById('settings-panel');
  }
  const handleOutsideClick = (event) => {
    const elem = getSettingsPanel();
    if (!elem.contains(event.target)) {
      closeSettings();
    }
  }
  const registerClickListener = () => {
    if (isListeningToClicks)
      return;
    isListeningToClicks = true;
    document.addEventListener('click', handleOutsideClick);
  }
  const unregisterClickListener = () => {
    if (!isListeningToClicks)
      return;
    isListeningToClicks = false;
    document.removeEventListener('click', handleOutsideClick);
  }
  const closeSettings = () => {
    const elem = getSettingsPanel();
    unregisterClickListener();
    elem.classList.remove('settings-panel-open');
    settingButtonOpen = false;
  }
  const openSettings = () => {
    googleSettings.handleBeforeSettingsOpen();
    const elem = getSettingsPanel();
    elem.classList.add('settings-panel-open');
    setTimeout(() => registerClickListener());
    settingButtonOpen = true;
  }
  const handleSettingsButtonClick = () => {
    if (settingButtonOpen) {
      closeSettings();
    } else {
      openSettings();
    }
  }
  window.addEventListener('load', (event) => {
    googleSettings.attachEventHandlers();
    const googleBtnStyle = window.settingUIModel.googleSettings.getCurrentState().googleBtnStyle;
    if (document.getElementById('theme'))
      document.getElementById('theme').value = googleBtnStyle.theme;
    if (document.getElementById('size'))
      document.getElementById('size').value = googleBtnStyle.size;
    if (document.getElementById('text'))
      document.getElementById('text').value = googleBtnStyle.text;
    if (document.getElementById('shape'))
      document.getElementById('shape').value = googleBtnStyle.shape;
    if (document.getElementById('type'))
      document.getElementById('type').value = googleBtnStyle.type;
    if (document.getElementById('alignment'))
      document.getElementById('alignment').value = googleBtnStyle.logo_alignment;
    if (document.getElementById('width'))
      document.getElementById('width').value = googleBtnStyle.width;
  });

  window.settingsUI = window.settingsUI || {
    handleSettingsButtonClick: handleSettingsButtonClick,
    closeSettings: closeSettings
  };
})();
