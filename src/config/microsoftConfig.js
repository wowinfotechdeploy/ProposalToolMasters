/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";
import { redirectUri } from "../Base-Url/Base_Url";

export const msalConfig = {
  auth: {
    clientId: "aaff9a85-622e-400b-8fb8-8d0843124411",
    authority: "https://login.microsoftonline.com/common",
    //Vercel Api

    redirectUri: redirectUri,
    // redirectUri: "https://proposal-tool.vercel.app",

    //Master Api
    // redirectUri: "https://master.proposal.outbooks.com",

    //Pre-Prod Api
    // redirectUri: "https://preprod.proposal.outbooks.com",

    //Production Api
    // redirectUri: "https://app.proposal.outbooks.com",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me", //e.g. https://graph.microsoft.com/v1.0/me
};
