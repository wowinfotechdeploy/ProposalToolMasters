import {
  CLIENT_TYPES,
  EMAIL_TEMPLATE,
  Template_Type,
  SUPER_EMAIL_TEMPLATE,
} from "../../Middleware/enums";
import React from "react";
import "./variables.css";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import Utils from "../../Middleware/Utils";
import { useSelector } from "react-redux";
import BusinessTypeVariables from "../../Database/VariableHelpers/BusinessTypeVariables";
import TemplateTypeVariables from "../../Database/VariableHelpers/TemplateTypeVariables";
import SuperTemplateTypeVariable from "../../Database/VariableHelpers/SuperTemplateTypeVariable";
import ServicePricingVariables from "../../Database/VariableHelpers/ServicePricingVariables";
const AccountantVariables = ({
  businessTypeId,
  ClintType,
  TemplateType,
  SuperTemplateType,
  ModuleName,
}) => {
  const common = useSelector((state) => state.Storage);
  if (businessTypeId == CLIENT_TYPES.Sole_Trader && ModuleName === "Template") {
    return (
      <div>
        {/* {ClintType !== null && <hr />} */}
          <span className="variableHeading"> Organisation Variables :</span>
        <CopyToClipboard
          texts={BusinessTypeVariables.BusinessSoleTraderVariables}
        />
        {ClintType !== null && <hr />}
        <span className="variableHeading"> Result Total Variables :</span>
        <CopyToClipboard
          heading={`Recurring:`}
          texts={ServicePricingVariables.OnlyForRecurring}
        />
        <CopyToClipboard
          heading={`OneOff:`}
          texts={ServicePricingVariables.OnlyForOneOff}
        />
        <CopyToClipboard
          heading={`Combined(Table View):`}
          texts={ServicePricingVariables.CombinedTableView}
        />
        <CopyToClipboard
          heading={`Combined(Comma Wise):`}
          texts={ServicePricingVariables.CombinedCommaWise}
        />
        <CopyToClipboard
          heading={`Combined(Bullet List Wise):`}
          texts={ServicePricingVariables.CombinedBulletWise}
        />
        {ClintType !== null && <hr />}
      </div>
    );
  } else if (
    businessTypeId == CLIENT_TYPES.Partnership &&
    ModuleName === "Template"
  ) {
    return (
      <div>
           <span className="variableHeading"> Organisation Variables :</span>
        <CopyToClipboard
          texts={BusinessTypeVariables.BusinessPartnerShipVariables}
        />
        {ClintType !== null && <hr />}
        <span className="variableHeading"> Result Total Variables :</span>
        <CopyToClipboard
          heading={`Recurring:`}
          texts={ServicePricingVariables.OnlyForRecurring}
        />
        <CopyToClipboard
          heading={`OneOff:`}
          texts={ServicePricingVariables.OnlyForOneOff}
        />
        <CopyToClipboard
          heading={`Combined(Table View):`}
          texts={ServicePricingVariables.CombinedTableView}
        />
        <CopyToClipboard
          heading={`Combined(Comma Wise):`}
          texts={ServicePricingVariables.CombinedCommaWise}
        />
        <CopyToClipboard
          heading={`Combined(Bullet List Wise):`}
          texts={ServicePricingVariables.CombinedBulletWise}
        />
        {ClintType !== null && <hr />}
      </div>
    );
  } else if (businessTypeId == CLIENT_TYPES.LLP && ModuleName === "Template") {
    return (
      <div>
        <span className="variableHeading"> Organisation Variables :</span>
        <CopyToClipboard texts={BusinessTypeVariables.BusinessLLpVariables} />
        {ClintType !== null && <hr />}
        <span className="variableHeading"> Result Total Variables :</span>
        <CopyToClipboard
          heading={`Recurring:`}
          texts={ServicePricingVariables.OnlyForRecurring}
        />
        <CopyToClipboard
          heading={`OneOff:`}
          texts={ServicePricingVariables.OnlyForOneOff}
        />
        <CopyToClipboard
          heading={`Combined(Table View):`}
          texts={ServicePricingVariables.CombinedTableView}
        />
        <CopyToClipboard
          heading={`Combined(Comma Wise):`}
          texts={ServicePricingVariables.CombinedCommaWise}
        />
        <CopyToClipboard
          heading={`Combined(Bullet List Wise):`}
          texts={ServicePricingVariables.CombinedBulletWise}
        />
        {ClintType !== null && <hr />}
      </div>
    );
  } else if (
    businessTypeId == CLIENT_TYPES.Company &&
    ModuleName === "Template"
  ) {
    return (
      <div>
        <span className="variableHeading"> Organisation Variables :</span>
        <CopyToClipboard
          texts={BusinessTypeVariables.BusinessCompanyVariables}
        />
        {ClintType !== null && <hr />}
        <span className="variableHeading"> Result Total Variables :</span>
        <CopyToClipboard
          heading={`Recurring:`}
          texts={ServicePricingVariables.OnlyForRecurring}
        />
        <CopyToClipboard
          heading={`OneOff:`}
          texts={ServicePricingVariables.OnlyForOneOff}
        />
        <CopyToClipboard
          heading={`Combined(Table View):`}
          texts={ServicePricingVariables.CombinedTableView}
        />
        <CopyToClipboard
          heading={`Combined(Comma Wise):`}
          texts={ServicePricingVariables.CombinedCommaWise}
        />
        <CopyToClipboard
          heading={`Combined(Bullet List Wise):`}
          texts={ServicePricingVariables.CombinedBulletWise}
        />
        {ClintType !== null && <hr />}
      </div>
    );
  } else if (
    businessTypeId == CLIENT_TYPES.Partnership &&
    ModuleName === "TnCTemplate"
  ) {
    return (
      <div>        
        <CopyToClipboard
          texts={BusinessTypeVariables.TncCustomBusinessPartnerShipVariables}
        />
        {ClintType !== null && <hr />}
      </div>
    );
  } else if (
    businessTypeId == CLIENT_TYPES.Company &&
    ModuleName === "TnCTemplate"
  ) {
    return (
      <div>        
        <CopyToClipboard
          texts={BusinessTypeVariables.TncCustomBusinessCompanyVariables}
        />
        {ClintType !== null && <hr />}
      </div>
    );
  } else if (
    businessTypeId == CLIENT_TYPES.Sole_Trader &&
    ModuleName === "TnCTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard
          texts={BusinessTypeVariables.TncCustomBusinessSoleTraderVariables}
        />
        {ClintType !== null && <hr />}
      </div>
    );
  } else if (
    businessTypeId == CLIENT_TYPES.LLP &&
    ModuleName === "TnCTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard
          texts={BusinessTypeVariables.TncCustomBusinessLLpVariables}
        />
        {ClintType !== null && <hr />}
      </div>
    );
  } else if (
    businessTypeId === EMAIL_TEMPLATE.All_Variables &&
    TemplateType === null
  ) {
    return (
      <div>        
        <CopyToClipboard texts={TemplateTypeVariables.AllVariables} />
      </div>
    );
  } else if (
    businessTypeId === EMAIL_TEMPLATE.Quote &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.Quote} />
      </div>
    );
  } else if (
    businessTypeId === EMAIL_TEMPLATE.Contract &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.Contract} />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Email_Invite &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.EmailInvite} />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Contract_Accepted &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.ContractAccepted} />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Contract_Declined &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.ContractDeclined} />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Contract_Viewed &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.ContractViewed} />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Quote_PDF &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.QuotePdf} />
      </div>
    );
  } else if (
    businessTypeId === SUPER_EMAIL_TEMPLATE.SuperAllVariable &&
    ModuleName === "SuperEmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={SuperTemplateTypeVariable.SuperAllVariable} />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Quote_Accepted &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.QuoteAccepted} />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Quote_Declined &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard texts={TemplateTypeVariables.QuoteDecline} />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Email_Invite_For_Organisation &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard
          texts={TemplateTypeVariables.EmailInviteForOrganisation}
        />
      </div>
    );
  } else if (
    businessTypeId ==
      EMAIL_TEMPLATE.Quote_AcceptedDeclined_Email_Send_To_Sender &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard
          texts={TemplateTypeVariables.QuoteAcceptedDeclinedEmailSendToSender}
        />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Contract_Accepted_Email_Send_To_Sender &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard
          texts={
            TemplateTypeVariables.EngagementLetterAcceptedEmailSendToSender
          }
        />
      </div>
    );
  } else if (
    businessTypeId == EMAIL_TEMPLATE.Contract_Declined_Email_Send_To_Receiver &&
    ModuleName === "EmailTemplate"
  ) {
    return (
      <div>
        <CopyToClipboard
          texts={
            TemplateTypeVariables.EngagementLetterDeclinedEmailSendToReceiver
          }
        />
      </div>
    );
  }

  return null;
};

export default AccountantVariables;
