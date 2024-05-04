const createNewJsonAndCsv = require("./index.js")

const inputJson = require("./reference-files/product-analog-switches-multiplexers-demultiplexers-0420.json")
const outputJsonFileName =
  "./generated-files/product-analog-switches-multiplexers-demultiplexers-0502.json"
const outputCsvFileName =
  "./generated-files/product-analog-switches-multiplexers-demultiplexers-0502.csv"
const additionalSpcification = [
  "Switch Circuit",
  "Multiplexer/Demultiplexer Circuit",
  "On-State Resistance (Max)",
  "Mounting Type",
]
const voltageNameOne = "Voltage - Supply, Single (V+)"
const voltageNameTwo = "Voltage - Supply, Dual (V±)"

const productCategory =
  "Integrated Circuits>Interface>Analog Switches, Multiplexers, Demultiplexers"
const productTypes = ["Switch", "MUX"]
const imagePath = "analog_switches_multiplexers_demultiplexers_images"

createNewJsonAndCsv(
  inputJson,
  outputJsonFileName,
  outputCsvFileName,
  additionalSpcification,
  voltageNameOne,
  voltageNameTwo,
  productCategory,
  productTypes,
  imagePath
)
