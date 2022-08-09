// Depends on settingsModel, commonModel, commonUI.
(function() {
    class GoogleUserInfo {
        static googleLocalStorageIdTokenString = "google_id_token";
        constructor() {
            this.clearMemberData();
            this.readCurrentData();
        }
        clearMemberData() {
            this.email = '';
            this.fullName = '';
            this.imageUrl = '';
            this.idToken = '';
            this.accountId = '';
            this.idTokenDecoded = '';
        }
        signOut() {
            this.clearMemberData();
            this.storeCurrentData();
        }
        isSignedIn() {
            return this.email !== '' && this.fullName !== '' && this.idToken !== '';
        }
        // Can throw.
        populateUsingIdToken(idToken) {
            this.idTokenDecoded = jwt_decode(idToken);
            this.idToken = idToken;
            this.email = this.idTokenDecoded.email;
            this.fullName = this.idTokenDecoded.name;
            this.imageUrl = this.idTokenDecoded.picture;
            this.accountId = this.idTokenDecoded.sub || '';
        }
        setIdToken(idToken) {
            if (!idToken) {
                this.signOut();
                return;
            }
            try {
                this.populateUsingIdToken(idToken);
                this.storeCurrentData();
            } catch (e) {
                console.log("Got error parsing idToken");
                this.signOut();
            }
        }
        storeCurrentData() {
            let storage = window.localStorage;
            if (!this.isSignedIn()) {
                storage.removeItem(GoogleUserInfo.googleLocalStorageIdTokenString);
                return;
            }
            storage.setItem(GoogleUserInfo.googleLocalStorageIdTokenString, this.idToken);
        }
        readCurrentData() {
            let storage = window.localStorage;
            const idToken = storage.getItem(GoogleUserInfo.googleLocalStorageIdTokenString);
            if (!idToken)
                return;
            try {
                this.populateUsingIdToken(idToken);
            } catch (e) {
                console.log("Error from reading idToken");
            }
        }
    };
    const googleUserInfo = new GoogleUserInfo();
    const getElemById = (name) => {
        return document.getElementById(name);
    }
    const getGoogleSignInElem = () => {
        return getElemById('google_signin_button');
    }
    const updateGoogleCard = (possibleSignOut) => {
        if (googleUserInfo.isSignedIn()) {
            const accountInfo = {
                providerName: 'Google',
                fullName: googleUserInfo.fullName,
                email: googleUserInfo.email,
                photoUrl: googleUserInfo.imageUrl,
                otherProperties: [{
                    displayName: 'Google Id',
                    value: googleUserInfo.accountId,
                }]
            };
            commonModel.signIn(accountInfo);
        } else if (possibleSignOut) {
            commonModel.signOut();
        }
    }
    const updateGoogleButtons = (isStartUp) => {
        if (googleUserInfo.isSignedIn()) {
            commonUI.makeInvisible(getGoogleSignInElem());
        } else {
            commonUI.makeVisible(getGoogleSignInElem());
        }
        updateGoogleCard(!isStartUp);
    }
    const handleCredentialResponse = (response) => {
        console.log("In handleCredentialResponse, response: ", response);
        googleUserInfo.setIdToken(response.credential);
        updateGoogleButtons();
    };

    const handleGoogleSignOut = () => {
        console.log("In handleGoogleSignOut");
        const googleSettingState = window.settingUIModel.googleSettings.getCurrentState();
        if (googleSettingState.revokeGrantOnSignOutOn) {
            google.accounts.id.revoke(googleUserInfo.email, done => {
                console.log('Google consent revoked returned: ', done);
              });
        }
        googleUserInfo.signOut();
        updateGoogleButtons();
    }

    const showPrompt = () => {
        google.accounts.id.prompt((notification) => {
            console.log("PROMPT CALLBACK: getMomentType(): ", notification.getMomentType());
            if (notification.isDisplayMoment()) {
                console.log(`PROMPT CALLBACK: DisplayMoment: isDisplayed: ${notification.isDisplayed()}, isNotDisplayed: ${notification.isNotDisplayed()}`);
                if (notification.isNotDisplayed()) {
                    console.log(`PROMPT CALLBACK: DisplayMoment: getNotDisplayedReason: ${notification.getNotDisplayedReason()}`);
                }
            } else if (notification.isSkippedMoment()) {
                console.log(`PROMPT CALLBACK: SkippedMoment: getSkippedReason: ${notification.getSkippedReason()}`);
            } else if (notification.isDismissedMoment()) {
                console.log(`PROMPT CALLBACK: DismissedMoment: getDismissedReason: ${notification.getDismissedReason()}`);
            }
        });
    }

    const onUISignInButtonClick = () => {
        const uiModel = window.settingUIModel.googleSettings;
        const currentState = uiModel.getCurrentState();
        if (currentState.oneTapSignInOn) {
            showPrompt();
        }
    }

    const commonEventHandler = (name, eventData) => {
        if (name === commonModel.eventNames.signInStart) {
            onUISignInButtonClick();
            return false; // Let other handlers continue.
        } 
        if (name === commonModel.eventNames.signOutStart) {
            if (commonModel.hasGoogleSignIn()) {
                handleGoogleSignOut();
                return true; // Handled.
            }
        } else if (name === commonModel.eventNames.signedIn) {
            google.accounts.id.cancel();
        }
        return false;
    }

    window.addEventListener('load', (event) => {
        const googleOptionsState = window.settingUIModel.googleSettings.getCurrentState();
        google.accounts.id.initialize({
            client_id: config.googleClientId,
            callback: handleCredentialResponse,
            auto_select: !!googleOptionsState.automaticSignInOn
          });
        const googleBtnStyle = window.settingUIModel.googleSettings.getCurrentState().googleBtnStyle;
        google.accounts.id.renderButton(
            document.getElementById('google-button-holder'), googleBtnStyle
        );

        window.settingUIModel.addEventHandler((name, eventData) => {
            if (name === window.settingUIModel.eventNames.googleSettingsChanged) {
                google.accounts.id.renderButton(
                    document.getElementById('google-button-holder'), eventData
                );
                return true;
            }
            return false;
        });
    });

    updateGoogleButtons(true);
    commonModel.addEventHandler(commonEventHandler);
    window.handleGoogleCredentialResponse = handleCredentialResponse;
})();
