import {readFile} from "node:fs/promises";
import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {z} from "zod";
test("E04/E10/E11 exact company-city discovery, profile lessons and honest alternatives",async({page},testInfo)=>{
 const accounts=z.array(z.object({name:z.string(),email:z.string(),password:z.string()})).parse(JSON.parse(await readFile(".tmp/demo-accounts.json","utf8")));const account=accounts.find(a=>a.name==="student");if(!account)throw new Error("Seed required");
 await page.goto("/login");await page.getByLabel("Email address").fill(account.email);await page.getByLabel("Password",{exact:true}).fill(account.password);await page.getByRole("button",{name:"Sign in",exact:true}).click();await expect(page).toHaveURL(/dashboard$/);
 await page.getByRole("navigation",{name:"Workspace",exact:true}).getByRole("link",{name:"People",exact:true}).click();await page.getByLabel("Company",{exact:true}).fill("Microsoft");await page.getByRole("combobox",{name:"City",exact:true}).selectOption("Seattle, WA");await page.getByRole("button",{name:"Find Jackets"}).click();await expect(page.locator(".person-card")).toHaveCount(1);await expect(page.getByRole("heading",{name:"Jordan Mercer"})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const scan=await new AxeBuilder({page}).analyze();expect(scan.violations.filter(v=>["serious","critical"].includes(v.impact??""))).toEqual([]);await page.screenshot({path:testInfo.outputPath("people.png"),fullPage:true});
 await page.getByRole("link",{name:"View profile"}).click();await expect(page.getByRole("heading",{name:"DIY temperature logger"})).toBeVisible();await expect(page.getByText("Test calibration against a known reference before designing the enclosure.")).toBeVisible();await expect(page.getByText("Demo profile · fictional person and experience")).toBeVisible();
 await page.goto("/people?company=Unknown&metro=Seattle%2C%20WA");await expect(page.getByRole("heading",{name:"No exact volunteers found."})).toBeVisible();await expect(page.getByRole("heading",{name:"Other Jackets who may help"})).toBeVisible();await expect(page.getByText("Same city; company filter removed. These are not exact company matches.")).toBeVisible();
});
