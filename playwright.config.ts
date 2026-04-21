/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, //false, чтобы тесты выполнялись по очереди
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, //process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    headless: false, //true,   // включаем визуальный режим
    //viewport: { width: 1920, height: 1080 },
    launchOptions: {
           args: ['--start-maximized'], // открытие окна сразу во весь экран
      slowMo: 500,
    },
    actionTimeout: 5000,
    navigationTimeout: 10000,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});