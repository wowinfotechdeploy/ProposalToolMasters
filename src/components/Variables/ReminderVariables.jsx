import {
    CLIENT_TYPES,
    REMINDER_EMAIL_TEMPLATE,
} from "../../Middleware/enums";
import React, { useContext } from "react";
import "./variables.css";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import ReminderTypesVariable from "../../Database/VariableHelpers/ReminderTypeVariables";
import { AuthContextProvider } from "../../AuthContext/AuthContext";

const ReminderVariables = ({
    businessTypeId,
    ModuleName,
}) => {
    const {
        proposalName,
        EngagementName,
    } = useContext(AuthContextProvider);
    return (
        <>
            <div>
                <CopyToClipboard
                    heading={`Prospect:`}
                    texts={ReminderTypesVariable.ReminderTypesProspectVariable}
                />
            </div>
            <hr />
            <div>
                <CopyToClipboard
                    heading={`Accountant:`}
                    texts={ReminderTypesVariable.ReminderTypesAccountantVariable}
                />
            </div>
            <hr />
            <div>
                <CopyToClipboard
                    heading={`${proposalName}/${EngagementName}:`}
                    texts={ReminderTypesVariable.ReminderTypesElPlVariable}
                />
            </div>
        </>
    );
    // } else if (businessTypeId == REMINDER_EMAIL_TEMPLATE.QuoteViewedTriggerPoint && ModuleName === "ReminderEmailTemplate") {
    //     return (
    //         <div>
    //             <CopyToClipboard
    //                 texts={ReminderTypeVariables.QuotationViewTriggerPoint}
    //             />
    //         </div>
    //     );
    // } else if (businessTypeId == REMINDER_EMAIL_TEMPLATE.QuoteAcceptedTriggerPoint && ModuleName === "ReminderEmailTemplate") {
    //     return (
    //         <div>
    //             <CopyToClipboard
    //                 texts={ReminderTypeVariables.QuotationAcceptedTriggerPoint}
    //             />
    //         </div>
    //     );
    // } else if (businessTypeId == REMINDER_EMAIL_TEMPLATE.QuoteDeclinedTriggerPoint && ModuleName === "ReminderEmailTemplate") {
    //     return (
    //         <div>
    //             <CopyToClipboard
    //                 texts={ReminderTypeVariables.QuotationDeclinedTriggerPoint}
    //             />
    //         </div>
    //     );
    // } else if (businessTypeId == REMINDER_EMAIL_TEMPLATE.ContractSentTriggerPoint && ModuleName === "ReminderEmailTemplate") {
    //     return (
    //         <div>
    //             <CopyToClipboard
    //                 texts={ReminderTypeVariables.EngagementLetterSendTriggerPoint}
    //             />
    //         </div>
    //     );
    // } else if (businessTypeId == REMINDER_EMAIL_TEMPLATE.ContractViewedTriggerPoint && ModuleName === "ReminderEmailTemplate") {
    //     return (
    //         <div>
    //             <CopyToClipboard
    //                 texts={ReminderTypeVariables.EngagementLetterViewTriggerPoint}
    //             />
    //         </div>
    //     );
    // } else if (businessTypeId == REMINDER_EMAIL_TEMPLATE.ContractDeclinedTriggerPoint && ModuleName === "ReminderEmailTemplate") {
    //     return (
    //         <div>
    //             <CopyToClipboard
    //                 texts={ReminderTypeVariables.EngagementLetterDeclinedTriggerPoint}
    //             />
    //         </div>
    //     );
    // } else if (businessTypeId == REMINDER_EMAIL_TEMPLATE.ContractSignedTriggerPoint && ModuleName === "ReminderEmailTemplate") {
    //     return (
    //         <div>
    //             <CopyToClipboard
    //                 texts={ReminderTypeVariables.EngagementLetterSignedTriggerPoint}
    //             />
    //         </div>
    //     );
    // }

    return null;
};

export default ReminderVariables;
