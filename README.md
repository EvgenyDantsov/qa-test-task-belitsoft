## Описание проекта

В данном проекте реализованы автотесты для проверки функциональности drag-and-drop с использованием Playwright и TypeScript.

## Технологии
- Playwright
- TypeScript
- Node.js
- Page Object Model (POM)

📂 Структура проекта
```text
├── pages/
│   ├── DragabblePage.ts
│   ├── DroppablePage.ts
│   ├── ElementsPage.ts
│   ├── HomePage.ts
│   └── InteractionsPage.ts
│
├── tests/
│   ├── dragabble.spec.ts
│   ├── droppable.spec.ts
│   └── elements.spec.ts
│
├── playwright.config.ts
└── README.md
```
---
## Покрытый функционал
🔹 Страница Draggable
1. Simple
Проверка, что элемент можно перетаскивать
2. Axis Restricted
Проверка ограничения движения:
только по оси X
только по оси Y
3. Container Restricted
Проверка, что элемент:
не выходит за границы контейнера
корректно перемещается внутри:
wrapper контейнера
родительского контейнера
4. Cursor Style
Проверка изменения курсора при перетаскивании:
центр → move
верхний левый угол → crosshair
низ → auto
Дополнительно проверяется, что элемент действительно перемещается
---
🔹 Страница Droppable
1. Simple
Успешный drop
Частичный drop (меньше 50%)
Drop вне зоны (негативный кейс)
2. Accept
Разрешённый элемент — drop срабатывает
Запрещённый элемент — drop не происходит
Комбинированный сценарий (сначала неверный, затем верный)
Граничный случай (частичное попадание)
3. Prevent Propagation
Not Greedy:
drop во внутреннюю зону → срабатывают обе зоны
drop во внешнюю → только внешняя
Greedy:
внутренняя зона перехватывает событие
внешняя зона не реагирует
4. Revert Draggable
Элемент с возвратом возвращается в исходную позицию
Элемент без возврата остаётся в зоне drop
---
🔹 Страница Elements
1. Text Box
Валидные данные — проверка корректного отображения введённых данных в output-блоке
Unicode данные — поддержка кириллицы и спецсимволов
Пустой email — форма отправляется без ошибок, email не отображается в output
Невалидный email — проверка подсветки поля как ошибочного (красная рамка)
2. Check Box
Выбор одного элемента — React
Выбор родительского узла — Desktop (автоматический выбор всех дочерних элементов: Notes, Commands)
Выбор нескольких элементов — React + Angular
Снятие выделения — проверка, что повторный клик убирает галочку

Предварительное раскрытие дерева: Home → Desktop → Documents → WorkSpace
3. Radio Button
Yes — отображение сообщения "Yes"
Impressive — отображение сообщения "Impressive"
No (disabled) — проверка, что кнопка заблокирована и не кликабельна
4. Web Tables
Добавление записи:
Успешное добавление с валидными данными
Пустое имя — форма не отправляется
Невалидный email — форма не отправляется
Поиск (фильтрация):
Проверка, что после поиска отображается только одна соответствующая запись
Удаление записи:
Проверка, что запись исчезает из таблицы после удаления
Редактирование записи:
Изменение всех полей, проверка что старые данные заменены новыми
5. Buttons
Double Click — проверка сообщения "You have done a double click"
Right Click — проверка сообщения "You have done a right click"
Dynamic Click — проверка сообщения "You have done a dynamic click"
6. Links
Ссылки, открывающие новую вкладку:
Simple Link → URL содержит /demoqa
Dynamic Link → URL содержит /demoqa
API-ссылки (без открытия новой вкладки):
Проверка корректных статус-кодов и сообщений:
Created → 201 Created
No Content → 204 No Content
Moved → 301 Moved Permanently
Bad Request → 400 Bad Request
Unauthorized → 401 Unauthorized
Forbidden → 403 Forbidden
Not Found → 404 Not Found
7. Dynamic Properties
Enable After — кнопка становится активной через 5 секунд
Color Change — проверка изменения цвета кнопки с течением времени
Visible After — кнопка появляется через 5 секунд (изначально скрыта)
---
⚙️ Установка и настройка
1. Установка зависимостей
```bash
npm install
```
3. Установка браузеров Playwright
```bash
npx playwright install
```
▶️ Запуск тестов
Запуск всех тестов 
```bash
npx playwright test
```
Запуск конкретного файла
```bash 
npx playwright test tests/droppable.spec.ts
```
Запуск по названию теста
```bash 
npx playwright test -g "Accept Tab"
```
Просмотр отчёта
```bash 
npx playwright show-report
```
---
⚠️ Важно при первом запуске
Убедитесь, что браузеры установлены:
```bash
npx playwright install
```
При падении тестов в headless режиме:
проверьте настройки viewport
Некоторые тесты зависят от координат перетаскивания → важно стабильное разрешение экрана
