const fs = require("fs")
const jsonexport = require("jsonexport")
const json = require("./products-work-version.json") // Load your JSON data

async function createNewJsonAndCsv() {
  const newData = json.map((item) => {
    return {
      ManufacturerProductNumber: item.ManufacturerProductNumber,
      PhotoUrl: item.PhotoUrl,
    }
  })

  try {
    // Write the results to a JSON file
    await fs.promises.writeFile(
      "image-json.json",
      JSON.stringify(newData, null, 2)
    )

    jsonexport(newData, (err, csv) => {
      if (err) {
        console.error("Error converting JSON to CSV:", err)
        return
      }

      // Write the CSV data to a file
      fs.writeFile("image-json.csv", csv, (err) => {
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
