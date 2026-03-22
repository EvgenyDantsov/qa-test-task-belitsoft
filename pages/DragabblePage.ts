import { Page, Locator, expect } from '@playwright/test';

export class DragabblePage {
    readonly page: Page;

    // Основыне вкладки для Dragabble
    readonly simpleTab: Locator;
    readonly axisRestrictedTab: Locator;
    readonly containerRestrictedTab: Locator;
    readonly cursorStyleTab: Locator;

    // Элемент для вкладки Simple
    readonly simpleDragBox: Locator;

    // Элементы для вкладкиAxis Restricted
    readonly restrictedXBox: Locator;
    readonly restrictedYBox: Locator;

    // Элементы для вкладкиContainer Restricted
    readonly containerWrapperBox: Locator;
    readonly restrictedDragBox: Locator;
    readonly containerParentBox: Locator;
    readonly restrictedParentDragBox: Locator;

    // Элементы для вкладкиCursor Style 
    readonly cursorCenter: Locator;
    readonly cursorTopLeft: Locator;
    readonly cursorBottom: Locator;

    constructor(page: Page) {
        this.page = page;

        // Локаторы для вкладок Dragabble
        this.simpleTab = page.getByRole('tab', { name: 'Simple' });
        this.axisRestrictedTab = page.getByRole('tab', { name: 'Axis Restricted' });
        this.containerRestrictedTab = page.getByRole('tab', { name: 'Container Restricted' });
        this.cursorStyleTab = page.getByRole('tab', { name: 'Cursor Style' });

        // Локатор для вкладки Simple
        this.simpleDragBox = page.locator('#dragBox');

        // Локаторы для вкладки Axis Restricted
        this.restrictedXBox = page.locator('#restrictedX');
        this.restrictedYBox = page.locator('#restrictedY');

        // Локаторы для вкладки Container Restricted
        this.containerWrapperBox = page.locator('#containmentWrapper');
        this.restrictedDragBox = this.containerWrapperBox.locator('.draggable');
        this.containerParentBox = page.locator('#draggableExample-tabpane-containerRestriction > div').last();
        this.restrictedParentDragBox = this.containerParentBox.locator('.ui-draggable-handle');

        // Локаторы для вкладки Cursor Style
        this.cursorCenter = page.locator('#cursorCenter');
        this.cursorTopLeft = page.locator('#cursorTopLeft');
        this.cursorBottom = page.locator('#cursorBottom');
    }

    async clickSimpleTab() {
        await this.simpleTab.click();
    }

    async clickAxisRestrictedTab() {
        await this.axisRestrictedTab.click();
    }

    async clickContainerRestrictedTab() {
        await this.containerRestrictedTab.click();
    }

    async clickCursorStyleTab() {
        await this.cursorStyleTab.click();
    }
    async dragBoxParentContainer(targetX: number, targetY: number) {
        await this.restrictedParentDragBox.dragTo(
            // Задаю координаты относительно контейнера, а не страницы
            this.containerParentBox, { targetPosition: { x: targetX, y: targetY } });
    }

    async dragByOffset(
        element: Locator,
        offsetX: number,
        offsetY: number
    ) {
        const box = await element.boundingBox(); // Получаю реальные координаты элемента на странице
        if (!box) throw new Error('Element not found');

        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();

        // Перемещение относительно начальной позиции
        await this.page.mouse.move(startX + offsetX, startY + offsetY, { steps: 15 });
        await this.page.mouse.up();
    }

    // Отдельный метод для проверки курсора во время перемещения
    async dragAndGetCursor(
        element: Locator,
        moveX: number,
        moveY: number
    ) {
        const box = await element.boundingBox();
        if (!box) throw new Error('Element not found');

        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();

        // Начинаем движение
        await this.page.mouse.move(startX + moveX, startY + moveY);

        // Беру cursor у documtnt.body именно туда браузер применяет стиль курсора во время перемещения бокса
        const cursor = await this.page.evaluate(() =>
            window.getComputedStyle(document.body).cursor
        );

        await this.page.mouse.up();
        return cursor;
    }

    // Получаем текущие координаты бокса
    async getPosition(element: Locator) {
        const box = await element.boundingBox();
        if (!box) throw new Error('Element not found');

        return {
            x: box.x,
            y: box.y
        };
    }

    // Проверяем, изменение положения элемента
    async isPositionChanged(
        element: Locator,
        startPosition: { x: number; y: number }
    ) {
        const end = await this.getPosition(element);

        return (
            Math.abs(end.x - startPosition.x) > 1 ||
            Math.abs(end.y - startPosition.y) > 1
        );
    }

    // Проверяем, что элемент двигался только по оси X
    async isMoveOnlyX(
        element: Locator,
        startPosition: { x: number; y: number }
    ) {
        const end = await this.getPosition(element);

        return (
            Math.abs(end.x - startPosition.x) > 1 &&
            Math.abs(end.y - startPosition.y) <= 1
        );
    }

    // Проверяем, что элемент двигался только по оси Y
    async isMoveOnlyY(
        element: Locator,
        startPosition: { x: number; y: number }
    ) {
        const end = await this.getPosition(element);

        return (
            Math.abs(end.x - startPosition.x) <= 1 &&
            Math.abs(end.y - startPosition.y) > 1
        );
    }

    // Проверяем находится ли элемент внутри контейнера
    async isInsideContainer(
        element: Locator,
        container: Locator
    ) {
        const el = await element.boundingBox();
        const cont = await container.boundingBox();

        if (!el || !cont) throw new Error('Bounding boxes not found');

        const tolerance = 1;

        return (
            el.x + tolerance >= cont.x &&
            el.y + tolerance >= cont.y &&
            el.x + el.width - tolerance <= cont.x + cont.width &&
            el.y + el.height - tolerance <= cont.y + cont.height
        );
    }
}