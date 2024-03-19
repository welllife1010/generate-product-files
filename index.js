const fs = require("fs")
const jsonexport = require("jsonexport")
const json = require("./products-work-version.json") // Load your JSON data

async function createNewJsonAndCsv() {
  const parametersOfInterest = [
    "Core Processor",
    "Number of Cores/Bus Width",
    "Speed",
    "RAM Controllers",
    "Ethernet",
    "Voltage - I/O",
    "Operating Temperature",
    "Mounting Type",
    "Package / Case",
    "Supplier Device Package",
  ]

  const newData = json.map((item) => {
    const parameters = {}
    item.Parameters.forEach((parameter) => {
      if (parametersOfInterest.includes(parameter.ParameterText)) {
        parameters[parameter.ParameterText] = parameter.ValueText
      }
    })

    return {
      ManufacturerProductNumber: item.ManufacturerProductNumber,
      PackageType: PackageType.Name,
      SeriesName: item.Series.Name,
      ManufacturerName: item.Manufacturer.Name,
      DatasheetUrl: item.DatasheetUrl,
      PhotoUrl: item.PhotoUrl,
      ProductStatus: item.ProductStatus.Status,
      ...parameters, // Spread the parameters into the main object
    }
  })

  try {
    // Write the results to a JSON file
    await fs.promises.writeFile(
      "products-extract-version.json",
      JSON.stringify(newData, null, 2)
    )

    jsonexport(newData, (err, csv) => {
      if (err) {
        console.error("Error converting JSON to CSV:", err)
        return
      }

      // Write the CSV data to a file
      fs.writeFile("products-extract-version.csv", csv, (err) => {
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

createNewJsonAndCsv()
