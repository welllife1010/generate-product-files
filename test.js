const fs = require("fs")
const jsonexport = require("jsonexport")
const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua")
const json = require("./products-work-version.json")

// Add Stealth and AnonymizeUA plugins
puppeteer.use(StealthPlugin())
puppeteer.use(AnonymizeUAPlugin())

async function downloadImages(products) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Set up a retry mechanism in case of 403 errors
  const MAX_RETRY = 3
  let retryCount = 0

  for (const product of products) {
    while (retryCount < MAX_RETRY) {
      try {
        if (product.PhotoUrl) {
          await page.goto(product.PhotoUrl, { waitUntil: "networkidle2" })
          const imageBuffer = await page.screenshot({ encoding: "binary" })
          product.ImageData = imageBuffer.toString("base64")
        }
        break // Break the loop if image is downloaded successfully
      } catch (error) {
        console.error(
          `Error downloading image for product: ${product.ManufacturerProductNumber}`
        )
        console.error(`Retry attempt ${retryCount + 1}/${MAX_RETRY}`)
        retryCount++
        // Handle 403 error, possibly by using proxy or other means
        // You can implement proxy rotation or other measures here
      }
    }

    // Reset retry count for the next product
    retryCount = 0
  }

  await browser.close()
  return products
}

async function createNewJsonAndCsv() {
  try {
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

    // Download images
    const productsWithImages = await downloadImages(json)

    const newData = productsWithImages.map((item) => {
      const parameters = {}
      item.Parameters.forEach((parameter) => {
        if (parametersOfInterest.includes(parameter.ParameterText)) {
          parameters[parameter.ParameterText] = parameter.ValueText
        }
      })

      return {
        ManufacturerProductNumber: item.ManufacturerProductNumber,
        SeriesName: item.Series.Name,
        ManufacturerName: item.Manufacturer.Name,
        DatasheetUrl: item.DatasheetUrl,
        ProductStatus: item.ProductStatus.Status,
        ImageData: item.ImageData || "", // Default to empty string if no image data
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
      console.error("Error occurred while writing files:", error)
    }
  } catch (error) {
    console.error("Error occurred:", error.message)
  }
}

createNewJsonAndCsv()
