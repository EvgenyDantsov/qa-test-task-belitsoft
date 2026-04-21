import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly interactionsLink: Locator;
    readonly elementsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        
        this.elementsLink = page.locator('a[href="/elements"]');
        this.interactionsLink = page.locator('a[href="/interaction"]');
    }

    async goto() {
        await this.page.goto('https://demoqa.com');
    }

    async clickInteractions() {
        await this.interactionsLink.click({ force: true });
    }

    async clickElements() {
        await this.elementsLink.click({ force: true });
    }
}