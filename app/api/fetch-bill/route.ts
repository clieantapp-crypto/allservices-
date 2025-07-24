import { type NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function POST(request: NextRequest) {
  try {
    const { accountNumber, phoneNumber } = await request.json()

    if (!accountNumber || !phoneNumber) {
      return NextResponse.json({ error: "رقم الحساب ورقم الهاتف مطلوبان" }, { status: 400 })
    }

    const billData = await fetchOmanElectricityBill(accountNumber, phoneNumber)

    return NextResponse.json({ billData })
  } catch (error) {
    console.error("Error fetching bill:", error)
    return NextResponse.json({ error: "فشل في جلب الفاتورة. يرجى المحاولة مرة أخرى." }, { status: 500 })
  }
}

async function fetchOmanElectricityBill(accountNumber: string, phoneNumber: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()

  try {
    await page.goto("https://eservice.oifcoman.com/indvidual.aspx", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })

    console.log("✅ Page opened")

    // Select service type "electricity"
    await page.select("#ctl00_ContentPlaceHolder1_ddlServiceType", "1")

    // Enter account number
    await page.type("#ctl00_ContentPlaceHolder1_txtAccountNumber", accountNumber)

    // Wait and enter phone number
    await page.type("#ctl00_ContentPlaceHolder1_txtBillMob", phoneNumber)

    // Click the "Latest Bill" button
    await page.click("#ctl00_ContentPlaceHolder1_ButtonSelectBill")

    console.log("📡 Button pressed, waiting for invoice...")

    // Wait for the iframe to appear
    try {
      await page.waitForSelector("#ctl00_ContentPlaceHolder1_iframeReport", {
        timeout: 15000,
      })

      // Extract the bill URL from the iframe
      const reportUrl = await page.$eval("#ctl00_ContentPlaceHolder1_iframeReport", (el) => el.getAttribute("src"))

      if (reportUrl && reportUrl !== "#") {
        const fullUrl = "https://eservice.oifcoman.com/" + reportUrl
        console.log("✅ Bill URL found:", fullUrl)

        // Try to extract bill information from the page
        // This is a simplified example - you might need to navigate to the iframe content
        // to extract actual bill details

        return {
          accountNumber,
          amount: 25.5, // This should be extracted from the actual bill
          dueDate: new Date().toLocaleDateString("ar-OM"),
          billUrl: fullUrl,
          status: "مستحق الدفع",
        }
      } else {
        throw new Error("لم يتم العثور على رابط الفاتورة. قد لا توجد فاتورة حالية أو رقم الحساب غير صحيح.")
      }
    } catch (waitError) {
      // If iframe doesn't appear, check for error messages
      const errorMessage = await page
        .$eval("#ctl00_ContentPlaceHolder1_lblMessage", (el) => el.textContent)
        .catch(() => null)

      if (errorMessage) {
        throw new Error(errorMessage)
      } else {
        throw new Error("لم يتم العثور على فاتورة لهذا الحساب")
      }
    }
  } catch (err) {
    console.error("❌ Error during execution:", err)
    throw err
  } finally {
    await browser.close()
  }
}
