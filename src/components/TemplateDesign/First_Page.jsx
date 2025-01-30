import React, { useContext, useEffect, useState } from "react";
import "./templateDesign.css";
import { ERROR_MESSAGES } from "../GlobalMessage";
import Text_Editor from "../Text_Editor";
import JoditEditor from "jodit-react";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
function Text_Block({
    templateElementList,
    requireElementTypeErrorMessage,
    setRequireElementTypeErrorMessage,
    setTemplateElementList,
    index,
    modelAction,
    moduleName,
}) {
    const [editorState, setEditorState] = useState("");
    const { HtmlToPlainText } = useContext(AuthContextProvider);

    const handleContentChange = async (newContent) => {
        const trimmedContent = HtmlToPlainText(newContent, moduleName);
        const hasTextAtZeroPosition = trimmedContent.trim().length > 0;
        if (!hasTextAtZeroPosition) {
            setEditorState("");
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
            setEditorState(newContent);
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
    useEffect(() => {
        setEditorState(templateElementList[index].htmlContent);
    }, []);
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
                        editorState={editorState}
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
