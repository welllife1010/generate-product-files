const fs = require("fs")
const jsonexport = require("jsonexport")

async function jsonToCsv(jsonFileName, csvFileName) {
  // Read the JSON file
  fs.readFile(jsonFileName, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err)
      return
    }

    // Parse the JSON data
    const products = JSON.parse(data)

    // Function to save a CSV chunk
    const saveCsvChunk = (chunk, index) => {
      const options = { fillGaps: true }
      jsonexport(chunk, options, (err, csv) => {
        if (err) {
          console.error("Error converting JSON to CSV:", err)
          return
        }
        const partFileName = `${csvFileName.split(".csv")[0]}_part${index}.csv`
        fs.writeFile(partFileName, csv, (err) => {
          if (err) {
            console.error("Error writing the CSV file:", err)
            return
          }
          console.log(`Successfully saved as ${partFileName}`)
        })
      })
    }

    // Define the size of each chunk (e.g., 5000 records per file)
    const chunkSize = 5000
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize)
      saveCsvChunk(chunk, i / chunkSize + 1)
    }
  })
}

module.exports = jsonToCsv
