const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-microprocessor-0419-v4.json")
const outputJsonFileName = "./generated-files/product-microprocessor-0502.json"
const outputCsvFileName = "./generated-files/product-microprocessor-0502.csv"
const additionalSpcification = [
  "Core Processor",
  "Number of Cores/Bus Width",
  "Speed",
  "Mounting Type",
]
const voltageName = "Voltage - I/O"
const productCategory = "Integrated Circuits>Embedded>Microprocessors"
const productTypes = ["MPU", "Microprocessor"]
const imagePath = "microprocessor_images_0408"

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
