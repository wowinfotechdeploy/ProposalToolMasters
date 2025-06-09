import React from "react";
import AccountantVariables from "./AccountantVariables";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import { SUPER_EMAIL_TEMPLATE } from "../../Middleware/enums";
import SuperTemplateTypeVariable from "../../Database/VariableHelpers/SuperTemplateTypeVariable";

function SuperAdminEmailTemplateVariable({
  businessTypeId,
  ClintType,
  ModuleName,
}) {
  return (
    <div className="fieldset-group helper-variables-div">
      <label className="fieldset-group-label">Variables</label>
      {businessTypeId !== SUPER_EMAIL_TEMPLATE.SubscriptionPurchase &&
        businessTypeId !== SUPER_EMAIL_TEMPLATE.SubscriptionRenew &&
        businessTypeId !== SUPER_EMAIL_TEMPLATE.EsignQuotaExceed && (
          <div>
            <span className="variableHeading">Common Variables :</span>
            <AccountantVariables
              ModuleName={ModuleName}
              businessTypeId={null}
            />
          </div>
        )}

      {businessTypeId == SUPER_EMAIL_TEMPLATE.Confirmation_Email && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <span className="variableHeading">Template Type Variables:</span>
          <CopyToClipboard
            texts={SuperTemplateTypeVariable.ConfirmationEmail}
          />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.Welcome_Email && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <span className="variableHeading">Template Type Variables:</span>
          <CopyToClipboard texts={SuperTemplateTypeVariable.WelcomeEmail} />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.Forget_Password_Email && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <span className="variableHeading">Template Type Variables:</span>
          <CopyToClipboard
            texts={SuperTemplateTypeVariable.ForgotPasswordEmail}
          />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.Invite_For_Sign_UP_Email && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <span className="variableHeading">Template Type Variables:</span>
          <CopyToClipboard texts={SuperTemplateTypeVariable.InviteForSignUp} />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.Two_FA && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <span className="variableHeading">Template Type Variables:</span>
          <CopyToClipboard texts={SuperTemplateTypeVariable.TwoFA} />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.SubscriptionPurchase && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <span className="variableHeading">Template Type Variables:</span>
          <CopyToClipboard
            texts={SuperTemplateTypeVariable.SubscriptionPurchase}
          />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.SubscriptionRenew && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <span className="variableHeading">Template Type Variables:</span>
          <CopyToClipboard
            texts={SuperTemplateTypeVariable.SubscriptionRenewal}
          />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.EsignQuotaExceed && (
        <>
          {" "}
          <div className="separator mt-2 mb-2" />
          <span className="variableHeading">Template Type Variables:</span>
          <CopyToClipboard
            texts={SuperTemplateTypeVariable.EsignQuotaExceedVariables}
          />
        </>
      )}
      {businessTypeId == SUPER_EMAIL_TEMPLATE.AccesskeyCreated && (
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
