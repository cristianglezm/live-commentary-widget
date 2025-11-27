import { test, expect } from '@playwright/test';

test.describe('Live Web Commentary Demo App', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('SynergyShark AI (Default)', () => {
    test('should display the main page content correctly', async ({ page }) => {
      // Check for the main heading
      await expect(page.getByRole('heading', { name: 'SynergyShark AI' })).toBeVisible();
      
      // Check for the tagline
      await expect(page.getByText('Monetize Everything. Even Your Soul.')).toBeVisible();

      // Check if the features are present (checking for a specific feature card title)
      await expect(page.getByText('Hyper-Dynamic AI Synergy')).toBeVisible();
      
      // Check for pricing section
      await expect(page.getByRole('heading', { name: 'Our Completely Reasonable Prices' })).toBeVisible();
    });

    test('should show a purchase alert when a pricing CTA is clicked', async ({ page }) => {
      // Find a "Call to Action" button and click it
      const ctaButton = page.getByRole('button', { name: 'Embrace Mediocrity' }).first();
      await ctaButton.click();

      // Check for the success alert
      const alert = page.getByRole('alert');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText('Transaction "Successful"!');
      
      // Wait for the alert to disappear (it has a 4-second timeout in the app)
      await expect(alert).not.toBeVisible({ timeout: 6000 });
    });
  });

  test.describe('InfluencerOS', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'InfluencerOS' }).click();
    });

    test('should display InfluencerOS content', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'InfluencerOS' })).toBeVisible();
      // Use regex to handle text spanning multiple elements or partial matches
      await expect(page.getByText(/Don't just live your life/)).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Invest in Your Vibe' })).toBeVisible();
    });

    test('should show purchase alert', async ({ page }) => {
      const ctaButton = page.getByRole('button', { name: 'Buy Clout' }).first();
      await ctaButton.click();

      const alert = page.getByRole('alert');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText('Clout purchased');
      await expect(alert).not.toBeVisible({ timeout: 6000 });
    });
  });

  test.describe('DefiTofu', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'DefiTofu' }).click();
    });

    test('should display DefiTofu content', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'DefiTofu_DAO' })).toBeVisible();
      await expect(page.getByText(/The world's first decentralized bean curd ecosystem/)).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Tokenomics / Ponzi Scheme' })).toBeVisible();
      await expect(page.getByText(/WARNING: NOT FINANCIAL ADVICE/)).toBeVisible();
    });

    test('should show purchase alert', async ({ page }) => {
      const ctaButton = page.getByRole('button', { name: 'Pump It' }).first();
      await ctaButton.click();

      const alert = page.getByRole('alert');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText('Funds are SAFU');
      await expect(alert).not.toBeVisible({ timeout: 6000 });
    });
  });

  test.describe('Live Commentary Widget', () => {
    test('should be visible on load with initial messages', async ({ page }) => {
      const widget = page.locator('.fixed.top-4.right-4');
      await expect(widget).toBeVisible();
      
      // Check for widget header - Title changes based on the selected persona (SynergyShark is default)
      await expect(widget.getByRole('heading', { name: 'Business Consultant' })).toBeVisible();
      
      // Check for initial system messages - matching LiveCommentary.tsx implementation
      await expect(widget.getByText('Welcome! Click Play to start.')).toBeVisible();
      await expect(widget.getByText('Use the settings icon to configure.')).toBeVisible();

      // Check for initial state
      await expect(widget.getByText('Paused')).toBeVisible();
      await expect(page.getByLabel('Start commentary')).toBeVisible();
    });

    test('should open and close the settings panel', async ({ page }) => {
      const widget = page.locator('.fixed.top-4.right-4');
      
      // Open settings
      await widget.getByLabel('Open settings').click();
      const settingsPanel = widget.locator('.absolute.inset-0');
      await expect(settingsPanel).toBeVisible();
      await expect(settingsPanel.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();

      // Check for setting controls
      await expect(settingsPanel.getByLabel('Server URL')).toBeVisible();
      await expect(settingsPanel.getByLabel('API Key (Optional)')).toBeVisible();
      await expect(settingsPanel.getByLabel('Comment Interval')).toBeVisible();
      await expect(settingsPanel.getByLabel('Creativity')).toBeVisible();
      await expect(settingsPanel.getByLabel('Top-K')).toBeVisible();
      await expect(settingsPanel.getByLabel('Top-P')).toBeVisible();

      // Close settings
      await settingsPanel.getByLabel('Close settings').click();
      await expect(settingsPanel).not.toBeVisible();
    });

    test('should attempt to start capture and show an error if permission is denied', async ({ page }) => {
      // In Playwright, getDisplayMedia prompts for permission which we can't interact with.
      // We expect the call to be rejected by default in a headless environment or result in an error state handling.
      
      const widget = page.locator('.fixed.top-4.right-4');
      
      await widget.getByLabel('Start commentary').click();

      // Check for the error message in the chat
      // Updated regex to match the actual error message "Permission denied or cancelled."
      await expect(widget.getByText(/Permission denied/)).toBeVisible();

      // The widget should still be in a 'Paused' state
      await expect(widget.getByText('Paused')).toBeVisible();
      await expect(widget.getByLabel('Start commentary')).toBeVisible();
    });
  });
});
