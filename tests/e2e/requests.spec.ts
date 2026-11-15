import {isolatedAccounts} from "./isolated-accounts";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("E05–E09/E16 full ReachCard request, alumni accept, complete, and private outcome flow", async ({ browser }, testInfo) => {
  test.setTimeout(120000);
  const {studentAccount,helperAccount}=await isolatedAccounts();

  // 1. Student context: log in and send ReachCard to Jordan Mercer (A1)
  const studentContext = await browser.newContext({viewport:testInfo.project.use.viewport,isMobile:testInfo.project.use.isMobile,hasTouch:testInfo.project.use.hasTouch});
  const studentPage = await studentContext.newPage();
  studentPage.on("pageerror", err => console.error("STUDENT PAGE ERROR:", err));
  studentPage.on("console", msg => { if (msg.type() === "error") console.error("STUDENT CONSOLE ERROR:", msg.text()); });

  await studentPage.goto("/login");
  await studentPage.getByLabel("Email address").fill(studentAccount.email);
  await studentPage.getByLabel("Password", { exact: true }).fill(studentAccount.password);
  await studentPage.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(studentPage).toHaveURL(/dashboard$/);

  // Start with an actual owned goal; its company constraint selects the isolated helper.
  await studentPage.getByRole("button", {name:/Build an environmental sensor/}).click();
  await studentPage.getByLabel("Company (optional)").fill(`E2E ${helperAccount.id}`);
  await studentPage.getByRole("button", {name:"Build my path",exact:true}).click();
  await expect(studentPage).toHaveURL(/\/path\/[0-9a-f-]+$/);
  await expect(studentPage.locator(".path-list>li")).toHaveCount(4);

  // Click View profile
  await studentPage.locator(".person-card").filter({has: studentPage.getByRole("heading", {name:"Jordan Mercer"})}).getByRole("link", { name: "View profile" }).click();
  await expect(studentPage).toHaveURL(/\/people\/[0-9a-f-]+/);
  await expect(studentPage.getByRole("heading", { name: "DIY temperature logger" })).toBeVisible();

  // Click Send a ReachCard
  await studentPage.getByRole("link", { name: "Connect" }).click();
  await expect(studentPage).toHaveURL(/\/people\/[0-9a-f-]+\/request/);
  await expect(studentPage.getByRole("heading", { name: /Ask Jordan Mercer/ })).toBeVisible();

  await studentPage.getByLabel("Connection reason").selectOption("Project Feedback");
  // Fill ReachCard form
  const goalContextField = studentPage.getByLabel(/What I.*trying to achieve/);
  await expect(goalContextField).toHaveValue(/environmental sensor/);
  await goalContextField.fill("Building an environmental sensor prototype for Georgia Tech air quality project");

  const questionField = studentPage.getByLabel(/My specific question/);
  await questionField.fill("How do you test sensor calibration accuracy before designing the enclosure?");

  const effortField = studentPage.getByLabel(/What I.*already tried/);
  await effortField.fill("Tested analog reads with breadboard setup; noticed thermal drift after thirty minutes.");

  // ReachReady feedback check
  await expect(studentPage.getByText("ReachReady", { exact: false })).toBeVisible();

  // Accessibility scan on ReachCard page
  const scanReach = await new AxeBuilder({ page: studentPage }).analyze();
  expect(scanReach.violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);

  // Submit ReachCard
  await studentPage.getByRole("button", { name: "Review ReachCard" }).click();
  await studentPage.getByRole("button", { name: "Send ReachCard" }).click();
  await expect(studentPage.getByRole("heading", { name: /Your request is on its way to Jordan Mercer/ })).toBeVisible();

  // Wait for redirect to /requests or navigate directly
  await studentPage.waitForURL(/requests$/, { timeout: 8000 }).catch(async () => {
    await studentPage.goto("/requests");
  });
  await expect(studentPage).toHaveURL(/requests$/);

  // Verify under "Sent"
  await expect(studentPage.getByRole("heading", { name: "Sent" })).toBeVisible();
  await expect(studentPage.getByText("Jordan Mercer")).toBeVisible();
  await expect(studentPage.getByText("Waiting for response")).toBeVisible();

  // 2. Helper context (A1 / Jordan Mercer): log in and check inbox
  const helperContext = await browser.newContext({viewport:testInfo.project.use.viewport,isMobile:testInfo.project.use.isMobile,hasTouch:testInfo.project.use.hasTouch});
  const helperPage = await helperContext.newPage();

  await helperPage.goto("/login");
  await helperPage.getByLabel("Email address").fill(helperAccount.email);
  await helperPage.getByLabel("Password", { exact: true }).fill(helperAccount.password);
  await helperPage.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(helperPage).toHaveURL(/dashboard$/);

  // Helper goes to /requests
  await helperPage.getByRole("navigation", { name: "Workspace", exact: true }).getByRole("link", { name: "Inbox", exact: true }).click();
  await expect(helperPage).toHaveURL(/requests$/);

  // Accessibility scan on Requests inbox
  const scanInbox = await new AxeBuilder({ page: helperPage }).analyze();
  expect(scanInbox.violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);

  // Verify received request from student
  await expect(helperPage.getByRole("heading", { name: "Received" })).toBeVisible();
  await expect(helperPage.getByText("How do you test sensor calibration accuracy before designing the enclosure?")).toBeVisible();

  // Helper accepts the request
  const acceptButton = helperPage.getByRole("button", { name: "Accept" }).first();
  await expect(acceptButton).toBeVisible();
  await acceptButton.click();

  // Verify status updated to Accepted for helper
  await expect(helperPage.getByText("Accepted", { exact: true })).toBeVisible();

  // 3. Student verifies Accepted status, completes conversation and records outcome
  await studentPage.reload();
  await expect(studentPage.getByText("Accepted", { exact: true })).toBeVisible();

  // QR18 persisted participant thread, polling, unread and third-party denial.
  await studentPage.screenshot({path:testInfo.outputPath("inbox-list.png"),fullPage:true});
  await studentPage.getByRole("link",{name:/Open thread with Jordan Mercer/}).click();
  await expect(studentPage).toHaveURL(/\/requests\/[0-9a-f-]+$/);
  const threadUrl=studentPage.url();const requestId=threadUrl.split('/').at(-1)!;
  await studentPage.getByLabel("Reply",{exact:true}).fill("How should I choose a calibration reference for this sensor?");
  await studentPage.getByRole("button",{name:"Send reply",exact:true}).click();
  await expect(helperPage.getByText('· Unread',{exact:true})).toBeVisible({timeout:20000});
  await helperPage.getByRole("link",{name:/Open thread with/}).click();
  await expect(helperPage.getByText("How should I choose a calibration reference for this sensor?",{exact:true})).toBeVisible();
  await helperPage.getByLabel("Reply",{exact:true}).fill("Compare two known reference points and record the drift.");
  await helperPage.getByRole("button",{name:"Send reply",exact:true}).click();
  await expect(studentPage.getByText("Compare two known reference points and record the drift.",{exact:true})).toBeVisible();
  await studentPage.reload();
  await expect(studentPage.getByText("Compare two known reference points and record the drift.",{exact:true})).toBeVisible();
  await studentPage.screenshot({path:testInfo.outputPath("inbox-thread.png"),fullPage:true});
  const threadScan=await new AxeBuilder({page:studentPage}).analyze();
  expect(threadScan.violations.filter(v=>['serious','critical'].includes(v.impact??''))).toEqual([]);
  expect(await studentPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const unrelated=(await isolatedAccounts()).studentAccount;
  const strangerContext=await browser.newContext();const stranger=await strangerContext.newPage();
  await stranger.goto('/login');await stranger.getByLabel('Email address').fill(unrelated.email);await stranger.getByLabel('Password',{exact:true}).fill(unrelated.password);await stranger.getByRole('button',{name:'Sign in',exact:true}).click();await expect(stranger).toHaveURL(/dashboard$/);
  expect((await stranger.request.get(`/api/requests/${requestId}/messages`)).status()).toBe(404);
  expect((await stranger.request.post(`/api/requests/${requestId}/messages`,{headers:{Origin:'http://127.0.0.1:3000'},data:{body:'Foreign access denied',key:crypto.randomUUID()}})).status()).toBe(409);
  await stranger.goto(threadUrl);await expect(stranger.getByText('Compare two known reference points and record the drift.',{exact:true})).toHaveCount(0);
  await strangerContext.close();
  await studentPage.getByRole('button',{name:'Close request',exact:true}).click();
  await expect(studentPage.getByText('This request is closed. Messages are read-only.')).toBeVisible();
  await studentPage.getByRole('link',{name:'← Back to Inbox'}).click();
  await expect(studentPage).toHaveURL(/\/requests$/);
  // Student marks request completed
  const completeButton = studentPage.getByRole("button", { name: "Mark as Complete" }).first();
  await expect(completeButton).toHaveCount(0);
  // Already closed through the thread; the same existing Completed state applies.

  // Verify status is Completed
  await expect(studentPage.getByText("Completed", { exact: true })).toBeVisible();

  // Click "Record outcome"
  await studentPage.getByRole("button", { name: "Record outcome" }).click();
  await expect(studentPage.getByText("Record your outcome · private", {exact:true})).toBeVisible();

  // Select outcome type "Received technical advice"
  await studentPage.getByLabel("What happened?").selectOption({ label: "Received technical advice" });
  await studentPage.getByLabel("Private note").fill("Jordan recommended two calibration reference points and 15 min warm-up cycle.");

  // Save outcome
  await studentPage.getByRole("button", { name: "Save outcome" }).click();

  // Verify outcome is displayed privately
  await expect(studentPage.getByText("Outcome recorded · private")).toBeVisible();
  await expect(studentPage.getByText("Received technical advice")).toBeVisible();

  await studentPage.getByRole("button",{name:"Edit outcome"}).click();
  await expect(studentPage.getByLabel("What happened?")).toHaveValue("technical_advice");
  await expect(studentPage.getByLabel("Private note")).toHaveValue("Jordan recommended two calibration reference points and 15 min warm-up cycle.");

  // Viewport responsive check
  expect(await studentPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await studentPage.screenshot({ path: testInfo.outputPath("requests-student.png"), fullPage: true });
  await helperPage.screenshot({ path: testInfo.outputPath("requests-helper.png"), fullPage: true });

  await studentContext.close();
  await helperContext.close();
});
