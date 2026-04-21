import { Page, Locator } from '@playwright/test';

export class ElementsPage {
    readonly page: Page;

    // Боковое меню - элементы раздела Elements
    readonly textBoxLink: Locator;
    readonly checkBoxLink: Locator;
    readonly radioButtonLink: Locator;
    readonly webTablesLink: Locator;
    readonly buttonsLink: Locator;
    readonly linksLink: Locator;
    readonly dynamicPropertiesLink: Locator;

    // Text Box элементы
    readonly fullNameInput: Locator;
    readonly emailInput: Locator;
    readonly currentAddressInput: Locator;
    readonly permanentAddressInput: Locator;
    readonly submitButton: Locator;
    readonly outputContainer: Locator;
    readonly outputName: Locator;
    readonly outputEmail: Locator;
    readonly outputCurrentAddress: Locator;
    readonly outputPermanentAddress: Locator;

    // Radio Button элементы
    readonly yesRadio: Locator;
    readonly impressiveRadio: Locator;
    readonly noRadio: Locator;
    readonly successMessage: Locator;

    // Web Tables элементы
    readonly addButton: Locator;
    readonly registrationForm: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly userEmailInput: Locator;
    readonly ageInput: Locator;
    readonly salaryInput: Locator;
    readonly departmentInput: Locator;
    readonly submitRegistrationButton: Locator;
    readonly searchInput: Locator;
    readonly rowsContainer: Locator;
    readonly tableRows: Locator;

    // Buttons элементы
    readonly doubleClickButton: Locator;
    readonly rightClickButton: Locator;
    readonly dynamicClickButton: Locator;
    readonly doubleClickMessage: Locator;
    readonly rightClickMessage: Locator;
    readonly dynamicClickMessage: Locator;

    // Links элементы
    readonly createdLink: Locator;
    readonly noContentLink: Locator;
    readonly movedLink: Locator;
    readonly badRequestLink: Locator;
    readonly unauthorizedLink: Locator;
    readonly forbiddenLink: Locator;
    readonly notFoundLink: Locator;
    readonly simpleLink: Locator;
    readonly dynamicLink: Locator;
    readonly linkResponseOutput: Locator;

    // Dynamic Properties элементы
    readonly enableAfterButton: Locator;
    readonly colorChangeButton: Locator;
    readonly visibleAfterButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Локаторы для бокового меню Elements
        this.textBoxLink = page.locator('a[href$="/text-box"]');
        this.checkBoxLink = page.locator('a[href$="/checkbox"]');
        this.radioButtonLink = page.locator('a[href$="/radio-button"]');
        this.webTablesLink = page.locator('a[href$="/webtables"]');
        this.buttonsLink = page.locator('a[href$="/buttons"]');
        this.linksLink = page.locator('a[href$="/links"]');
        this.dynamicPropertiesLink = page.locator('a[href$="/dynamic-properties"]');

        // Локаторы для Text Box
        this.fullNameInput = page.locator('#userName');
        this.emailInput = page.locator('#userEmail');
        this.currentAddressInput = page.locator('#currentAddress');
        this.permanentAddressInput = page.locator('#permanentAddress');
        this.submitButton = page.locator('#submit');
        this.outputContainer = page.locator('#output');
        this.outputName = page.locator('#name');
        this.outputEmail = page.locator('#email');
        this.outputCurrentAddress = this.outputContainer.locator('#currentAddress');
        this.outputPermanentAddress = this.outputContainer.locator('#permanentAddress');

        // Локаторы для Radio Button
        this.yesRadio = page.locator('label[for="yesRadio"]');
        this.impressiveRadio = page.locator('label[for="impressiveRadio"]');
        this.noRadio = page.locator('label[for="noRadio"]');
        this.successMessage = page.locator('.mt-3');

        // Локаторы для Web Tables
        this.addButton = page.locator('#addNewRecordButton');
        this.registrationForm = page.locator('#registration-form-modal');
        this.firstNameInput = page.locator('#firstName');
        this.lastNameInput = page.locator('#lastName');
        this.userEmailInput = page.locator('#userEmail');
        this.ageInput = page.locator('#age');
        this.salaryInput = page.locator('#salary');
        this.departmentInput = page.locator('#department');
        this.submitRegistrationButton = page.locator('#submit');
        this.searchInput = page.locator('#searchBox');
        this.rowsContainer = page.locator('tbody');      
        this.tableRows = page.locator('tbody tr');       

        // Локаторы для Buttons
        this.doubleClickButton = page.locator('#doubleClickBtn');
        this.rightClickButton = page.locator('#rightClickBtn');
        this.dynamicClickButton = page.getByRole('button', { name: 'Click Me', exact: true });
        this.doubleClickMessage = page.locator('#doubleClickMessage');
        this.rightClickMessage = page.locator('#rightClickMessage');
        this.dynamicClickMessage = page.locator('#dynamicClickMessage');

        // Локаторы для Links
        this.createdLink = page.locator('#created');
        this.noContentLink = page.locator('#no-content');
        this.movedLink = page.locator('#moved');
        this.badRequestLink = page.locator('#bad-request');
        this.unauthorizedLink = page.locator('#unauthorized');
        this.forbiddenLink = page.locator('#forbidden');
        this.notFoundLink = page.locator('#invalid-url');
        this.simpleLink = page.locator('#simpleLink');
        this.dynamicLink = page.locator('#dynamicLink');
        this.linkResponseOutput = page.locator('#linkResponse');

        // Локаторы для Dynamic Properties
        this.enableAfterButton = page.locator('#enableAfter');
        this.colorChangeButton = page.locator('#colorChange');
        this.visibleAfterButton = page.locator('#visibleAfter');
    }

    // Методы для навигации по разделам Elements
    async clickTextBox() {
        await this.textBoxLink.click();
    }

    async clickCheckBox() {
        await this.checkBoxLink.click();
    }

    async clickRadioButton() {
        await this.radioButtonLink.click();
    }

    async clickWebTables() {
        await this.webTablesLink.click();
    }

    async clickButtons() {
        await this.buttonsLink.click();
    }

    async clickLinks() {
        await this.linksLink.click();
    }

    async clickDynamicProperties() {
        await this.dynamicPropertiesLink.click();
    }

    // Методы для Text Box
    async submitTextBox(data: { fullName: string; email: string; currentAddress: string; permanentAddress: string; }) {
        await this.fullNameInput.fill(data.fullName);
        await this.emailInput.fill(data.email);
        await this.currentAddressInput.fill(data.currentAddress);
        await this.permanentAddressInput.fill(data.permanentAddress);
        await this.submitTextBoxForm();
    }

    async submitTextBoxForm() {
        await this.submitButton.click();
    }

    // Методы для получения сообщений валидации
    async isFieldInvalid(locator: Locator): Promise<boolean> {
        return locator.evaluate(el => !(el as HTMLInputElement).checkValidity());
    }

    async getTextBoxOutput() {
        return {
            isVisible: await this.outputContainer.isVisible().catch(() => false),

            name: await this.outputName.isVisible()
                ? await this.outputName.textContent()
                : null,

            email: await this.outputEmail.isVisible()
                ? await this.outputEmail.textContent()
                : null,

            currentAddress: await this.outputCurrentAddress.isVisible()
                ? await this.outputCurrentAddress.textContent()
                : null,

            permanentAddress: await this.outputPermanentAddress.isVisible()
                ? await this.outputPermanentAddress.textContent()
                : null
        };
    }
    
    // Методы для Check Box
    getCheckbox(label: string): Locator {
        return this.page.locator(`span.rc-tree-checkbox[aria-label="Select ${label}"]`);
    }

    async clickCheckbox(label: string) {
        await this.getCheckbox(label).click();
    }

    async expandTree(label: string) {
        await this.page
            .locator('[role="treeitem"]')
            .filter({ hasText: label })
            .locator('.rc-tree-switcher')
            .click();
    }

    // получить список названий выбранных чекбоксов
    async getCheckedItems(): Promise<string[]> {
        return (await this.page
            .locator('[role="treeitem"]')
            .filter({ has: this.page.locator('[aria-checked="true"]') })
            .locator('.rc-tree-title')
            .allTextContents()
        ).map(t => t.trim());
    }

    // Методы для Radio Button
    async clickYesRadio() {
        await this.yesRadio.click();
    }

    async clickImpressiveRadio() {
        await this.impressiveRadio.click();
    }

    // Методы для Web Tables
    async clickAddButton() {
        await this.addButton.click();
    }

    async fillRegistrationForm(data: { firstName: string; lastName: string; email: string; age: string; salary: string; department: string; }) {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.userEmailInput.fill(data.email);
        await this.ageInput.fill(data.age);
        await this.salaryInput.fill(data.salary);
        await this.departmentInput.fill(data.department);
        await this.submitRegistrationForm();
    }

    async submitRegistrationForm() {
        await this.submitRegistrationButton.click();
    }

    async searchInTable(searchTerm: string) {
        await this.searchInput.fill(searchTerm);
    }

    getRowByData(firstName: string, lastName: string): Locator {
        // Ищем строку, которая содержит firstName и lastName
        return this.tableRows.filter({
            has: this.page.locator(`td:nth-child(1):has-text("${firstName}")`)
        }).filter({
            has: this.page.locator(`td:nth-child(2):has-text("${lastName}")`)
        });
    }

    async clickEditButtonForRow(firstName: string, lastName: string) {
        const row = this.getRowByData(firstName, lastName);
        const editButton = row.locator('svg').first();
        await editButton.click();
    }

    async clickDeleteButtonForRow(firstName: string, lastName: string) {
        const row = this.getRowByData(firstName, lastName);
        const deleteButton = row.locator('svg').last();
        await deleteButton.click();
    }

    // Методы для Buttons
    async doubleClick() {
        await this.doubleClickButton.dblclick();
    }

    async rightClick() {
        await this.rightClickButton.click({ button: 'right' });
    }

    async dynamicClick() {
        await this.dynamicClickButton.click();
    }

    // Методы для Links
    async waitForPopup() {
        return this.page.waitForEvent('popup');
    }

    async clickCreatedLink() {
        await this.createdLink.click();
    }

    async clickNoContentLink() {
        await this.noContentLink.click();
    }

    async clickMovedLink() {
        await this.movedLink.click();
    }

    async clickBadRequestLink() {
        await this.badRequestLink.click();
    }

    async clickUnauthorizedLink() {
        await this.unauthorizedLink.click();
    }

    async clickForbiddenLink() {
        await this.forbiddenLink.click();
    }

    async clickNotFoundLink() {
        await this.notFoundLink.click();
    }

    async clickSimpleLink() {
        await this.simpleLink.click();
    }

    async clickDynamicLink() {
        await this.dynamicLink.click();
    }
}