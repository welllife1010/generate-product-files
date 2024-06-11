const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-rf-switches-0421.json")
const outputJsonFileName = "./generated-files/product-rf-switches-0515.json"
const outputCsvFileName = "./generated-files/product-rf-switches-0515.csv"
const additionalSpcification = [
  "RF Type",
  "Frequency Range",
  "Isolation",
  "Circuit",
  "Mounting Type",
]
const voltageName = "Voltage - Supply"
const productCategory = "RF and Wireless>RF Switches"
const productTypes = ["Switch", "SW"]
const imagePath = "rf_switch_images"
const datasheetPath = "rf_switch_datasheets"

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
