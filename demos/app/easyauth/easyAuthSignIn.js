(function () {
  class MicrosoftUserInfo {
    constructor() {
      this.clearMemberData();
    }
    clearMemberData() {
      this.accountInfo = {};
    }
    signOut() {
      this.clearMemberData();
    }
    isSignedIn() {
      return this.accountInfo.username && this.accountInfo.fullName;
    }
    setAccountInfo(accountInfo) {
      this.accountInfo = accountInfo;
    }
  };
  const microsoftUserInfo = new MicrosoftUserInfo();
  const getElemById = (name) => {
    return document.getElementById(name);
  }
  const getEasyAuthSignInElem = () => {
    return getElemById('microsoft_signin_button_id');
  }
  const updateMicrosoftCard = (isStartUp) => {
    if (microsoftUserInfo.isSignedIn()) {
      const msAccountInfo = microsoftUserInfo.accountInfo;
      const accountInfo = {
        providerName: 'Microsoft',
        fullName: msAccountInfo.fullName,
        email: msAccountInfo.username,
        photoUrl: msAccountInfo.photoUrl,
        otherProperties: [{ displayName: 'cid', value: msAccountInfo.id }]
      };
      commonModel.signIn(accountInfo);
    } else if (!isStartUp) {
      // During startup, this function can get called very early before we know
      // the state, so we don't want to sign-out.
      commonModel.signOut();
    }
  }
  const updateEasyAuthButtons = (isStartUp = false) => {
    if (microsoftUserInfo.isSignedIn()) {
      commonUI.makeInvisible(getEasyAuthSignInElem());
      commonUI.showElement('microsoft-testing');
    } else {
      commonUI.makeVisible(getEasyAuthSignInElem());
      commonUI.hideElement('microsoft-testing');
    }
    updateMicrosoftCard(isStartUp);
  }
  const handleMicrosoftSignInResponse = (response) => {
    console.log("In handleMicrosoftSignInResponse, response: ", response);
    microsoftUserInfo.setAccountInfo(response);
    updateEasyAuthButtons();
  };

  const handleMicrosoftSignOut = () => {
    console.log("In handleMicrosoftSignOut");
    if (!window.ms || !window.ms.auth) {
      console.log("ms.auth not found: Returning");
      return;
    }
    ms.auth.signOut(microsoftUserInfo.accountInfo.username, data => {
      if (data.result === 'success') {
        console.log("Signed out successfully");
      } else if (data.error) {
        console.log("Sign out failed, error: ", data.error);
      }
      microsoftUserInfo.signOut();
      updateEasyAuthButtons();  
    });
  }

  const promptCallback = (promptNotification) => {
    console.log("In promptCallback: ", promptNotification);
  }

  const onUISignInButtonClick = () => {
    if (window.ms && window.ms.auth) {
      window.ms.auth.prompt('LEFT', promptCallback);
    }
  }

  const handleTokenFetchResponse = (scenarioName, response) => {
    let str = '';
    if (response && response.accessToken && Array.isArray(response.scopes) && response.scopes.length > 0) {
      str = `Scenario ${scenarioName} succeeded: with token: ${response.accessToken} for scopes: ${response.scopes.toString()}`;
    } else {
      str = `Scenario ${scenarioName} Failed`;
    }
    window.alert(str);
  }

  const getBoundedTokenResponse = (scenarioName) => {
    return function(response) {
      handleTokenFetchResponse(scenarioName, response);
    }
  }

  const onSilentTokenFetch = () => {
    const request = {
      scopes: ["User.Read"],
      account: ms.auth.getMSALAccount(microsoftUserInfo.accountInfo.username),
    };
    if (!request.account) {
      window.alert("Silent token fetch failed: Account not found");
      return;
    }
    const responseHandler = getBoundedTokenResponse('silentTokenFetch');
    ms.auth.acquireTokenSilent(request).then(responseHandler).catch(err => {
      window.alert("Silent Token fetch failed with error");
    });
  }

  const onPopupTokenFetch = () => {
    const request = {
      scopes: ["Mail.Read"],
      loginHint: microsoftUserInfo.accountInfo.username,
    };
    if (!request.loginHint) {
      window.alert("Popup token fetch failed: No login hint");
      return;
    }
    const silentResponseHandler = getBoundedTokenResponse('silentTokenFetch');
    ms.auth.acquireTokenSilent(request).then(silentResponseHandler).catch(err => {
      if (err instanceof ms.auth.InteractionRequiredAuthError) {
        console.log('Silent token fetch return user interaction error, trying with popup');
        const popupResponseHandler = getBoundedTokenResponse('popupTokenFetch');
        ms.auth.acquireTokenPopup(request).then(popupResponseHandler).catch(err => {
          window.alert("Popup Token fetch failed with error");
        });
      }
    });
  }

  const registerMicrosoftTestingEventHandlers = () => {
    const silentTokenButton = commonUI.getElem('microsoft-silent-token-id');
    if (silentTokenButton) {
      silentTokenButton.addEventListener('click', onSilentTokenFetch);
    }
    const popupTokenButton = commonUI.getElem('microsoft-popup-token-id');
    if (popupTokenButton) {
      popupTokenButton.addEventListener('click', onPopupTokenFetch);
    }
  }

  const unRegisterMicrosoftTestingEventHandlers = () => {
    const silentTokenButton = commonUI.getElem('microsoft-silent-token-id');
    if (silentTokenButton) {
      silentTokenButton.removeEventListener('click', onSilentTokenFetch);
    }
    const popupTokenButton = commonUI.getElem('microsoft-popup-token-id');
    if (popupTokenButton) {
      popupTokenButton.removeEventListener('click', onPopupTokenFetch);
    }
  }

  const commonEventHandler = (name, eventData) => {
    if (name === commonModel.eventNames.signInStart) {
      onUISignInButtonClick();
      return false; // Let other handlers continue.
    }
    if (name === commonModel.eventNames.signOutStart) {
      if (commonModel.hasMicrosoftSignIn()) {
        handleMicrosoftSignOut();
        unRegisterMicrosoftTestingEventHandlers();
        return true; // Handled.
      }
    }
    else if (name === commonModel.eventNames.signedIn) {
      registerMicrosoftTestingEventHandlers();
      ms.auth.cancel();
    }
    return false;
  }

  const handleSignInStateOnPageLoad = () => {
    if (commonModel.hasMicrosoftSignIn()) {
      ms.auth.startGetCurrentAccount(function (accountInfo) {
        if (!accountInfo) {
          commonModel.signOut();
        } else {
          microsoftUserInfo.setAccountInfo(accountInfo);
          updateEasyAuthButtons();
        }
      });
    }
  }

  const attachEventHandlers = () => {
    const signInButton = document.getElementById("ms-auth-button-holder");

    const applyCurrentValue = (elemId, prop) => {
      const elem = document.getElementById(elemId);
      if (signInButton.dataset[prop]) {
         elem.value = signInButton.dataset[prop];
      }
      return elem;
    }

    const theme = applyCurrentValue('ms-button-theme', 'theme');
    const size = applyCurrentValue('ms-button-size', 'size');
    const text = applyCurrentValue('ms-button-text', 'text');
    const shape = applyCurrentValue('ms-button-shape', 'shape');
    const type = applyCurrentValue('ms-button-type', 'type');
    const logoAlignment = applyCurrentValue('ms-button-logo-alignment', 'logo_alignment');
    const width = applyCurrentValue('ms-button-width', 'width');
    const height = applyCurrentValue('ms-button-height', 'height');

    if (theme && size && text && shape && type && logoAlignment && width && height) {
      [theme, size, text, shape, type, logoAlignment, width, height].forEach((elem) => {
        elem.onchange = () => {
          const buttonConfig = {
            theme: theme.value, size: size.value, text: text.value,
            shape: shape.value, type: type.value, logo_alignment: logoAlignment.value,
            width: parseInt(width.value), height: parseInt(height.value)
          };
          ms.auth.renderSignInButton(signInButton, buttonConfig);
        };
      });
    }
  }

  window.addEventListener('load', (event) => {
    // We can later consider exposing this as option in Settings and using on later sessions.
    const useRuntimeInitialize = false;
    if (window.ms && window.ms.auth) {
      if (useRuntimeInitialize) {
        ms.auth.initialize({
          client_id: 'da83df46-4cf9-4b9c-8df7-ad10bbea9793',
          callback: handleMicrosoftSignInResponse,
        });
      }
      updateEasyAuthButtons(true);
      commonModel.addEventHandler(commonEventHandler);
      handleSignInStateOnPageLoad();
      if (useRuntimeInitialize) {
        ms.auth.renderSignInButton(document.getElementById('ms-auth-button-holder'), {});
      }
      const userSignInButton = document.getElementById('ms-auth-user-sign-in-button');
      if (userSignInButton) {
        userSignInButton.addEventListener('click', function() {
          ms.auth.startSignIn();
        })
      }
      attachEventHandlers();
    }
  });

  window.handleMicrosoftSignInResponse = handleMicrosoftSignInResponse;
})();