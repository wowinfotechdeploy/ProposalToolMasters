import React, { useContext } from "react";
import AccountantVariables from "./AccountantVariables";
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard";
import ProspectTypeVariables from "../../Database/VariableHelpers/ProspectTypeVariables";
import { AuthContextProvider } from "../../AuthContext/AuthContext";

function LlpAndCompanyVariables({ businessTypeId, ClintType, ModuleName }) {
  const {prospectName} = useContext(AuthContextProvider);

  return (
    <div className="fieldset-group helper-variables-div">
      <label className="fieldset-group-label">Variables</label>
      <AccountantVariables
        ModuleName={ModuleName}
        ClintType={ClintType}
        businessTypeId={businessTypeId}
      />
      {ModuleName==='Template' && <span className="text-start variableHeading">{prospectName} Variables :</span>}
      <CopyToClipboard texts={ProspectTypeVariables.ClientLLpVariables} />
    </div>
  );
}

export default LlpAndCompanyVariables;
