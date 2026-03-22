import { Page, Locator } from '@playwright/test';

export class DroppablePage {
    readonly page: Page;

    // Основные вкладки на Droppable
    readonly simpleTab: Locator;
    readonly acceptableTab: Locator;
    readonly preventPropogationTab: Locator;
    readonly revertDraggableTab: Locator;

    // Элементы для вкладки Simple
    readonly simpleTabContainer: Locator;
    readonly simpleDragBox: Locator;
    readonly simpleDropBox: Locator;

    // Элементы для вкладки Accept
    readonly acceptableTabContainer: Locator;
    readonly acceptableDragBox: Locator;
    readonly notAcceptableDragBox: Locator;
    readonly acceptDropBox: Locator;

    // Элементы для вкладки Prevent Propagation
    readonly preventPropTabContainer: Locator;
    readonly preventPropDragBox: Locator;
    readonly outerNotGreedyDropBox: Locator;
    readonly outerNotGreedyDropBoxText: Locator;
    readonly innerNotGreedyDropBox: Locator;
    readonly outerGreedyDropBox: Locator;
    readonly outerGreedyDropBoxText: Locator;
    readonly innerGreedyDropBox: Locator;

    // Элементы для вкладыки Revert Draggable
    readonly revertableTabContainer: Locator;
    readonly revertableDragBox: Locator;
    readonly notRevertableDragBox: Locator;
    readonly droppableDropBox: Locator;
    constructor(page: Page) {
        this.page = page;

        // Локаторы для вкладок Droppable
        this.simpleTab = page.getByRole('tab', { name: 'Simple' });
        this.acceptableTab = page.getByRole('tab', { name: 'Accept' });
        this.preventPropogationTab = page.getByRole('tab', { name: 'Prevent Propogation' });
        this.revertDraggableTab = page.getByRole('tab', { name: 'Revert Draggable' });

        // Локаторы для вкладки Simple
        this.simpleTabContainer = page.locator('#droppableExample-tabpane-simple');
        this.simpleDragBox = this.simpleTabContainer.locator('#draggable'); // Элемент для перетаскивания
        this.simpleDropBox = this.simpleTabContainer.locator('#droppable'); // Зона для drop

        // Локаторы для вкладки Accept
        this.acceptableTabContainer = page.locator('#droppableExample-tabpane-accept');
        this.acceptableDragBox = this.acceptableTabContainer.locator('#acceptable'); // Элемент для перетаскивания
        this.notAcceptableDragBox = this.acceptableTabContainer.getByText('Not Acceptable'); // Элемент для перетаскивания
        this.acceptDropBox = this.acceptableTabContainer.locator('.drop-box'); // Общая зона для drop

        // Локаторы для вкладки Prevent Propagation
        this.preventPropTabContainer = page.locator('#droppableExample-tabpane-preventPropogation');
        this.preventPropDragBox = this.preventPropTabContainer.locator('#dragBox'); // Элемент для перетаскивания
        this.outerNotGreedyDropBox = this.preventPropTabContainer.locator('#notGreedyDropBox'); // Внешняя зона "Not Greedy"
        this.outerNotGreedyDropBoxText = this.outerNotGreedyDropBox.locator('> p'); // Текст на внешней зоне "Not Greedy"
        this.innerNotGreedyDropBox = this.preventPropTabContainer.locator('#notGreedyInnerDropBox'); // Внутренняя зона "Not Greedy"
        this.outerGreedyDropBox = this.preventPropTabContainer.locator('#greedyDropBox'); // Внешняя зона "Greedy"
        this.outerGreedyDropBoxText = this.outerGreedyDropBox.locator('> p'); // Текст на внешней зоне "Greedy"
        this.innerGreedyDropBox = this.preventPropTabContainer.locator('#greedyDropBoxInner'); // Внутренняя зона "Greedy"

        // Локаторы для вкладки Revert Draggable
        this.revertableTabContainer = page.locator('#droppableExample-tabpane-revertable');
        this.revertableDragBox = this.revertableTabContainer.locator('#revertable'); // Элемент, который возвращается на исходную позицию после перемещения
        this.notRevertableDragBox = this.revertableTabContainer.locator('#notRevertable'); // Элемент, который не возвращается после перемещения
        this.droppableDropBox = this.revertableTabContainer.locator('#droppable'); // Общая зона для drop
    }

    async clickSimpleTab() {
        await this.simpleTab.click();
    }

    async clickAcceptTab() {
        await this.acceptableTab.click();
    }
    async clickPreventPropogationTab() {
        await this.preventPropogationTab.click();
    }
    async clickRevertDraggableTab() {
        await this.revertDraggableTab.click();
    }
    // Метод для Simple
    async dragSimpleToDrop() {
        await this.simpleDragBox.dragTo(this.simpleDropBox);
    }

    // Методы для Accept
    async dragAcceptableToDrop() {
        await this.acceptableDragBox.dragTo(this.acceptDropBox);
    }

    async dragNotAcceptableToDrop() {
        await this.notAcceptableDragBox.dragTo(this.acceptDropBox);
    }

    // Методы для Prevent Propagation
    async dragToOuterNotGreedy() {
        await this.preventPropDragBox.dragTo(this.outerNotGreedyDropBox);
    }

    async dragToInnerNotGreedy() {
        await this.preventPropDragBox.dragTo(this.innerNotGreedyDropBox);
    }

    async dragToOuterGreedy() {
        await this.preventPropDragBox.dragTo(this.outerGreedyDropBox);
    }

    async dragToInnerGreedy() {
        await this.preventPropDragBox.dragTo(this.innerGreedyDropBox);
    }

    // Методы для Revert Draggable
    async dragRevertableToDrop() {
        await this.revertableDragBox.dragTo(this.droppableDropBox);
    }

    async dragNotRevertableToDrop() {
        await this.notRevertableDragBox.dragTo(this.droppableDropBox);
    }

    async dragByOffset(
        dragBox: Locator,
        dropBox: Locator,
        offsetX: number,
        offsetY: number
    ) {
        // Получаем координаты dragBox и dropBox
        const dragBoxBound = await dragBox.boundingBox();
        const dropBoxBound = await dropBox.boundingBox();
        if (!dragBoxBound || !dropBoxBound) throw new Error('Bounding boxes not found');
        // Получаем координаты dragBox и dropBox
        const dragStartX = dragBoxBound.x + dragBoxBound.width / 2;
        const dragStartY = dragBoxBound.y + dragBoxBound.height / 2;
        // Вычисляем центр dragBox — точка, с которой начнется перетаскивание
        const targetX = dropBoxBound.x + dropBoxBound.width * offsetX;
        const targetY = dropBoxBound.y + dropBoxBound.height * offsetY;
        // Перемещаем мышь к dragBox, опускаем, двигаем к target и отпускаем
        await this.page.mouse.move(dragStartX, dragStartY);
        await this.page.mouse.down();
        await this.page.mouse.move(targetX, targetY, { steps: 15 }); // steps — плавность перемещения
        await this.page.mouse.up();
    }
}