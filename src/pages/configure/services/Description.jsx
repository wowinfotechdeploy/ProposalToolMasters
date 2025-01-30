import React, { useState } from "react";
import Text_Editor from "../../../components/Text_Editor";

const Description = ({ setTemplate, template, servicesObj, placeholder }) => {
  const [serviceDescription, setServiceDescription] = useState(template);
  const handleContentChange = (value) => {
    setServiceDescription(value);
    setTemplate({ ...servicesObj, description: value });
  };

  return (
    <>
      <div className="row fieldset">
        <div className="col-12">
          <h6>Service Description</h6>
          <div>
            <Text_Editor
              editorState={serviceDescription}
              handleContentChange={handleContentChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Description;
