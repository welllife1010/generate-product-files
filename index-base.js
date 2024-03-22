const fs = require("fs")
const jsonexport = require("jsonexport")
const json = require("./generated-files/products-microprocessor-all.json")

async function createNewJsonAndCsv(outputJsonFileName, outputCsvFileName) {
  const parametersOfInterest = [
    "Supplier Device Package",
    "Voltage - I/O",
    "Operating Temperature",
    "Mounting Type",
    "Package / Case",
  ]

  const newData = json.map((item) => {
    const parameters = {}
    const combinedParameters = [] // Array to store values of combined parameters

    item.Parameters.forEach((parameter) => {
      if (parametersOfInterest.includes(parameter.ParameterText)) {
        parameters[parameter.ParameterText] = parameter.ValueText
      } else if (
        ["Core Processor", "Number of Cores/Bus Width", "Speed"].includes(
          parameter.ParameterText
        )
      ) {
        combinedParameters.push(parameter.ValueText)
      }
    })

    // Combine parameters into a single string separated by commas
    const combinedParametersString = combinedParameters.join(", ")

    return {
      PartNumber: item.ManufacturerProductNumber,
      Manufacturer: item.Manufacturer.Name,
      ProductStatus: item.ProductStatus.Status,
      SeriesName: item.Series.Name,
      ManufacturerName: item.Manufacturer.Name,
      ...parameters, // Spread the parameters of interest into the main object
      AdditionalKeyinformation_CoreProcessor_numberOfCores_Bus_Speed:
        combinedParametersString, // Add a new key for combined parameters
      Quantity: item.ProductVariations.StandardPricing.BreakQuantity,
      DatasheetUrl: item.DatasheetUrl,
      PhotoUrl: item.PhotoUrl,
      Description: item.Description.ProductDescription,
    }
  })

  try {
    // Write the results to a JSON file
    await fs.promises.writeFile(
      outputJsonFileName,
      JSON.stringify(newData, null, 2)
    )

    jsonexport(newData, (err, csv) => {
      if (err) {
        console.error("Error converting JSON to CSV:", err)
        return
      }

      // Write the CSV data to a file
      fs.writeFile(outputCsvFileName, csv, (err) => {
        if (err) {
          console.error("Error writing the CSV file:", err)
          return
        }
        console.log(
          "Successfully converted JSON to CSV and saved as products.csv"
        )
      })
    })
    console.log(newData.length)
    console.log("Files generated successfully!")
  } catch (error) {
    console.error("Error occurred:", error)
  }
}

const outputJsonFileName = "finalPullFromJson.js"
const outputCsvFileName = "finalPullFromJson.csv"

createNewJsonAndCsv(outputJsonFileName, outputCsvFileName)
