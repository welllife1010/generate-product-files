const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua")
const fs = require("fs")
const path = require("path")
const ExcelJS = require("exceljs")

// Add plugins
puppeteer.use(StealthPlugin())
puppeteer.use(AnonymizeUAPlugin())

async function downloadImagesFromJson(jsonFilePath, outputFolder) {
  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Read JSON file
    const jsonData = require(jsonFilePath)

    // Create output folder if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true })
    }

    // Create an Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Images")

    // Add column headers
    worksheet.columns = [
      { header: "ManufacturerProductNumber", key: "manufacturerProductNumber" },
      { header: "PhotoUrl", key: "photoUrl" },
    ]

    // Loop through JSON data and download images
    for (const item of jsonData) {
      // Check if item has ManufacturerProductNumber and PhotoUrl
      if (!item.ManufacturerProductNumber || !item.PhotoUrl) {
        console.log("Skipping item:", item)
        continue
      }

      const manufacturerProductNumber = item.ManufacturerProductNumber.replace(
        /\//g,
        "-"
      ) // Replace slashes with dashes
      const photoUrl = item.PhotoUrl

      // Construct filename using ManufacturerProductNumber and file extension
      const imageName = `${manufacturerProductNumber}.${photoUrl
        .split(".")
        .pop()}`
      const imagePath = path.join(outputFolder, imageName)

      // Navigate to the page containing the image URL
      await page.goto(`http:${photoUrl}`, { waitUntil: "networkidle0" })

      // Extract image URL from the page
      const imageURL = await page.evaluate(
        () => document.querySelector("img").src
      )

      // Download the image
      const imageBuffer = await page.goto(imageURL)
      fs.writeFileSync(imagePath, await imageBuffer.buffer())

      console.log(`Image downloaded: ${imageName}`)

      // Add data and image to Excel worksheet
      const row = worksheet.addRow({
        manufacturerProductNumber,
        photoUrl,
      })
      const imageId = workbook.addImage({
        filename: imagePath,
        extension: "png",
      })
      worksheet.addImage(imageId, {
        tl: { col: 2, row: row.number },
        ext: { width: 100, height: 100 },
      })
    }

    // Save the Excel workbook
    const excelFilePath = path.join(outputFolder, "images.xlsx")
    await workbook.xlsx.writeFile(excelFilePath)

    // Close Puppeteer
    await browser.close()
    console.log("All images downloaded successfully.")

    console.log(`Excel file created: ${excelFilePath}`)
  } catch (error) {
    console.error("Error downloading images:", error)
  }
}

const jsonFilePath = "./image-json.json" // Path to your JSON file containing URLs
const outputFolder = "downloaded_images" // Output folder to store downloaded images
downloadImagesFromJson(jsonFilePath, outputFolder)
