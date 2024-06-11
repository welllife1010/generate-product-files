const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-rf-transceiver-ics-0420.json")
const outputJsonFileName =
  "./generated-files/product-rf-transceiver-ics-0502.json"
const outputCsvFileName =
  "./generated-files/product-rf-transceiver-ics-0502.csv"
const additionalSpcification = ["Frequency", "Memory Size", "Data Rate (Max)"]
const voltageName = "Voltage - Supply"
const productCategory = "RF and Wireless>RF Transceiver ICs"
const productTypes = ["IC RF TXRX", "IC RF", "IC RF TXRX+MCU"]
const imagePath = "rf_transceiver_ics_images"
const datasheetPath = "rf_transceiver_ic_datasheets"

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
