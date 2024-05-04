const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-fpgas-field-programmable-gate-array-0420.json")
const outputJsonFileName =
  "./generated-files/product-fpgas-field-programmable-gate-array-0502.json"
const outputCsvFileName =
  "./generated-files/product-fpgas-field-programmable-gate-array-0502.csv"
const additionalSpcification = ["Number of I/O"]
const voltageName = "Voltage - Supply"
const productCategory =
  "integrated circuits>embedded>FPGAs (Field Programmable Gate Array)"
const productTypes = ["FPGA"]
const imagePath = "fpgas-field-programmable-gate-array"

createNewJsonAndCsv(
  inputJson,
  outputJsonFileName,
  outputCsvFileName,
  additionalSpcification,
  voltageName,
  "",
  productCategory,
  productTypes,
  imagePath
)
