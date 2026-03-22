import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { InteractionsPage } from '../pages/InteractionsPage';
import { DroppablePage } from '../pages/DroppablePage';

test.describe('Droppable tab tests', () => {
    let homePage: HomePage;
    let interactionPage: InteractionsPage;
    let droppablePage: DroppablePage;

    test.beforeEach(async ({ page }) => {
        // Создаем экземпляры страниц
        homePage = new HomePage(page);
        interactionPage = new InteractionsPage(page);
        droppablePage = new DroppablePage(page);

        // Общие шаги для всех тестов: перейти на вкладку Droppable
        await homePage.goto();
        await homePage.clickInteractions();
        await interactionPage.clickDroppable();
    });

    // Тесты для вкладки Simple
    test.describe('Simple Tab droppable', () => {
        test.beforeEach(async () => {
            await droppablePage.clickSimpleTab(); // открываем Simple перед каждым тестом
        });
        test('Drop into drop box, drop success', async () => {
            await droppablePage.dragSimpleToDrop();
            await expect(droppablePage.simpleDropBox).toHaveText('Dropped!');
        });

        test('Drop less than 50 % into drop box, no drop', async () => {
            // Перетащить на границу drop-box
            await droppablePage.dragByOffset(droppablePage.simpleDragBox, droppablePage.simpleDropBox, -0.25, 0.25);
            await expect(droppablePage.simpleDropBox).not.toHaveText('Dropped!');
        });

        test('Drop outside of the box, no drop', async () => {
            await droppablePage.dragByOffset(droppablePage.simpleDragBox, droppablePage.simpleDropBox, -1, 1);
            await expect(droppablePage.simpleDropBox).not.toHaveText('Dropped!');
        });
    });
    // Тесты для вкладки Accept
    test.describe('Accept Tab', () => {
        test.beforeEach(async () => {
            await droppablePage.clickAcceptTab();
        });
        test('Drop acceptable box into drop box, drop succeeds', async () => {
            await droppablePage.dragAcceptableToDrop();
            await expect(droppablePage.acceptDropBox).toHaveText('Dropped!');
        });

        test('Drop not acceptable box into drop box, not drop', async () => {
            await droppablePage.dragNotAcceptableToDrop();
            await expect(droppablePage.acceptDropBox).not.toHaveText('Dropped!');
        });

        test('Drop not acceptable box then acceptable box into drop box, drop succeeds only for acceptale', async () => {
            // Сначала перетащить "Not Acceptable" — drop не срабатывает
            await droppablePage.dragByOffset(droppablePage.notAcceptableDragBox, droppablePage.acceptDropBox, -0.25, 0.25);
            await expect(droppablePage.acceptDropBox).not.toHaveText('Dropped!');

            // Затем перетащить "Acceptable" — drop срабатывает
            await droppablePage.dragByOffset(droppablePage.acceptableDragBox, droppablePage.acceptDropBox, 0.5, 0.5);
            await expect(droppablePage.acceptDropBox).toHaveText('Dropped!');
        });

        test('Drop acceptable box less than 50% into drop box, no drop', async () => {
            // Перетащить Acceptable частично (менее половины)
            await droppablePage.dragByOffset(droppablePage.acceptableDragBox, droppablePage.acceptDropBox, -0.25, 0.25);
            await expect(droppablePage.acceptDropBox).not.toHaveText('Dropped!');
        });
    });
    // Тесты для вкладки Prevent propagation
    test.describe('Prevent Propagation Tab', () => {
        test.beforeEach(async () => {
            await droppablePage.clickPreventPropogationTab();
        });

        test('Drop into inner not greedy box, updates both inner and outer box', async () => {
            await droppablePage.dragByOffset(droppablePage.preventPropDragBox, droppablePage.innerNotGreedyDropBox, 0.5, 0.5);
            // Проверяем, что inner и outer boxes обновились по логике "Not Greedy"
            await expect(droppablePage.innerNotGreedyDropBox).toHaveText('Dropped!');
            await expect(droppablePage.outerNotGreedyDropBoxText).toHaveText('Dropped!');
        });

        test('Drop into outer not greedy box, updates only outer box', async () => {
            await droppablePage.dragByOffset(droppablePage.preventPropDragBox, droppablePage.outerNotGreedyDropBox, 0.5, 0.13);
            // Проверяем только текст внешнего блока (outer),
            // так как внутри него есть вложенный inner блок,
            // и общий текст контейнера содержит текст обоих элементов
            await expect(droppablePage.outerNotGreedyDropBoxText).toHaveText('Dropped!');
            await expect(droppablePage.innerNotGreedyDropBox).not.toHaveText('Dropped!');
        });

        test('Drop into inner greedy box, updates only inner box', async () => {
            await droppablePage.dragByOffset(droppablePage.preventPropDragBox, droppablePage.innerGreedyDropBox, 0.5, 0.5);
            await expect(droppablePage.innerGreedyDropBox).toHaveText('Dropped!');
            await expect(droppablePage.outerGreedyDropBox).not.toHaveText('Dropped!');
        });

        test('Drop into outer greedy box, updates only outer box', async () => {
            await droppablePage.dragByOffset(droppablePage.preventPropDragBox, droppablePage.outerGreedyDropBox, 0.5, 0.13);
            // Проверяем только текст внешнего блока (outer),
            // так как внутри него есть вложенный inner блок,
            // и общий текст контейнера содержит текст обоих элементов
            await expect(droppablePage.outerGreedyDropBoxText).toHaveText('Dropped!');
            await expect(droppablePage.innerGreedyDropBox).not.toHaveText('Dropped!');
        });
    });

    // Тесты для вкладки Revert draggable
    test.describe('Revert Draggable Tab', () => {
        test.beforeEach(async () => {
            await droppablePage.clickRevertDraggableTab();
        });

        test('Drop revertable box into drop box, drop succeeds and box returns', async () => {
            const startPos = await droppablePage.revertableDragBox.boundingBox();
            await droppablePage.dragByOffset(droppablePage.revertableDragBox, droppablePage.droppableDropBox, 0.5, 0.5);
            // Проверяем, что drop сработал
            await expect(droppablePage.droppableDropBox).toHaveText('Dropped!');
            // Ждём возврата элемента
            await expect.poll(async () => {
                const current = await droppablePage.revertableDragBox.boundingBox();
                return {
                    x: current?.x,
                    y: current?.y
                };
            }).toEqual({
                x: expect.closeTo(startPos!.x, 1),
                y: expect.closeTo(startPos!.y, 1)
            });
        });

        test('Drop not revertable box into drop box, drop succeeds and box stays', async () => {
            const startPosition = await droppablePage.notRevertableDragBox.boundingBox();
            await droppablePage.dragByOffset(droppablePage.notRevertableDragBox, droppablePage.droppableDropBox, 0.5, 0.5);
            await expect(droppablePage.droppableDropBox).toHaveText('Dropped!');
            const endPosition = await droppablePage.notRevertableDragBox.boundingBox();
            // Проверяем, что НЕ вернулся
            expect(endPosition?.x).not.toBeCloseTo(startPosition!.x, 1);
            expect(endPosition?.y).not.toBeCloseTo(startPosition!.y, 1);
        });
    });
});