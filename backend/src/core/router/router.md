# Роутинг в проекте

## Архитектура
Роутер реализован на чистом Node.js без внешних зависимостей. Он поддерживает:
- Динамические параметры в URL (`:id`)
- Wildcard маршруты (`*`)
- Вложенные роутеры (subrouters)
- Middleware на разных уровнях
- Точное и префиксное совпадение маршрутов

## Основные компоненты

### 1. Router (класс)
Центральный класс, управляющий маршрутами.

const router = new Router(basePath?: string, subRouters?: Router[])

Параметры:
- basePath - базовый путь для всех маршрутов роутера (по умолчанию /)
- subRouters - массив вложенных роутеров


### 2. Типы маршрутов
1) Точные маршруты (exact)
Совпадают только полностью:
router.addRoute('GET', '/users', handler, { exact: true })

2) Префиксные маршруты
Совпадают по началу пути:
router.addRoute('GET', '/users', handler) // совпадет с /users, /users/123

3) Динамические параметры
router.addRoute('GET', '/users/:id', handler) // :id будет доступен в params

4) Wildcard маршруты
router.addRoute('GET', '/files/*', handler) // * захватит остаток пути

## Алгоритм работы
1. Инициализация роутеров

- main router
export const router = new Router('/', [authRouter, tasksRouter]);

- tasks subrouter
const tasksRouter = new Router('/tasks');
tasksRouter.addRoute('GET', '/', tasksController.getAllTasks);

2. Нормализация путей
Все пути нормализуются:
Добавляется ведущий слеш
Удаляется завершающий слеш
/tasks/ → /tasks
tasks → /tasks

3. Сбор маршрутов
При добавлении вложенных роутеров пути объединяются:
Базовый путь: /api
Вложенный путь: /users
Результат: /api/users

4. Сортировка маршрутов
Маршруты сортируются по весу (чем выше вес, тем приоритетнее):

- Алгоритм расчета веса:
weight = 0
if (exact) weight += 100
if (!hasWildcard) weight += 50
if (!hasParam) weight += 20
weight += segmentsCount

- Приоритет маршрутов:
Точные маршруты (exact)
Маршруты без wildcard
Маршруты без параметров
Маршруты с большим количеством сегментов

5. Поиск маршрута

handleRequest(req, res) {
  1. Извлечение method и pathname
  2. Поиск маршрута по методу
  3. Сравнение пути с шаблонами:
     - Сначала точные маршруты (exact)
     - Затем префиксные с параметрами
  4. Извлечение параметров из URL
  5. Выполнение middleware
  6. Вызов обработчика
}

6. Middleware chain
graph LR
    A[Request] --> B[beforeMiddlewares]
    B --> C[route middlewares]
    C --> D[handler]
    D --> E[afterMiddlewares]
    E --> F[Response]

Уровни middleware:
- beforeMiddlewares - выполняются до всех маршрутов
- route.options.middleware - специфичные для маршрута
- afterMiddlewares - выполняются после обработчика


