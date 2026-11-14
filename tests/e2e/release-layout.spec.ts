import {readFile} from "node:fs/promises";
import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {z} from "zod";
test("D2 main workspace pages fit 375/390/768/1440 and pass axe",async({page},testInfo)=>{
 test.setTimeout(120000);
 const accounts=z.array(z.object({name:z.string(),email:z.string(),password:z.string()})).parse(JSON.parse(await readFile(".tmp/demo-accounts.json","utf8")));const account=accounts.find(a=>a.name==="student");if(!account)throw new Error("Seed required");
 await page.goto("/login");await page.getByLabel("Email address").fill(account.email);await page.getByLabel("Password",{exact:true}).fill(account.password);await page.getByRole("button",{name:"Sign in",exact:true}).click();await expect(page).toHaveURL(/dashboard$/);
 for(const path of ["/dashboard","/people","/requests","/profile"]){await page.goto(path);for(const width of [375,390,768,1440]){await page.setViewportSize({width,height:900});await expect(page.getByRole("heading",{level:1})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} at ${width}`).toBe(true);if(width===375||width===1440)await page.screenshot({path:testInfo.outputPath(`${path.slice(1)}-${width}.png`),fullPage:true});}const scan=await new AxeBuilder({page}).analyze();expect(scan.violations.filter(v=>["serious","critical"].includes(v.impact??""))).toEqual([]);}
});
