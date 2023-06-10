import { Workbook } from "exceljs";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

export function jsonToExcel(
  data: any,
  year: any,
  sec: any,
  date?: any
): Promise<any> {
  const yearName = ["I", "II", "III", "IV"];
  const secName = ["A", "B", "C", "D", "E", "F"];
  const header = Object.keys(data[0]);

  let fDate = new Date(date);

  let workbook = exportAsExcelFile(
    "PANIMALAR ENGINEEERING COLLEGE",
    `${
      date
        ? `${fDate.getDate()}-${fDate.getMonth()}-${fDate.getFullYear()} /`
        : ""
    } ${yearName[year - 1]} YEAR ${
      sec !== "null" ? secName[sec - 1] + " SEC" : ""
    }`,
    header,
    data
  );

  return new Promise<any>((resolve, reject) => {
    /*Save Excel File*/
    workbook.xlsx.writeBuffer().then((buffer) => {
      return resolve(buffer);
    });
  });
}

function exportAsExcelFile(
  reportHeading: string,
  reportSubHeading: string,
  headersArray: any[],
  json: any[]
) {
  const header = headersArray;
  const data = json;

  /* Create workbook and worksheet */
  const workbook = new Workbook();
  workbook.creator = "Snippet Coder";
  workbook.lastModifiedBy = "SnippetCoder";
  workbook.created = new Date();
  workbook.modified = new Date();
  const worksheet = workbook.addWorksheet("Sheet 1");

  /* Add Header Row */
  worksheet.addRow([]);
  worksheet.mergeCells("A1:" + numToAlpha(header.length - 1) + "1");
  worksheet.getCell("A1").value = reportHeading;
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { size: 26, bold: true };

  worksheet.addRow([]);
  worksheet.mergeCells("A2:" + numToAlpha(header.length - 1) + "2");
  worksheet.getCell("A2").value = "DEPARTMENT OF CSE";
  worksheet.getCell("A2").alignment = { horizontal: "center" };
  worksheet.getCell("A2").font = { size: 20, bold: false };

  if (reportSubHeading !== "") {
    worksheet.addRow([]);
    worksheet.mergeCells("A3:" + numToAlpha(header.length - 1) + "3");
    worksheet.getCell("A3").value = reportSubHeading;
    worksheet.getCell("A3").alignment = { horizontal: "center" };
    worksheet.getCell("A3").font = { size: 20, bold: false };
  }

  /* Add Header Row */
  const headerRow = worksheet.addRow(header);

  // Cell Style : Fill and Border
  headerRow.eachCell((cell, index) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" },
      bgColor: { argb: "FF0000FF" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.font = { size: 12, bold: true };

    worksheet.getColumn(index).width =
      header[index - 1].length < 20 ? 20 : header[index - 1].length;
  });

  // Get all columns from JSON
  let columnsArray: any[];
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      columnsArray = Object.keys(json[key]);
    }
  }

  // Add Data and Conditional Formatting
  data.forEach((element: any) => {
    const eachRow: any[] = [];
    columnsArray.forEach((column) => {
      eachRow.push(element[column]);
    });

    if (element.isDeleted === "Y") {
      const deletedRow = worksheet.addRow(eachRow);
      deletedRow.eachCell((cell) => {
        cell.font = {
          name: "Calibri",
          family: 4,
          size: 11,
          bold: false,
          strike: true,
        };
      });
    } else {
      worksheet.addRow(eachRow);
    }
  });
  return workbook;
}

function numToAlpha(num: number) {
  let alpha = "";

  for (; num >= 0; num = parseInt((num / 26).toString(), 10) - 1) {
    alpha = String.fromCharCode((num % 26) + 0x41) + alpha;
  }

  return alpha;
}
