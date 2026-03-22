import { Page, Locator } from '@playwright/test';
export class HomePage {
    readonly page: Page;
    readonly interactionsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.interactionsLink = page.locator('text=Interactions'); // ссылка на раздел Interactions
    }

    async goto() {
        await this.page.goto('https://demoqa.com');
    }

    async clickInteractions() {
        await this.interactionsLink.click();
    }
}