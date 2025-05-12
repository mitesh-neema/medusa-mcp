import puppeteer from "puppeteer";
import { z, ZodTypeAny } from "zod";
import { defineTool, InferToolHandlerInput } from "../utils/define-tools";

export default class WebScraperService {
    async getProductPrice(url: string): Promise<any> {
        console.error(`Scraping product price from: ${url}`);
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        try {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            
            // Wait for price elements to be available
            await page.waitForSelector('.product-price', { timeout: 5000 })
                .catch(() => console.error('Price selector not found'));
            
            // Extract price information
            const priceData = await page.evaluate(() => {
                const priceElement = document.querySelector('.product-price');
                if (!priceElement) return null;
                
                const price = priceElement.textContent?.trim();
                
                // Check for discounted price
                const originalPriceElement = document.querySelector('.original-price');
                const originalPrice = originalPriceElement ? originalPriceElement.textContent?.trim() : null;
                
                // Get currency symbol
                const currencySymbol = price?.replace(/[0-9.,]/g, '').trim() || '';
                
                return {
                    price,
                    originalPrice,
                    currencySymbol,
                    isDiscounted: !!originalPrice
                };
            });
            
            // Get product title
            const title = await page.evaluate(() => {
                const titleElement = document.querySelector('h1');
                return titleElement ? titleElement.textContent?.trim() : null;
            });
            
            // Get product image
            const imageUrl = await page.evaluate(() => {
                const imgElement = document.querySelector('.product-image img');
                return imgElement ? imgElement.getAttribute('src') : null;
            });
            
            return {
                url,
                title,
                imageUrl,
                ...priceData,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error(`Error scraping product: ${error}`);
            throw error;
        } finally {
            await browser.close();
        }
    }
    
    defineTool() {
        return defineTool((z) => {
            return {
                name: "get_product_price",
                description: "Extract the price of a product from a given URL",
                inputSchema: {
                    url: z.string().url()
                },
                handler: async (
                    input: InferToolHandlerInput<any, ZodTypeAny>
                ): Promise<any> => {
                    return await this.getProductPrice(input.url);
                }
            };
        });
    }
}
