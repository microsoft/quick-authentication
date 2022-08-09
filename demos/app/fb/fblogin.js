// Depends on settingsModel, commonModel.
(function () {
  function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      getAccountInfo();  
    } else {                                 // Not logged into your webpage or we are unable to tell.
    }
  }

  function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1028572388005941',
      cookie     : true,                     // Enable cookies to allow the server to access the session.
      xfbml      : true,                     // Parse social plugins on this webpage.
      version    : 'v13.0'                   // Use this Graph API version for this call.
    });
    FB.AppEvents.logPageView();
    if (commonModel.hasFacebookSignIn()) {
      checkLoginState();
    }
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     // Uncomment release or debug version of the Facebook SDK:
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     // js.src = "https://connect.facebook.net/en_US/sdk/debug.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  function getAccountInfo() {                // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', {fields: ['name', 'email']}, function(response) {
      console.log('Successful login for: ' + response.name);

      const accountInfo = {
        providerName: 'Facebook',
        fullName: response.name,
        email: response.email,
        photoURL: '',
        otherProperties: [{
            displayName: 'Facebook Id',
            value: response.id,
        }]
      };
      commonModel.signIn(accountInfo);
    });
  }

  function logOut() {
    FB.logout(function(response) {
      commonModel.signOut();
    });
  }

  const commonEventHandler = (name, eventData) => {
    if (name === commonModel.eventNames.signOutStart) {
        if (commonModel.hasFacebookSignIn()) {
          logOut();
          return true; // Handled.
        }
    }
    return false;
  }

  commonModel.addEventHandler(commonEventHandler);

  window.fb = {
    checkLoginState: checkLoginState,
  }
}());
