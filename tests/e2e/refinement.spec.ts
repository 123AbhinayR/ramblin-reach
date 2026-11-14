import {readFile} from "node:fs/promises";
import {test,expect} from "@playwright/test";
import {z} from "zod";
test("A1/A2/A4 example discovery and keyboard city search at four widths",async({page})=>{
 const accounts=z.array(z.object({name:z.string(),email:z.string(),password:z.string()})).parse(JSON.parse(await readFile(".tmp/demo-accounts.json","utf8")));const account=accounts.find(a=>a.name==="student");if(!account)throw new Error("Seed required");
 await page.goto("/login");await page.getByLabel("Email address").fill(account.email);await page.getByLabel("Password",{exact:true}).fill(account.password);await page.getByRole("button",{name:"Sign in",exact:true}).click();await expect(page).toHaveURL(/dashboard$/);
 for(const width of [375,390,768,1440]){await page.setViewportSize({width,height:900});await expect(page.locator(".example-chip")).toHaveCount(6);await page.getByRole("button",{name:/Move to a new city/}).click();await expect(page.locator("#goal")).toHaveValue(/Seattle/);await expect(page).toHaveURL(/dashboard$/);expect(await page.evaluate(()=>[...document.querySelectorAll("body *")].filter(el=>el.getBoundingClientRect().right>innerWidth+1 && !el.classList.contains("skip-link")).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent,href:el.getAttribute("href")}))),`overflow at ${width}`).toEqual([]);}
 const city=page.getByRole("combobox",{name:"City (optional)",exact:true});await city.fill("London");await city.press("ArrowDown");await city.press("Enter");await expect(city).toHaveValue("London, UK");await city.fill("Lagos, Nigeria");await city.press("Tab");await expect(page.locator('input[name="metro"]')).toHaveValue("Lagos, Nigeria");
});
