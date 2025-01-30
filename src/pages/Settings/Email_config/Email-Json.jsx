import React from "react";

const emailProviders = [
  {
    epid: 1,
    emailProviderName: "BT Internet",
    smtpServer: "mail.btinternet.com",
    smtpPort: 465,
    ProviderSteps: [
      { Step1: "Go to your browser and log in to your BT Internet account." },
      {
        Step2: "Go to 'My Profile' and the navigate to the 'Security' section.",
      },
      {
        Step3: "Look for the option 'Manager how you sign in' and click on it.",
      },
      {
        Step4:
          "If you have not turned on two steps verification, please enable it now.",
      },
      { Step5: "Scroll down to find the 'App passwords' section." },
      { Step6: "Create a new app password." },
      { Step7: "Copy the generated password and enter it here." },
    ],
  },
  {
    epid: 2,
    emailProviderName: "Gmail",
    smtpServer: "smtp.gmail.com",
    smtpPort: 465,
    ProviderSteps: [
      { Step1: "Go to Your Account." },
      { Step2: "Select 'Manage Your Google Account'." },
      { Step3: "Select 'Security' from the left-hand menu." },
      {
        Step4:
          "Ensure '2-Step Verification' is turned on.If it is off,turn it on.",
      },
      {
        Step5:
          "Once '2-Step Verification' is on, look for the 'App passwords' option in search box.",
      },
      { Step6: "Generate a new app password." },
      { Step7: "Copy the generated password and enter it here." },
    ],
  },
  {
    epid: 3,
    emailProviderName: "Hotmail",
    smtpServer: "smtp.office365.com",
    smtpPort: 587,
    ProviderSteps: [
      { Step1: "Go to your browser and log in to your Hotmail account." },
      {
        Step2: "Go to 'My Profile' and the navigate to the 'Security' section.",
      },
      {
        Step3: "Look for the option 'Manager how you sign in' and click on it.",
      },
      {
        Step4:
          "If you have not turned on two steps verification, please enable it now.",
      },
      { Step5: "Scroll down to find the 'App passwords' section." },
      { Step6: "Create a new app password." },
      { Step7: "Copy the generated password and enter it here." },
    ],
  },
  {
    epid: 4,
    emailProviderName: "Microsoft",
    smtpServer: "smtp.office365.com",
    smtpPort: 587,
    ProviderSteps: [
      { Step1: "Go to your browser and log in to your Microsoft account." },
      {
        Step2: "Go to 'My Profile' and the navigate to the 'Security' section.",
      },
      {
        Step3: "Add a new sign in method and choose App Password as the method to sign in.",
      },
      {
        Step4: "If you have not turned on two steps verification, please enable it now.",
      },
      { Step5: "Create a new app password." },
      { Step6: "Copy the generated password and enter it here." },
    ],
  },
  {
    epid: 5,
    emailProviderName: "Microsoft Exchange Server",
    smtpServer: null,
    smtpPort: null,
    ProviderSteps: [
      {
        Step1:
          "Go to your browser and log in to your Microsoft Exchange Server account.",
      },
      {
        Step2: "Go to 'My Profile' and the navigate to the 'Security' section.",
      },
      {
        Step3: "Look for the option 'Manager how you sign in' and click on it.",
      },
      {
        Step4:
          "If you have not turned on two steps verification, please enable it now.",
      },
      { Step5: "Scroll down to find the 'App passwords' section." },
      { Step6: "Create a new app password." },
      { Step7: "Copy the generated password and enter it here." },
    ],
  },
  {
    epid: 6,
    emailProviderName: "Office 365",
    smtpServer: "smtp.office365.com",
    smtpPort: 587,
    PersonalAccountSteps: [
      { Step1: "Go to your browser and log in to your Office 365 account." },
      {
        Step2: "Go to 'My Profile' and the navigate to the 'Security' section.",
      },
      {
        Step3: "Look for the option 'Manager how you sign in' and click on it.",
      },
      {
        Step4:
          "If you have not turned on two steps verification, please enable it now.",
      },
      { Step5: "Scroll down to find the 'App passwords' section." },
      { Step6: "Create a new app password." },
      { Step7: "Copy the generated password and enter it here." },
    ],
    WorkAccountSteps: [
      { Step1: "Go to your browser and log in to your Office 365 account." },
      {
        Step2:
          "Go to 'View account' and then navigate to the 'Security info' section.",
      },
      {
        Step3:
          "If you have not turned on two-step verification, please enable it now.",
      },
      { Step4: "Find and click on 'Add sign-in method'." },
      { Step5: "Choose 'App password' method and click on 'Next'." },
      {
        Step6:
          "Enter an app name and click on 'Next', you will get an app password.",
      },
      { Step7: "Copy the generated password and enter it here." },
    ],
  },
  {
    epid: 7,
    emailProviderName: "Yahoo",
    smtpServer: "smtp.mail.yahoo.com",
    smtpPort: 465,
    ProviderSteps: [
      { Step1: "Go to your browser and log in to your Yahoo account." },
      {
        Step2: "Go to 'My Profile' and the navigate to the 'Security' section.",
      },
      {
        Step3: "Look for the option 'Manager how you sign in' and click on it.",
      },
      {
        Step4:
          "If you have not turned on two steps verification, please enable it now.",
      },
      { Step5: "Scroll down to find the 'App passwords' section." },
      { Step6: "Create a new app password." },
      { Step7: "Copy the generated password and enter it here." },
    ],
  },
  {
    epid: 8,
    emailProviderName: "Other",
    smtpServer: null,
    smtpPort: null,
    ProviderSteps: [
      { Step1: "Please check documentation for email address provider." },
    ],
  },
];

export default emailProviders;
