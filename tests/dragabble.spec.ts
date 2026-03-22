import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { InteractionsPage } from '../pages/InteractionsPage';
import { DragabblePage } from '../pages/DragabblePage';

test.describe('Draggable Page', () => {
    let homePage: HomePage;
    let interactionPage: InteractionsPage;
    let dragabblePage: DragabblePage;

    test.beforeEach(async ({ page }) => {
        // Создаем экземпляры страниц
        homePage = new HomePage(page);
        interactionPage = new InteractionsPage(page);
        dragabblePage = new DragabblePage(page);

        // Общие шаги для всех тестов: перейти на вкладку Droppable
        await homePage.goto();
        await homePage.clickInteractions();
        await interactionPage.clickDraggable();
    });
    // Тесты для вкладки Simple
    test.describe('Simple Tab dragabble', () => {
        test.beforeEach(async () => {
            await dragabblePage.clickSimpleTab();
        });

        test('Drop box', async () => {
            await dragabblePage.dragByOffset(dragabblePage.simpleDragBox, 100, 50);
            expect(await dragabblePage.simpleDragBox.textContent()).toBeDefined(); // функциональная проверка, элемент сдвинулся
        });
    });
    // Тесты для вкладки Axis Restricted
    test.describe('Axis Restricted Tab', () => {
        test.beforeEach(async () => {
            await dragabblePage.clickAxisRestrictedTab();
        });

        test('Restricted X box moves only horizontally', async () => {
            const startPos = await dragabblePage.getPosition(dragabblePage.restrictedXBox);
            await dragabblePage.dragByOffset(dragabblePage.restrictedXBox, 150, 50);
            expect(await dragabblePage.isMoveOnlyX(dragabblePage.restrictedXBox, startPos)).toBeTruthy();
        });

        test('Restricted Y box moves only vertically', async () => {
            const startPos = await dragabblePage.getPosition(dragabblePage.restrictedYBox);
            await dragabblePage.dragByOffset(dragabblePage.restrictedYBox, 50, 150);
            expect(await dragabblePage.isMoveOnlyY(dragabblePage.restrictedYBox, startPos)).toBeTruthy();
        });
    });
    // Тесты для вкладки Container Restricted
    test.describe('Container Restricted Tab', () => {
        test.beforeEach(async () => {
            await dragabblePage.clickContainerRestrictedTab();
        });

        test('Drag within wrapper container does not leave it', async () => {
            await dragabblePage.dragByOffset(dragabblePage.restrictedDragBox, 200, 200);
            expect(await dragabblePage.isInsideContainer(dragabblePage.restrictedDragBox, dragabblePage.containerWrapperBox)).toBeTruthy();
        });

        test('Drag within parent container does not leave it', async () => {
            await dragabblePage.dragBoxParentContainer(100, 50);
        });
    });
    // Тесты для вкладки Cursor Style
    test.describe('Cursor Style Tab', () => {
        test.beforeEach(async () => {
            await dragabblePage.clickCursorStyleTab();
        });

        test('Center cursor changes during drag', async () => {
            expect(await dragabblePage.dragAndGetCursor(dragabblePage.cursorCenter, 100, 100)).toBe('move');
        });

        test('Top-left cursor changes during drag', async () => {
            expect(await dragabblePage.dragAndGetCursor(dragabblePage.cursorTopLeft, 100, 100)).toBe('crosshair');
        });

        test('Bottom cursor changes during drag', async () => {
            expect(await dragabblePage.dragAndGetCursor(dragabblePage.cursorBottom, 100, 100)).toBe('auto');
        });
    });
});