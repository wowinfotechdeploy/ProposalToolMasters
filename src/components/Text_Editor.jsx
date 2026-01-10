import React from "react";
import JoditEditor from "jodit-react";

// Define the separate configuration object
const editorConfig = {
  placeholder: "",
  enter: "DIV",
  beautifyHTML: false,
  uploader: {
    insertImageAsBase64URI: true,
    direction: "ltr",
  },
  activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about'],
  // removeButtons: ['source', 'fullsize', 'about', 'outdent', 'indent', 'video', 'print', 'table', 'fontsize', 'superscript', 'subscript', 'file', 'cut', 'selectall'],
  disablePlugins: ['paste', 'stat'],
  askBeforePasteHTML: true, // Prevents the link popup model from auto shutdown
  buttons:
    "bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,lineHeight,superscript,subscript,classSpan,file,image,video,speechRecognize,spellcheck,table,source,fullsize, about, outdent, indent, print, table, fontsize, superscript, subscript,file,cut,selectall",
  // };
}

// const editorConfig = {
//   zIndex: 0,
//   readonly: false,
//   activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about'],
//   toolbarButtonSize: 'middle',
//   theme: 'default',
//   enableDragAndDropFileToEditor: true,
//   saveModeInCookie: false,
//   spellcheck: true,
//   editorCssClass: false,
//   triggerChangeEvent: true,
//   height: 220,
//   direction: 'ltr',
//   language: 'en',
//   debugLanguage: false,
//   i18n: 'en',
//   tabIndex: -1,
//   toolbar: true,
//   enter: 'P',
//   useSplitMode: false,
//   colorPickerDefaultTab: 'background',
//   imageDefaultWidth: 100,
//   removeButtons: ['source', 'fullsize', 'about', 'outdent', 'indent', 'video', 'print', 'table', 'fontsize', 'superscript', 'subscript', 'file', 'cut', 'selectall'],
//   disablePlugins: ['paste', 'stat'],
//   events: {},
//   textIcons: false,
//   uploader: {
//     insertImageAsBase64URI: true
//   },
//   placeholder: '',
//   showXPathInStatusbar: false
// };
export default function Text_Editor(props) {
  const placeholder =
    props.modelAction === "update" ? "" : "Enter your content here...";

  return (
    <JoditEditor
      value={props.editorState}
      onBlur={props.handleContentChange}
      config={editorConfig} // Pass the config object as a prop
    />
  );
}
