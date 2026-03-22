import { Page, Locator } from '@playwright/test';

export class InteractionsPage {
    readonly page: Page;
    readonly droppableLink: Locator;
    readonly draggableLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.droppableLink = page.locator('text=Droppable'); //ссылка на вкладку Droppable
        this.draggableLink = page.locator('text=Dragabble'); //ссылка на вкладку Draggable
    }

    async clickDroppable() {
        await this.droppableLink.click();
    }

    async clickDraggable() {
        await this.draggableLink.click();
    }
}