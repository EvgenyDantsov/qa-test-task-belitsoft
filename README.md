## Описание проекта

В данном проекте реализованы автотесты для проверки функциональности drag-and-drop с использованием Playwright и TypeScript.

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
│   ├── HomePage.ts
│   └── InteractionsPage.ts
│
├── tests/
│   ├── dragabble.spec.ts
│   └── droppable.spec.ts
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
