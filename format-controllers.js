const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-controllers-0420.json")
const outputJsonFileName = "./generated-files/product-controllers-0522.json"
const outputCsvFileName = "./generated-files/product-controllers-0522.csv"
const additionalSpcification = [
  "Protocol",
  "Number of Drivers/Receivers",
  "Data Rate",
  "Mounting Type",
]
const voltageName = "Voltage - Supply"
const productCategory = "integrated circuits>interface>Controllers"
const productTypes = ["Controller", "CTRLR"]
const imagePath = "controller_images"
const datasheetPath = "controller_datasheets"

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
