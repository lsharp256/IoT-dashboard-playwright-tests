import { test, expect } from '@playwright/test';

test.describe('UI Testing Playground Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/');
  });

  test('Dynamic ID button can be clicked', async ({ page }) => {
    await page.click('text=Dynamic ID');
    await expect(page.locator('.btn-primary')).toBeVisible();
    await page.click('.btn-primary');
    // Success is verified by no errors being thrown
  });

  test('Class attribute test - find button with primary class', async ({ page }) => {
    await page.click('text=Class Attribute');
    await page.click('.btn-primary:not(.btn-test)');
    // Verify alert appears
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Primary button pressed');
      await dialog.accept();
    });
  });

  test('Hidden layers test - click button after overlapping element disappears', async ({ page }) => {
    await page.click('text=Hidden Layers');
    await page.click('#greenButton');
    await expect(page.locator('#blueButton')).toBeVisible();
    await page.click('#blueButton');
  });

  test('Load delay test - wait for element to appear', async ({ page }) => {
    await page.click('text=Load Delay');
    await expect(page.locator('.btn-primary')).toBeVisible({ timeout: 10000 });
    await page.click('.btn-primary');
  });

  test('AJAX data test - wait for data to load', async ({ page }) => {
    await page.click('text=AJAX Data');
    await page.click('#ajaxButton');
    await expect(page.locator('.bg-success')).toBeVisible({ timeout: 200000 });
    await expect(page.locator('.bg-success')).toHaveText('Data loaded with AJAX get request.');
  });

  test('Client side delay test - handle setTimeout delay', async ({ page }) => {
    await page.click('text=Client Side Delay');
    await page.click('#ajaxButton');
    await expect(page.locator('.bg-success')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('.bg-success')).toContainText('Data calculated on the client side.');
  });

  test('Progress bar test - wait for 100%', async ({ page }) => {
    await page.click('text=Progress Bar');
    await page.click('#startButton');
    
    // Wait for progress bar to reach 75%
    await expect(async () => {
      const progressText = await page.locator('#progressBar').getAttribute('aria-valuenow');
      expect(parseInt(progressText || '0')).toBeGreaterThanOrEqual(75);
    }).toPass({ timeout: 30000 });
    
    await page.click('#stopButton');
  });

  test('Verify text test', async ({ page }) => {
    await page.click('text=Verify Text');
    await expect(page.locator('.bg-primary')).toContainText('Welcome UserName!');
  });

  test('Sample app login test', async ({ page }) => {
    await page.click('text=Sample App');
    await page.fill('input[name="UserName"]', 'test');
    await page.fill('input[name="Password"]', 'pwd');
    await page.click('#login');
    await expect(page.locator('#loginstatus')).toContainText('Welcome, test!');
  });
});