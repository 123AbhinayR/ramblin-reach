import {readFile} from "node:fs/promises";
import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {z} from "zod";
test("E02/E03/P17 persisted source-backed sensor path and checklist",async({page})=>{
 const accounts=z.array(z.object({name:z.string(),email:z.string(),password:z.string()})).parse(JSON.parse(await readFile(".tmp/demo-accounts.json","utf8")));const account=accounts.find(a=>a.name==="student");if(!account)throw new Error("Seed required");
 await page.goto("/login");await page.getByLabel("Email address").fill(account.email);await page.getByLabel("Password",{exact:true}).fill(account.password);await page.getByRole("button",{name:"Sign in",exact:true}).click();await expect(page).toHaveURL(/dashboard$/);
 await page.getByRole("button",{name:"Use the sensor example"}).click();await page.getByRole("button",{name:"Build my path",exact:true}).click();await expect(page).toHaveURL(/\/path\/[0-9a-f-]+$/);
 await expect(page.locator(".path-list>li")).toHaveCount(4);await expect(page.getByRole("link",{name:"Official resource"})).toHaveCount(2);await expect(page.getByText("Current availability is unknown.",{exact:false})).toHaveCount(2);
 const checkbox=page.getByRole("checkbox").first();await checkbox.click();await expect(checkbox).toBeChecked();await page.reload();await expect(page.getByRole("checkbox").first()).toBeChecked();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const scan=await new AxeBuilder({page}).analyze();expect(scan.violations.filter(v=>["serious","critical"].includes(v.impact??""))).toEqual([]);
});
