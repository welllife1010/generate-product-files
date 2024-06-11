const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-fpgas-field-programmable-gate-array-0420.json")
const outputJsonFileName =
  "./generated-files/product-fpgas-field-programmable-gate-array-0521.json"
const outputCsvFileName =
  "./generated-files/product-fpgas-field-programmable-gate-array-0521.csv"
const additionalSpcification = ["Number of I/O"]
const voltageName = "Voltage - Supply"
const productCategory =
  "integrated circuits>embedded>FPGAs (Field Programmable Gate Array)"
const productTypes = ["FPGA"]
const imagePath = "fpgas_field_programmable_gate_array_images"
const datasheetPath = "fpga_field_programmable_gate_array_datasheets"

createNewJsonAndCsv(
  inputJson,
  outputJsonFileName,
  outputCsvFileName,
  additionalSpcification,
  voltageName,
  "",
  productCategory,
  productTypes,
  imagePath,
  datasheetPath
)
