// This file contains common model which is shared by all providers.
// settings model is present in a separate file.
// This file is responsible for serializing it's data.
// It has no dependency on any other file.
(() => {
  // If this is not present in localStorage or is empty, then no-sign-in. Otherwise:
  // "microsoft" - for MS sign-in.
  // "google" - for Google sign-in.
  // "facebook" - for Facebook sign-in.
  const signInProviderString = "sign_in_type";
  const microsoftString = "microsoft";
  const googleString = "google";
  const facebookString = "facebook";

  let signedInWithMS = false;
  let signedInWithGoogle = false;
  let signedInWithFacebook = false;

  // Array of handlers which get called back.
  let eventHandlers = [];

  const hasProviderSignIn = providerName => {
      return window.localStorage.getItem(signInProviderString) === providerName;
  }

  const hasMicrosoftSignIn = () => {
      return signedInWithMS || hasProviderSignIn(microsoftString);
  }

  const hasGoogleSignIn = () => {
      return signedInWithGoogle || hasProviderSignIn(googleString);
  }

  const hasFacebookSignIn = () => {
      return signedInWithFacebook || hasProviderSignIn(facebookString);
  }

  const hasSignIn = () => {
    return hasMicrosoftSignIn() || hasGoogleSignIn() || hasFacebookSignIn();
  }

  const hasInMemorySignIn = () => {
    return signedInWithMS || signedInWithGoogle || signedInWithFacebook;
  }

  const saveSignOutInfo = providerName => {
      let storage = window.localStorage;
      const currentSignInProviderName = storage.getItem(signInProviderString);
      if (currentSignInProviderName === providerName) {
          storage.removeItem(signInProviderString);
      } else {
          console.log(`saveSignOutInfo: ${providerName} failed, existing value: ${currentSignInProviderName}`);
      }
  }

  const saveSignInInfo = providerName => {
      let storage = window.localStorage;
      const currentSignInProviderName = storage.getItem(signInProviderString);
      if (!currentSignInProviderName || currentSignInProviderName === '') {
          storage.setItem(signInProviderString, providerName);
      } else {
          console.log(`saveSignInInfo: ${providerName} failed, existing value: ${currentSignInProviderName}`);
      }
  }

  const removeMicrosoftSignIn = () => {
      saveSignOutInfo(microsoftString);
  }

  const addMicrosoftSignIn = () => {
      saveSignInInfo(microsoftString);
  }

  const removeGoogleSignIn = () => {
      saveSignOutInfo(googleString);
  }

  const addGoogleSignIn = () => {
      saveSignInInfo(googleString);
  }

  const removeFacebookSignIn = () => {
      saveSignOutInfo(facebookString);
  }

  const addFacebookSignIn = () => {
      saveSignInInfo(facebookString);
  }

  const setSignInStatusWithMicrosoft = value => {
      signedInWithMS = value;
      if (!value) {
          removeMicrosoftSignIn();
      } else {
          addMicrosoftSignIn();
      }
  }

  const setSignInStatusWithGoogle = value => {
      signedInWithGoogle = value;
      if (!value) {
          removeGoogleSignIn();
      } else {
          addGoogleSignIn();
      }
  }

  const setSignInStatusWithFacebook = value  => {
      signedInWithFacebook = value;
      if (!value) {
          removeFacebookSignIn();
      } else {
          addFacebookSignIn();
      }
  }

  const addEventHandler = handler => {
    eventHandlers.push(handler);
  }

  const raiseEvent = (name, eventData) => {
    for (const handler of eventHandlers) {
      const handled = handler(name, eventData);
      if (handled)
        break;
    }
  }

  const signOut = () => {
    if (!hasSignIn()) {
      console.log("signOut: No existing sign-in, exiting");
      return;
    }
    if (hasMicrosoftSignIn()) {
      setSignInStatusWithMicrosoft(false);
    } else if (hasGoogleSignIn()) {
      setSignInStatusWithGoogle(false);
    } else if (hasFacebookSignIn()) {
      setSignInStatusWithFacebook(false);
    }
    raiseEvent('signed-out', null);
  }

  const isAccountInfoValid = accountInfo => {
    if (!accountInfo)
      return false;
    const providerName = accountInfo.providerName;
    if (providerName !== 'Microsoft' && providerName !== 'Google' && providerName !== 'Facebook')
        return false;
    if (!accountInfo.email && !accountInfo.fullName && !accountInfo.phone)
        return false;
    return true;
  }

  const signIn = accountInfo => {
    if (hasInMemorySignIn()) {
      console.log("Sign-in already exists - Exiting");
      return;
    }
    if (!isAccountInfoValid(accountInfo)) {
      console.log("Invalid account info: ", accountInfo);
      return;
    }
    const providerName = accountInfo.providerName;
    if (providerName === 'Microsoft') {
      addMicrosoftSignIn();
    } else if (providerName === 'Google') {
      addGoogleSignIn();
    } else if (providerName === "Facebook") {
      addFacebookSignIn();
    }
    raiseEvent('signed-in', accountInfo);
  }

  window.commonModel = {
    eventNames: {
      signInStart: 'sign-in-start',
      signOutStart: 'sign-out-start',
      signedIn: 'signed-in',
      signedOut: 'signed-out',
    },
    hasMicrosoftSignIn: hasMicrosoftSignIn,
    hasGoogleSignIn: hasGoogleSignIn,
    hasFacebookSignIn: hasFacebookSignIn,
    hasSignIn: hasSignIn,

    // Argument format:
    // accountInfo = {
    //     providerName: 'Microsoft' | 'Google' | "Facebook",
    //     fullName: 'Full name',
    //     email: 'email',
    //     phone: 'phone number', // optional
    //     photoUrl: 'photo url string', // optional
    //     // Array of element
    //     otherProperties: [{
    //         displayName: 'property display name',
    //         value: 'property value'
    //     }],
    // }
    signIn: signIn,
    signOut: signOut,

    // Events fired will be like following:
    // name: Check `eventNames` above.
    // eventData: May or may not be present.
    // If any event handler returns true, then further processing of event will stop.
    addEventHandler: addEventHandler,

    raiseEvent: raiseEvent,
  };
})();