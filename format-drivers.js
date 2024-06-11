const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-drivers-receivers-transceivers-0420.json")
const outputJsonFileName =
  "./generated-files/product-drivers-receivers-transceivers-0502.json"
const outputCsvFileName =
  "./generated-files/product-drivers-receivers-transceivers-0502.csv"
const additionalSpcification = [
  "Protocol",
  "Number of Drivers/Receivers",
  "Data Rate",
  "Mounting Type",
]
const voltageName = "Voltage - Supply"
const productCategory =
  "Integrated Circuits>Interface>Drivers, Receivers, Transceivers"
const productTypes = ["Driver", "Transceiver", "Receiver"]
const imagePath = "drivers-receivers-transceivers_images"
const datasheetPath = "driver_receiver_transceiver_datasheets"

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
