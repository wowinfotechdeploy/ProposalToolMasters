import React, { useContext, useEffect, useState } from "react";
import "./templateDesign.css";
import { ERROR_MESSAGES } from "../GlobalMessage";
import Text_Editor from "../Text_Editor";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
function Text_Block({
  setTemplateElementList,
  templateElementList,
  index,
  requireElementTypeErrorMessage,
  content,
  FirstPage,
  modelAction,
  moduleName,
  setRequireElementTypeErrorMessage,
}) {

  const { HtmlToPlainText } = useContext(AuthContextProvider);
  useEffect(() => {
    try {
      if (modelAction === "Add") {
        const updatedTemplateElementList = [...templateElementList];
        updatedTemplateElementList[index] = {
          ...updatedTemplateElementList[index],
          htmlContent: content,
        };
        setTemplateElementList(updatedTemplateElementList);
      }

      // if (modelAction === "Update") {
      //   setEditorState(content);
      // }
    } catch (error) {
      console.error("Error updating content:", error);
    }
  }, [modelAction]);
  useEffect(() => {
    if (FirstPage && content) {
      // setEditorState(content);
    } else if (!FirstPage && templateElementList[index]?.htmlContent) {
      // setEditorState(templateElementList[index].htmlContent);
    }
  }, []);

  const handleContentChange = async (newContent) => {
    const trimmedContent = HtmlToPlainText(newContent, moduleName);
    const hasTextAtZeroPosition = trimmedContent.trim().length > 0;
    if (!hasTextAtZeroPosition) {
      // setEditorState("");
      const updatedTemplateElementList = [...templateElementList];
      updatedTemplateElementList[index] = {
        ...updatedTemplateElementList[index],
        htmlContent: null,
      };
      setTemplateElementList(updatedTemplateElementList);
      setRequireElementTypeErrorMessage({
        ...requireElementTypeErrorMessage,
        htmlContent: true,
      });
      return;
    } else {
      // setEditorState(newContent);
    }

    try {
      const updatedTemplateElementList = [...templateElementList];
      updatedTemplateElementList[index] = {
        ...updatedTemplateElementList[index],
        htmlContent: newContent || null,
      };
      setTemplateElementList(updatedTemplateElementList);
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };
  return (
    <div
      className="row fieldset"
      id={`EditorDiv_${templateElementList[index]?.htmlContent}`}
    >
      <div className="col-12">
        <h5 className="mt-2">Content</h5>
        <div className="separator mb-3">
          <Text_Editor
            index={0}
            handleContentChange={handleContentChange}
            editorState={templateElementList[index]?.htmlContent}
            modelAction={modelAction}
          />
          {requireElementTypeErrorMessage.htmlContent &&
            (templateElementList[index]?.htmlContent === "" ||
              templateElementList[index]?.htmlContent === null ||
              templateElementList[index]?.htmlContent === "<p><br></p>" ||
              templateElementList[index]?.htmlContent === undefined) ? (
            <label className="validation">{ERROR_MESSAGES}</label>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
export default Text_Block;
