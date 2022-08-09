// Deals with all UX other than Settings.
// It depends on commonModel.
(function() {
    const idProviderButtons = document.getElementById("id-provider-buttons");
    const notSignedInContent = document.getElementById("not-signed-in-content");
    const signInButton = document.getElementById("sign-in");
    const accountMenu = document.getElementById("account-menu");
    const signOutButton = document.getElementById("sign-out");
    const fbSignInButton = document.getElementById("fb-sign-in-button");

    const welcomeDiv = document.getElementById("WelcomeMessage");
    const idProvider = document.getElementById("id-provider");
    const signedInAccountInfoDiv = document.getElementById("signed-in-account-info");

    const profileDiv = document.getElementById("profile-div");
    const photoImg = document.getElementById("photo-img");
    const commonSignedInContent = document.getElementById("common-signed-in-content");

    (() => {
        const demoTextDiv = document.getElementById("demo-text-div");
        demoTextDiv.innerHTML = config.appShortDescription;
        const nameContainer = document.getElementById("app-name-container");
        nameContainer.innerHTML = config.appName;
    })();

    function isString(arg) {
        return (typeof arg === 'string' || arg instanceof String);
    }

    function getElem(elementOrStrId) {
        if (isString(elementOrStrId)) {
            return document.getElementById(elementOrStrId);;
        }
        return elementOrStrId;
    }

    function showElement(elementId) {
        const elem = getElem(elementId);
        if (elem) {
            elem.classList.remove("d-none");
        }
    }

    function hideElement(elementId) {
        const elem = getElem(elementId);
        if (elem) {
            elem.classList.add("d-none");
        }
    }

    function makeVisible(elementId) {
        const elem = getElem(elementId);
        if (elem) {
            elem.classList.remove("make-invisible");
        }
    }

    function makeInvisible(elementId) {
        const elem = getElem(elementId);
        if (elem) {
            elem.classList.add("make-invisible");
        }
    }

    function hideNotSignedInContent() {
        makeInvisible(idProviderButtons);
        // fb button requires display:none as its generated content has visibility:visible
        hideElement(fbSignInButton);
        hideElement(notSignedInContent);
    }

    function showNotSignedInContent() {
        showElement(notSignedInContent);
    }

    function showIdProviderButtons() {
        makeVisible(idProviderButtons);
        // fb button requires display:none as its generated content has visibility:visible
        showElement(fbSignInButton);
    }

    function hideSignInProviderButtons() {
        makeInvisible(idProviderButtons);
        // fb button requires display:none as its generated content has visibility:visible
        hideElement(fbSignInButton);
    }

    function showSignInButton() {
        if (signInButton && signInButton.matches("button")) {
            makeVisible("sign-in");
            signInButton.setAttribute('class', "btn btn-light btn-outline-success my-2 my-sm-0");
            signInButton.innerHTML = "Sign In";
        }
        else { // zillow demo
            makeInvisible("account-menu");
            makeVisible("sign-in");
        }
    }

    function showSignOutButton() {
        if (signInButton && signInButton.matches("button")) {
            signInButton.setAttribute('class', "btn btn-success");
            signInButton.innerHTML = "Sign Out";
        }
        else { // zillow demo
            makeInvisible("sign-in");
            makeVisible("account-menu");
        }
    }

    function showAlert(message) {
        document.getElementById("alert_container").innerHTML =
        `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
            <div id="alert_message_div">${message}</div>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>`;
    }

    function handleSignInSignOutButtonClick(e) {
        e.preventDefault();
        if (commonModel.hasSignIn()) {
            commonModel.raiseEvent(commonModel.eventNames.signOutStart, null);
        } else {
            showIdProviderButtons();
            commonModel.raiseEvent(commonModel.eventNames.signInStart, null);
        }
    }

    if (signInButton)
        signInButton.addEventListener("click", handleSignInSignOutButtonClick);
    if (signOutButton)
        signOutButton.addEventListener("click", handleSignInSignOutButtonClick);
    if (accountMenu)
        accountMenu.addEventListener("click", toggleAccountMenu, false );

    function toggleAccountMenu() {
      document.getElementById("page-header-dropdown-popover").classList.toggle("make-invisible");
    }

    function clearSignedInAccountUI() {
        signedInAccountInfoDiv.innerHTML = '';
        photoImg.src = '#';
        profileDiv.innerHTML = '';
        commonUI.hideElement(signedInAccountInfoDiv);
        commonUI.hideElement(commonSignedInContent);
        if (accountMenu)
            accountMenu.click();
    }

    function createStrongElement(name, value) {
        const pElem = document.createElement('div');
        pElem.innerHTML = `<strong>${name}: </strong> ${value}`;
        return pElem;
    }

    function createStrongInParagraph(name, value) {
        const pElem = document.createElement('p');
        pElem.innerHTML = `<strong>${name}: </strong> ${value}`;
        return pElem;
    }

    function updateProfilePhoto(url) {
        if (url) {
            commonUI.showElement(photoImg);
            photoImg.src = url;
            if (accountMenu)
                accountMenu.src = url;
        }
    }

    // props: [{
    //  displayName: 'property display name',
    //  value: 'property value'
    // }],
    function updateSignInAdditionalSigninProps(props = []) {
        if (!Array.isArray(props)) 
            return;
        for (const prop of props) {
            if (prop.displayName !== '') {
                const elem = createStrongElement(prop.displayName, prop.value || '');
                signedInAccountInfoDiv.appendChild(elem);
            }
        }
    }

    // Check commonModel signIn to understand details about accountInfo format.
    function showSignInContent(accountInfo) {
        const fullName = accountInfo.fullName || accountInfo.email || accountInfo.phone;
        welcomeDiv.innerHTML = `Welcome ${fullName}`;
        idProvider.innerHTML = accountInfo.providerName;
        let email = accountInfo.email || '';
        const emailElem = createStrongInParagraph('Email', email);
        profileDiv.appendChild(emailElem);

        updateProfilePhoto(accountInfo.photoUrl);

        signedInAccountInfoDiv.innerHTML = '';
        updateSignInAdditionalSigninProps(accountInfo.otherProperties);
        showElement(signedInAccountInfoDiv);
        showElement(commonSignedInContent);
        hideNotSignedInContent();
        showSignOutButton();
    }

    function updatePhoneNumber(phone) {
        const elem = createStrongInParagraph('Phone', phone);
        profileDiv.appendChild(elem);
    }

    function updateMicrosoftCid(cid) {
        updateSignInAdditionalSigninProps([{
            displayName: 'cid',
            value: cid
        }]);
    }

    function updateContentForSignOut() {
        showNotSignedInContent();
        showSignInButton();
        clearSignedInAccountUI();
    }

    const commonEventHandler = (name, eventData) => {
        if (name === commonModel.eventNames.signedIn) {
            showSignInContent(eventData);
        } else if (name === commonModel.eventNames.signedOut) {
            updateContentForSignOut();
            return true; // Handled.
        }
        return false;
    }

    commonModel.addEventHandler(commonEventHandler);

    window.commonUI = {
        showElement: showElement,
        hideElement: hideElement,

        getElem: getElem,

        // Special functions which set and remove visibility:hidden instead of display:none.
        // Google library needs its divs to not have display: none, else they throw exception.
        // So this approach provides workaround.
        makeInvisible: makeInvisible,
        makeVisible: makeVisible,

        showAlert: showAlert,
        hideSignInProviderButtons: hideSignInProviderButtons,

        // Needed currently for Microsoft updates.
        updateProfilePhoto: updateProfilePhoto,
        updatePhoneNumber: updatePhoneNumber,
        updateMicrosoftCid: updateMicrosoftCid,

        // Only add functions here that directly deal with common UI and UI utilities.
        // For other functions try updating commonModel and let that fire events.
    };
}());