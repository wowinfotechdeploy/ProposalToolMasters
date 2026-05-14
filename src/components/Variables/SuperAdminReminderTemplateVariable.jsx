import React from "react";
import AccountantVariables from "./AccountantVariables";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import Utils from "../../Middleware/Utils";
import { CLIENT_TYPES, EmailTemplates } from "../../Middleware/enums";
import BusinessTypeVariables from "../../Database/VariableHelpers/BusinessTypeVariables";
import ProspectTypeVariables from "../../Database/VariableHelpers/ProspectTypeVariables";
import SuperTemplateTypeVariable from "../../Database/VariableHelpers/SuperTemplateTypeVariable";
import ReminderTypesVariable from "../../Database/VariableHelpers/ReminderTypeVariables";
function SuperAdminEmailTemplateVariable({
    businessTypeId,
    ClintType,
    ModuleName,
}) {
    return (
        <div className="fieldset-group helper-variables-div">
            <label className="fieldset-group-label">Variables</label>
            {businessTypeId == EmailTemplates.PaidUser_FirstMail && (
                <>
                    <CopyToClipboard
                        heading={`User:`}
                        texts={SuperTemplateTypeVariable.PaidUser_FirstMail}
                    />
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Accountant:`}
                            texts={ReminderTypesVariable.SuperAdminReminderTypesAccountantVariable}
                        />
                    </div>
                </>
            )}
            {businessTypeId == EmailTemplates.PaidUser_SecondMail && (
                <>
                    <CopyToClipboard heading={`User:`} texts={SuperTemplateTypeVariable.PaidUser_SecondMail} />
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Accountant:`}
                            texts={ReminderTypesVariable.SuperAdminReminderTypesAccountantVariable}
                        />
                    </div>
                </>
            )}
            {businessTypeId == EmailTemplates.PaidUser_ThirdMail && (
                <>
                    <CopyToClipboard
                        heading={`User:`}
                        texts={SuperTemplateTypeVariable.PaidUser_ThirdMail}
                    />
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Accountant:`}
                            texts={ReminderTypesVariable.SuperAdminReminderTypesAccountantVariable}
                        />
                    </div>
                </>
            )}
            {businessTypeId == EmailTemplates.UnpaidUser_DeletionMail && (
                <>

                    <CopyToClipboard heading={`User:`} texts={SuperTemplateTypeVariable.UnpaidUser_DeletionMail} />
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Accountant:`}
                            texts={ReminderTypesVariable.SuperAdminReminderTypesAccountantVariable}
                        />
                    </div>
                </>
            )}
            {businessTypeId == EmailTemplates.UnpaidUser_FirstMail && (
                <>
                    <CopyToClipboard heading={`User:`} texts={SuperTemplateTypeVariable.UnpaidUser_FirstMail} />
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Accountant:`}
                            texts={ReminderTypesVariable.SuperAdminReminderTypesAccountantVariable}
                        />
                    </div>
                </>
            )}
            {businessTypeId == EmailTemplates.UnpaidUser_SecondMail && (
                <>
                    <CopyToClipboard heading={`User:`} texts={SuperTemplateTypeVariable.UnpaidUser_SecondMail} />
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Accountant:`}
                            texts={ReminderTypesVariable.SuperAdminReminderTypesAccountantVariable}
                        />
                    </div>
                </>
            )}
            {businessTypeId == EmailTemplates.UnpaidUser_ThirdMail && (
                <>
                    <CopyToClipboard heading={`User:`} texts={SuperTemplateTypeVariable.UnpaidUser_ThirdMail} />
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Accountant:`}
                            texts={ReminderTypesVariable.SuperAdminReminderTypesAccountantVariable}
                        />
                    </div>
                </>
            )}
            {businessTypeId == EmailTemplates.Reminder && (
                <>
                    {" "}
                    <CopyToClipboard
                        heading={`User:`}
                        texts={SuperTemplateTypeVariable.Reminder} />
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Subscription:`}
                            texts={SuperTemplateTypeVariable.Subscription}
                        />
                    </div>
                    <div className="separator mt-2 mb-2" />
                    <div>
                        <CopyToClipboard
                            heading={`Accountant:`}
                            texts={ReminderTypesVariable.SuperAdminReminderTypesAccountantVariable}
                        />
                    </div>
                </>
            )}
            {businessTypeId == EmailTemplates.FreePackageOrg_FirstMail && (
                <>
                    <CopyToClipboard heading={`User:`} texts={SuperTemplateTypeVariable.FreePackageReminder} />
                    <div className="separator mt-2 mb-2" />
                </>
            )}
             {businessTypeId == EmailTemplates.FreePackageOrg_SecondMail && (
                <>
                    <CopyToClipboard heading={`User:`} texts={SuperTemplateTypeVariable.FreePackageReminder} />
                    <div className="separator mt-2 mb-2" />
                </>
            )}
             {businessTypeId == EmailTemplates.FreePackageOrg_ThirdMail && (
                <>
                    <CopyToClipboard heading={`User:`} texts={SuperTemplateTypeVariable.FreePackageReminder} />
                    <div className="separator mt-2 mb-2" />
                </>
            )}
        </div>
    );
}

export default SuperAdminEmailTemplateVariable;
