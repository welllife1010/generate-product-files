/*

1. Retrieve the JSON file containing all data for a specific category.
2. Filter out the manufacturers that are not required.
3. Process the data, retaining only the requested fields and format them appropriately.
4. Write the formatted results to new JSON and CSV files.

*/
const fs = require("fs")
//const jsonexport = require("jsonexport")
const jsonToCsv = require("./convert-csv.js")

async function createNewJsonAndCsv(
  inputJsonFile,
  outputJsonFileName,
  outputCsvFileName,
  additionalParameters,
  voltageNameOne,
  voltageNameTwo = "",
  productCategory,
  productTypes,
  imagePath
) {
  const parametersOfInterest = [
    "Supplier Device Package",
    voltageNameOne,
    voltageNameTwo,
    "Operating Temperature",
  ]

  // TODO - Edit to match WP All Import
  const parameterNameMapping =
    voltageNameTwo !== ""
      ? {
          "Supplier Device Package": "Supplier Device Package",
          [voltageNameOne]: "Voltage",
          [voltageNameTwo]: "Voltage - Supply - Dual (V±)",
          "Operating Temperature": "Operating Temperature",
        }
      : {
          "Supplier Device Package": "Supplier Device Package",
          [voltageNameOne]: "Voltage",
          "Operating Temperature": "Operating Temperature",
        }

  //   const allowedManufacturers = [
  //     "Advanced Micro Devices",
  //     "Altera",
  //     "AMD",
  //     "Analog Devices Inc.",
  //     "Analog Devices Inc./Maxim Integrated",
  //     "Fairchild/ON Semiconductor", //Fairchild
  //     "Fairchild Semiconductor",
  //     "Infineon Technologies",
  //     "Intel",
  //     "Lattice Semiconductor Corporation", //Lattice Semiconductor
  //     "Linear Technology",
  //     "Littlefuse",
  //     "Microchip Technology",
  //     "Molex",
  //     "Nexperia USA Inc.",
  //     "NXP Semiconductors",
  //     "NXP USA Inc.",
  //     "Onsemi",
  //     "Panasonic",
  //     "Panasonic Electronic Components",
  //     "Qualcomm",
  //     "Renesas",
  //     "Renesas Electronics Corporation",
  //     "ROHM Semiconductor",
  //     "Silicon Labs",
  //     "Skyworks Solutions Inc.", // Skyworks
  //     "STMicroelectronics",
  //     "Texas Instruments",
  //     "Xilinx",
  //     "Zilog",
  //   ]

  const newData = inputJsonFile
    //.filter((item) => allowedManufacturers.includes(item.Manufacturer.Name))
    .map((item) => {
      const parameters = {}
      const combinedParameters = [] // Array to store formatted strings of combined parameters

      item.Parameters.forEach((parameter) => {
        if (parametersOfInterest.includes(parameter.ParameterText)) {
          // Use the mapping to get the new key
          const newKey =
            parameterNameMapping[parameter.ParameterText] ||
            parameter.ParameterText
          let valueText = parameter.ValueText

          // Special handling for Operating Temperature
          if (parameter.ParameterText === "Operating Temperature") {
            valueText = valueText
              .replace(/~/g, "-")
              .replace(/¬∞|°/g, "&deg;")
              .replace(/\s*\(T[ACTJ]\)$/, "")
          }

          // Handle Voltage name one
          if (parameter.ParameterText === voltageNameOne) {
            valueText = valueText.replace(/~/g, "-")
          }

          // Handle Voltage name two
          if (parameter.ParameterText === voltageNameTwo) {
            valueText = valueText
              .replace(/~/g, "-")
              .replace(/¬±|±/g, "&plusmn;")
          }

          parameters[newKey] = valueText
        } else if (additionalParameters.includes(parameter.ParameterText)) {
          let formattedParameter = `<strong>${parameter.ParameterText}:</strong> ${parameter.ValueText}`
          combinedParameters.push(formattedParameter)
        }
      })

      // Format the combinedParameters by adding <br /> except for the last item
      const combinedParametersString = combinedParameters
        .map((param, index) => {
          return index < combinedParameters.length - 1
            ? param + "<br />"
            : param
        })
        .join(" ")

      const productType = generateTernaryFunction(productTypes)

      return {
        Part_Number: item.ManufacturerProductNumber, // Part Number
        Slug: formatImageUrl(item.ManufacturerProductNumber), // Slug
        SKU: item.ManufacturerProductNumber, // SKU
        Regular_Price: 0,
        Woo_Product_Type: "simple",
        Categories: productCategory,
        Product_Type: productType(item),
        //post_status: "publish",
        Manufacturer: item.Manufacturer.Name, // Manufacturer
        Product_status: item.ProductStatus.Status,
        Package: item.ProductVariations[0]?.PackageType?.Name || null,
        Additional_Specification: combinedParametersString,
        Quantity: item.ProductVariations[0].QuantityAvailableforPackageType,
        // DataSheet: item.DatasheetUrl,
        Datasheet_URL: `<div class="datasheet-download"><a class="datasheet-download-link" rel="noopener noreferrer" href="${item.DatasheetUrl}" target="_blank" title="${item.ManufacturerProductNumber} | Datasheet">${pdfSvg}</a></div>`,
        //images: item.PhotoUrl,
        images:
          item.PhotoUrl !== null
            ? `https://suntsu-products-s3-bucket.s3.us-west-1.amazonaws.com/${imagePath}/${formatImageUrl(
                item.ManufacturerProductNumber
              )}.${getFileExtensionFromUrl(item.PhotoUrl)}`
            : "https://suntsu-products-s3-bucket.s3.us-west-1.amazonaws.com/media/nophoto.webp",
        Product_Description: item.Description.ProductDescription,
        Detail_Description: item.Description.DetailedDescription?.replace(
          /‚Ñ¢|™/g,
          "&#8482;"
        ).replace(/¬Æ|®/g, "&reg;"),
        RFQ: `<div class="rfq-link-container"><a class="rfq-link" rel="noopener noreferrer" href="/get-a-quote/?part-number1=${item.ManufacturerProductNumber}" target="_blank" title="RFQ - ${item.ManufacturerProductNumber}">Get a Quote</a></div>`,
        ...parameters, // Spread the parameters of interest into the main object
      }
    })

  try {
    // Write the results to a JSON file
    await fs.promises.writeFile(
      outputJsonFileName,
      JSON.stringify(newData, null, 2)
    )
    console.log("JSON file written successfully")

    // Convert to CSV and write to file
    await jsonToCsv(outputJsonFileName, outputCsvFileName)

    console.log(newData.length, "records processed.")
    console.log("Files generated successfully!")
  } catch (error) {
    console.error("Error occurred:", error)
  }
}

function formatImageUrl(imgName) {
  return imgName.replace(/\//g, "-").replace(/\+/g, "%2B").replace(/#/g, "%23")
}

function encodeS3ImageName(fileName) {
  // URI encode the filename to handle special characters
  const encodedFileName = encodeURIComponent(fileName).replace(
    /[!'()*]/g,
    function (c) {
      // RFC 3986 reserves ! ' ( ) * characters, so they need additional encoding
      return "%" + c.charCodeAt(0).toString(16).toUpperCase()
    }
  )
  return encodedFileName
}

// Function to extract file extension from the URL
function getFileExtensionFromUrl(url) {
  const parts = url.split("/")
  const fileName = parts[parts.length - 1]
  const extension = fileName.split(".").pop()
  return extension
}

function generateTernaryFunction(productTypes) {
  let conditions = productTypes.map((type) => {
    return `item.Description.ProductDescription.toLowerCase().includes("${type.toLowerCase()}") ? "${type}"`
  })

  let ternaryString = conditions.join(" : ")
  ternaryString += ' : ""'

  return new Function("item", `return ${ternaryString};`)
}

const pdfSvg = `<svg height="35" width="30" viewBox="0 0 18 19" fill="none" data-svg-icon="icon-alt-pdf"><path d="M16.8667 16.8667C16.8667 17.1672 16.7473 17.4555 16.5347 17.6681C16.3222 17.8806 16.0339 18 15.7333 18H2.13333C1.83275 18 1.54449 17.8806 1.33195 17.6681C1.1194 17.4555 1 17.1672 1 16.8667V2.13333C1 1.83275 1.1194 1.54449 1.33195 1.33195C1.54449 1.1194 1.83275 1 2.13333 1H13.4667C13.7622 1.00003 14.0461 1.11553 14.2577 1.32187L16.5244 3.50013C16.6327 3.60571 16.7188 3.7319 16.7776 3.87126C16.8364 4.01063 16.8667 4.16035 16.8667 4.3116V16.8667Z" stroke="#ff5722" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="m 7.06169,5.6655999 c -0.05387,-0.39074 -0.18457,-0.76694 -0.38458,-1.10689 -0.10186,-0.16897 -0.24427,-0.30984 -0.41434,-0.40984 -0.17006,-0.10001 -0.3624,-0.15599 -0.55957,-0.16287 -0.25111,0.02704 -0.48599,0.13718 -0.66736,0.31293 -0.18137,0.17576 -0.29883,0.40707 -0.33375,0.6572 -0.05626,0.50594 0.07463,1.01497 0.36796,1.43102 0.92435,1.0643 1.91779,2.06657 2.97386,3.00031 C 9.22649,10.34573 10.56456,11.09424 12,11.60048 c 0.39327,0.18366 0.82327,0.27514 1.25726,0.26747 0.2165,-0.0087 0.4249,-0.08469 0.5963,-0.21741 0.1713,-0.13272 0.2969,-0.31555 0.3595,-0.52303 0.0236,-0.17058 0.0023,-0.34437 -0.0618,-0.50419 -0.0642,-0.15981 -0.1689,-0.30011 -0.3039,-0.40701 -0.273,-0.21064 -0.5943,-0.3498401 -0.93465,-0.4049801 -1.35468,-0.19791 -2.7374,-0.05109 -4.02031,0.4268901 -1.22551,0.37777 -4.80684,1.56098 -4.64213,4.5719 0.00453,0.0755 -0.00529,0.5757 0.63995,0.5032 0.26546,-0.0518 0.51725,-0.1582 0.7394,-0.3125 0.22216,-0.1542 0.40982,-0.353 0.55109,-0.5836 0.82582,-1.1658 0.91196,-2.65202 1.02,-4.02789 C 7.36009,8.8154099 7.31335,7.2274199 7.06169,5.6655999 Z" stroke="#ff5722" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`

module.exports = createNewJsonAndCsv
