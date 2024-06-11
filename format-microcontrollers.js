const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-microcontrollers-0502_9.json")
const outputJsonFileName =
  "./generated-files/product-microcontrollers-0520-9.json"
const outputCsvFileName =
  "./generated-files/product-microcontrollers-0520-9.csv"
const additionalSpcification = [
  "Core Processor",
  "Core Size",
  "Speed",
  "Program Memory Size",
  "Mounting Type",
]
const voltageName = "Voltage - Supply (Vcc/Vdd)"
const productCategory = "integrated circuits>embedded>microcontrollers"
const productTypes = ["MCU"]
const imagePath = "microcontroller_images"
const datasheetPath = "microcontroller_datasheets"

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
