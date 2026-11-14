import {test,expect} from "@playwright/test";
import {isolatedAccounts} from "./isolated-accounts";
test("B1/B2 server affiliation selects student and alumni workspaces",async({page})=>{
 const {studentAccount,helperAccount}=await isolatedAccounts();
 for(const [account,heading] of [[studentAccount,"What’s your next step?"],[helperAccount,"A little experience goes a long way."]] as const){
 await page.goto("/login");await page.getByLabel("Email address").fill(account.email);await page.getByLabel("Password",{exact:true}).fill(account.password);await page.getByRole("button",{name:"Sign in",exact:true}).click();await expect(page.getByRole("heading",{name:heading,exact:true})).toBeVisible();
 if(account===helperAccount){await expect(page.getByRole("heading",{name:"Requests needing attention"})).toBeVisible();await expect(page.getByRole("heading",{name:"How I can help"})).toBeVisible();}else await expect(page.getByRole("heading",{name:"My connections"})).toBeVisible();
 await page.getByRole("button",{name:"Sign out",exact:true}).click();await expect(page).toHaveURL(/login$/);
 }
});
