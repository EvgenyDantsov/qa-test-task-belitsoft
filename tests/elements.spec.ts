import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { InteractionsPage } from '../pages/InteractionsPage';
import { ElementsPage } from '../pages/ElementsPage';

test.describe('Elements tab tests', () => {
    let homePage: HomePage;
    let elementsPage: ElementsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        elementsPage = new ElementsPage(page);

        await homePage.goto();
        await homePage.clickElements();
    });

    // ================= TEXT BOX =================
    test.describe('Text Box', () => {
        test.beforeEach(async () => {
            await elementsPage.clickTextBox();
        });

        const validTextBoxData = [
            {
                name: 'Valid data',
                input: {
                    fullName: 'John Doe',
                    email: 'john@example.com',
                    currentAddress: '123 Current St',
                    permanentAddress: '456 Permanent Ave'
                },
                expected: {
                    fullName: 'John Doe',
                    email: 'john@example.com',
                    currentAddress: '123 Current St',
                    permanentAddress: '456 Permanent Ave'
                }
            },
            {
                name: 'Unicode data',
                input: {
                    fullName: 'Иван Иванов',
                    email: 'ivan@example.com',
                    currentAddress: 'ул. Пушкина',
                    permanentAddress: 'ул. Ленина'
                },
                expected: {
                    fullName: 'Иван Иванов',
                    email: 'ivan@example.com',
                    currentAddress: 'ул. Пушкина',
                    permanentAddress: 'ул. Ленина'
                }
            },
            {
                name: 'Empty email',
                input: {
                    fullName: 'John Doe',
                    email: '',
                    currentAddress: '123',
                    permanentAddress: '456'
                },
                expected: {
                    fullName: 'John Doe',
                    currentAddress: '123',
                    permanentAddress: '456'
                }
            },
            {
                name: 'Invalid email',
                input: {
                    fullName: 'John Doe',
                    email: 'invalid-email',
                    currentAddress: '123',
                    permanentAddress: '456'
                },
                expected: {
                    invalidEmail: true
                }
            }
        ];

        for (const data of validTextBoxData) {
            test(`TextBox | ${data.name}`, async () => {
                await elementsPage.submitTextBox(data.input);
                // INVALID CASE
                if (data.expected.invalidEmail) {
                    expect(await elementsPage.isFieldInvalid(elementsPage.emailInput)).toBe(true);
                    return;
                }
                // VALID OUTPUT CASES
                const output = await elementsPage.getTextBoxOutput();

                expect(output.isVisible).toBe(true);
                if (data.expected.fullName) {
                    expect(output.name).toContain(data.expected.fullName);
                }
                if (data.expected.email) {
                    expect(output.email).toContain(data.expected.email);
                }

                if (data.expected.currentAddress) {
                    expect(output.currentAddress).toContain(data.expected.currentAddress);
                }

                if (data.expected.permanentAddress) {
                    expect(output.permanentAddress).toContain(data.expected.permanentAddress);
                }
            });
        }
    });

    // ================= CHECKBOX =================
    test.describe('Check Box', () => {

        test.beforeEach(async () => {
            await elementsPage.clickCheckBox();

            await elementsPage.expandTree('Home');
            await elementsPage.expandTree('Desktop');
            await elementsPage.expandTree('Documents');
            await elementsPage.expandTree('WorkSpace');
        });

        const testData = [
            {
                name: 'Select single item',
                actions: async () => {
                    await elementsPage.clickCheckbox('React');
                },
                expected: ['React']
            },
            {
                name: 'Select parent (Desktop)',
                actions: async () => {
                    await elementsPage.clickCheckbox('Desktop');
                },
                expected: ['Desktop', 'Notes', 'Commands']
            },
            {
                name: 'Select multiple items',
                actions: async () => {
                    await elementsPage.clickCheckbox('React');
                    await elementsPage.clickCheckbox('Angular');
                },
                expected: ['React', 'Angular']
            },
            {
                name: 'Select and unselect item',
                actions: async () => {
                    await elementsPage.clickCheckbox('React');
                    await elementsPage.clickCheckbox('React'); //отменяем выбор
                },
                expected: []
            }
        ];

        for (const data of testData) {
            test(data.name, async () => {

                await data.actions();

                const checkedItems = await elementsPage.getCheckedItems();

                expect(checkedItems.sort()).toEqual(data.expected.sort());
            });
        }
    });

    // ================= RADIO =================
    test.describe('Radio Button', () => {
        test.beforeEach(async () => {
            await elementsPage.clickRadioButton();
        });

        const radioTestData = [
            {
                name: 'Yes',
                action: () => elementsPage.clickYesRadio(),
                expected: 'Yes'
            },
            {
                name: 'Impressive',
                action: () => elementsPage.clickImpressiveRadio(),
                expected: 'Impressive'
            }
        ];

        for (const data of radioTestData) {
            test(data.name, async () => {
                await data.action();
                await expect(elementsPage.successMessage).toContainText(data.expected);
            });
        }
    });

    test.describe('Radio buttons - disabled', () => {

        test('No radio is disabled', async () => {
            await elementsPage.clickRadioButton();
            await expect(elementsPage.noRadio).toBeDisabled();
        });

    });

    // ================= WEB TABLE =================
    test.describe('Web Table', () => {

        test.beforeEach(async () => {
            await elementsPage.clickWebTables();
        });

        const webTableTestData = [
            { firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: '30', salary: '1000', department: 'QA', valid: true },
            { firstName: '', lastName: 'Doe', email: 'john@example.com', age: '30', salary: '1000', department: 'QA', valid: false },
            { firstName: 'Jane', lastName: 'Doe', email: 'invalid', age: '30', salary: '1000', department: 'QA', valid: false }
        ];

        for (const data of webTableTestData) {
            test(`Add record | ${data.firstName || '(empty firstName)'} | valid=${data.valid}`, async () => {
                await elementsPage.clickAddButton();
                await elementsPage.fillRegistrationForm({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    age: data.age,
                    salary: data.salary,
                    department: data.department
                });
                if (data.valid) {
                    const row = elementsPage.getRowByData(data.firstName, data.lastName);
                    await expect(row).toBeVisible({ timeout: 5000 });
                    await expect(row).toContainText(data.firstName);
                    await expect(row).toContainText(data.lastName);
                    await expect(row).toContainText(data.email);
                    await expect(row).toContainText(data.age);
                    await expect(row).toContainText(data.salary);
                    await expect(row).toContainText(data.department);
                } else {
                    await expect(elementsPage.registrationForm).toBeVisible();
                }
            });
        }
        // ========== ТЕСТ ФИЛЬТРАЦИИ ==========
        test('Filter records - should find only matching record', async () => {
            // Создаем запись
            const testFilterData = {
                firstName: 'Filter',
                lastName: 'Test',
                email: 'filter@test.com',
                age: '25',
                salary: '5000',
                department: 'QA'
            };
            await elementsPage.clickAddButton();
            await elementsPage.fillRegistrationForm(testFilterData);

            // Проверяем, что запись добавилась (все проверки в тесте)
            const addedRow = elementsPage.getRowByData(testFilterData.firstName, testFilterData.lastName);
            await expect(addedRow).toBeVisible();
            await expect(addedRow).toContainText(testFilterData.email);

            // Фильтруем
            await elementsPage.searchInTable(testFilterData.firstName);

            // Проверяем результат фильтрации
            const rows = elementsPage.tableRows;
            await expect(rows).toHaveCount(1);
            await expect(rows).toContainText(testFilterData.firstName);
            await expect(rows).toContainText(testFilterData.lastName);
        });
        // // ========== ТЕСТ УДАЛЕНИЯ ==========
        test('Delete record - record should be removed', async () => {
            // Создаем запись
            const testDeleteData = {
                firstName: 'ToDelete',
                lastName: 'User',
                email: 'delete@test.com',
                age: '30',
                salary: '2000',
                department: 'Temp'
            };
            await elementsPage.clickAddButton();
            await elementsPage.fillRegistrationForm(testDeleteData);
            // Проверяем, что запись добавилась
            const row = elementsPage.getRowByData(testDeleteData.firstName, testDeleteData.lastName);
            await expect(row).toBeVisible();

            // Удаляем
            elementsPage.clickDeleteButtonForRow(testDeleteData.firstName, testDeleteData.lastName);

            // Проверяем, что записи нет
            await expect(row).toBeHidden({ timeout: 5000 });
        });
        // // ========== ТЕСТ РЕДАКТИРОВАНИЯ ==========
        test('Edit record - changes should be saved', async () => {
            // Создаем запись
            const originalData = {
                firstName: 'Original',
                lastName: 'Name',
                email: 'original@test.com',
                age: '20',
                salary: '1000',
                department: 'New'
            };

            const updatedData = {
                firstName: 'Updated',
                lastName: 'Changed',
                email: 'updated@test.com',
                age: '99',
                salary: '9999',
                department: 'Changed Dept'
            };
            await elementsPage.clickAddButton();
            await elementsPage.fillRegistrationForm(originalData);

            // Проверяем, что запись добавилась
            const originalRow = elementsPage.getRowByData(originalData.firstName, originalData.lastName);
            await expect(originalRow).toBeVisible();

            // Редактируем
            await elementsPage.clickEditButtonForRow(originalData.firstName, originalData.lastName);
            await expect(elementsPage.registrationForm).toBeVisible();
            await elementsPage.fillRegistrationForm(updatedData);

            // Проверяем измененные данные
            const updatedRow = elementsPage.getRowByData(updatedData.firstName, updatedData.lastName);
            await expect(updatedRow).toBeVisible();
            await expect(updatedRow).toContainText(updatedData.firstName);
            await expect(updatedRow).toContainText(updatedData.lastName);

            // Проверяем, что старых данных нет
            await expect(elementsPage.rowsContainer).not.toContainText(originalData.firstName);
        });
    });

    // ================= BUTTONS =================
    test.describe('Buttons', () => {
        test.beforeEach(async () => {
            await elementsPage.clickButtons();
        });

        for (const btn of [
            { name: 'Double click', action: (page: ElementsPage) => page.doubleClick(), result: (page: ElementsPage) => page.doubleClickMessage, expected: 'You have done a double click' },
            { name: 'Right click', action: (page: ElementsPage) => page.rightClick(), result: (page: ElementsPage) => page.rightClickMessage, expected: 'You have done a right click' },
            { name: 'Dynamic click', action: (page: ElementsPage) => page.dynamicClick(), result: (page: ElementsPage) => page.dynamicClickMessage, expected: 'You have done a dynamic click' }
        ]) {
            test(btn.name, async () => {
                await btn.action(elementsPage);
                if (btn.expected) {
                    await expect(btn.result(elementsPage)).toContainText(btn.expected);
                } else {
                    await expect(btn.result(elementsPage)).toBeVisible();
                }
            });
        }
    });

    // ================= LINKS =================
    test.describe('Links', () => {

        test.beforeEach(async () => {
            await elementsPage.clickLinks();
        });
        const popupLinks = [
            { name: 'Simple link opens new page', locator: (p: ElementsPage) => p.simpleLink, expected: /demoqa/ },
            { name: 'Dynamic link opens new page', locator: (p: ElementsPage) => p.dynamicLink, expected: /demoqa/ }
        ];

        const apiLinks = [
            { name: 'Created link', locator: (p: ElementsPage) => p.createdLink, expected: 'Link has responded with staus 201 and status text Created' },
            { name: 'No Content link', locator: (p: ElementsPage) => p.noContentLink, expected: 'Link has responded with staus 204 and status text No Content' },
            { name: 'Moved link', locator: (p: ElementsPage) => p.movedLink, expected: 'Link has responded with staus 301 and status text Moved Permanently' },
            { name: 'Bad Request link', locator: (p: ElementsPage) => p.badRequestLink, expected: 'Link has responded with staus 400 and status text Bad Request' },
            { name: 'Unauthorized link', locator: (p: ElementsPage) => p.unauthorizedLink, expected: 'Link has responded with staus 401 and status text Unauthorized' },
            { name: 'Forbidden link', locator: (p: ElementsPage) => p.forbiddenLink, expected: 'Link has responded with staus 403 and status text Forbidden' },
            { name: 'Not Found link', locator: (p: ElementsPage) => p.notFoundLink, expected: 'Link has responded with staus 404 and status text Not Found' }
        ];
        // Popup links
        for (const link of popupLinks) {
            test(link.name, async () => {
                const popupPromise = elementsPage.waitForPopup();

                await link.locator(elementsPage).click();

                const newPage = await popupPromise;
                await newPage.waitForLoadState();

                await expect(newPage).toHaveURL(link.expected);
            });
        }

        // API links
        for (const link of apiLinks) {
            test(`${link.name} sends API response`, async () => {
                await link.locator(elementsPage).click();

                await expect(elementsPage.linkResponseOutput).toBeVisible();

                await expect(elementsPage.linkResponseOutput).toContainText(link.expected);
            });
        }
    });

    // Тесты для Dynamic Properties
    test.describe('Dynamic Properties', () => {
        test.beforeEach(async () => {
            await elementsPage.clickDynamicProperties();
        });

        test('Enable After button is disabled initially, then becomes enabled', async () => {
            await expect(elementsPage.enableAfterButton).toBeDisabled();

            // Ждем 5 секунд пока кнопка станет активной
            await expect(elementsPage.enableAfterButton).toBeEnabled({ timeout: 6000 });
        });

        test('Color Change button changes color after click', async () => {
            const initialColor = await elementsPage.colorChangeButton.evaluate((el) => {
                return window.getComputedStyle(el).color;
            });
            await expect(async () => {
                const currentColor = await elementsPage.colorChangeButton.evaluate(el =>
                    window.getComputedStyle(el).color
                );
                expect(currentColor).not.toBe(initialColor);
            }).toPass({ timeout: 6000 });
        });

        test('Visible After button is hidden initially, then becomes visible', async () => {
            await expect(elementsPage.visibleAfterButton).not.toBeVisible();

            // Ждем пока кнопка появится
            await expect(elementsPage.visibleAfterButton).toBeVisible({ timeout: 6000 });
        });
    });
});