 
const xlsx = require('xlsx');
const excelDataconverter = (req,res) => {
    const dataurl = '../../DiaWithoutCost.xlsx';
    console.log(dataurl)

    const workbook = xlsx.readFile(dataurl);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(worksheet);
    console.log(json);
  
}
module.export ={excelDataconverter}
