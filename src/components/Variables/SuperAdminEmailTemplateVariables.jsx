import React from "react";
import AccountantVariables from "./AccountantVariables";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import Utils from "../../Middleware/Utils";
import { CLIENT_TYPES, SUPER_EMAIL_TEMPLATE } from "../../Middleware/enums";
import BusinessTypeVariables from "../../Database/VariableHelpers/BusinessTypeVariables";
import ProspectTypeVariables from "../../Database/VariableHelpers/ProspectTypeVariables";
import SuperTemplateTypeVariable from "../../Database/VariableHelpers/SuperTemplateTypeVariable";

function SuperAdminEmailTemplateVariable({
  businessTypeId,
  ClintType,
  ModuleName,
}) {
  return (
    <div className="fieldset-group helper-variables-div">
      <label className="fieldset-group-label">Variables</label>
      <AccountantVariables ModuleName={ModuleName} businessTypeId={null} />

      {businessTypeId == SUPER_EMAIL_TEMPLATE.Confirmation_Email && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <CopyToClipboard
            texts={SuperTemplateTypeVariable.ConfirmationEmail}
          />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.Welcome_Email && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <CopyToClipboard texts={SuperTemplateTypeVariable.WelcomeEmail} />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.Forget_Password_Email && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <CopyToClipboard
            texts={SuperTemplateTypeVariable.ForgotPasswordEmail}
          />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.Invite_For_Sign_UP_Email && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <CopyToClipboard texts={SuperTemplateTypeVariable.InviteForSignUp} />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.Two_FA && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <CopyToClipboard texts={SuperTemplateTypeVariable.TwoFA} />
        </>
      )}
    </div>
  );
}

export default SuperAdminEmailTemplateVariable;
