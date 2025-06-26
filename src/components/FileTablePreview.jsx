import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const FileTablePreview = ({ file, extension }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target.result;

      let workbook;
      if (extension === "csv") {
        workbook = XLSX.read(result, { type: "binary" });
      } else {
        workbook = XLSX.read(result, { type: "array" });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      setData(parsedData);
    };

    if (extension === "csv") {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, [file, extension]);

  return (
    <table className="table table-bordered table-sm">
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FileTablePreview;
