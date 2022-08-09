(function () {
  // Load EasyAuth service library
  const paramsString = window.location.search;
  const params = new URLSearchParams(paramsString);
  const service = params.get("service");
  let easyAuthUrl = "";
  let filePathName = "/js/ms_auth_client.min.js";
  function updatePathForMinJs() {
    if (params.has("use_non_min_js")) {
      filePathName = "/js/ms_auth_client.js";
    }
  }
  updatePathForMinJs();
  if (!service) {
    easyAuthUrl = "https://edge-auth.microsoft.com";
  } else {
    switch (service) {
      case "local":
        easyAuthUrl = "http://localhost:86";
        break;
      case "ixp":
        let owner = params.get("owner");
        if (owner)
          easyAuthUrl = "https://" + owner + "-ixp-easyauth.edgebrowser.microsoft-testing-falcon.io";
        else
          console.log("Missing IXP service owner");
        break;
      case "testing":
        easyAuthUrl = "https://easyauth.edgebrowser.microsoft-testing-falcon.io";
        break;
      case "staging":
        easyAuthUrl = "https://easyauth.edgebrowser.microsoft-staging-falcon.io";
        break;
      case "prod":
        easyAuthUrl = "https://easyauth.edgebrowser.microsoft-falcon.io";
        break;
      default:
        console.log("Unknown service name");
        break;
    }
  }
  function appendParamsIfPresent(targetUrl, sourceParams, paramName) {
    const paramValue = sourceParams.get(paramName);
    if (paramValue === null)
      return;
    targetUrl.searchParams.append(paramName, paramValue);
  }
  if (easyAuthUrl) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    let jsVersion = '';
    const versionStr = params.get("js_ver");
    if (versionStr)
      jsVersion = '/' + versionStr;
    const jsUrl = new URL(easyAuthUrl + jsVersion + filePathName);
    appendParamsIfPresent(jsUrl, params, 'autoLogEvents');
    appendParamsIfPresent(jsUrl, params, 'logMsalEvents');
    script.src = jsUrl.toString();
    console.log("Loading " + script.src);
    document.body.appendChild(script);
  }

  // Update the login uri.
  const msAuthInitializeDiv = document.getElementById('ms-auth-initialize');
  if (msAuthInitializeDiv)
    msAuthInitializeDiv.dataset.login_uri = './';
})();
