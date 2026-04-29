# Prime Life MVP Roadmap

## Журнал разработки

### 2026-04-30

- [x] На странице задач обновлены фильтры:
  - основные фильтры вынесены кнопками: `Все`, `Сегодня`, `Неделя`, `Месяц`;
  - дополнительные фильтры `Просроченные`, `Завершённые`, `Архив` перенесены в селект `Ещё`;
  - селект `Ещё` подсвечивается активным, если выбран один из дополнительных фильтров.
- [x] Уточнена логика активных задач:
  - во всех активных списках скрываются завершённые и архивные задачи;
  - фильтр `Завершённые` показывает завершённые задачи;
  - фильтр `Архив` показывает архивные задачи;
  - при завершении или архивировании задача сначала зачёркивается, затем с небольшой задержкой пропадает из активного списка.
- [x] Для задач исправлены действия архивации:
  - у активной задачи в меню показывается `Архивировать`;
  - у архивной задачи в меню показывается `Разархивировать`.
- [x] `ModalTask` переведён на новый контракт:
  - теперь принимает `fields` для одного набора полей;
  - либо `fieldSets`, где каждый набор содержит `fields` и конфиг `Fieldset`;
  - старый `bottomFields` убран.
- [x] В `Fieldset` исправлен `DatePicker`: теперь он занимает всю ширину выделенной ячейки формы.
- [x] На странице проектов добавлена работа с задачами проекта:
  - задачи в проекте стали кликабельными;
  - клик открывает модалку редактирования задачи;
  - можно завершать, архивировать, разархивировать и удалять задачи прямо из проекта;
  - можно добавлять существующие задачи в проект через модалку;
  - задача после добавления исчезает из списка выбора и появляется в проекте;
  - можно создать новую задачу прямо из модалки добавления задач в проект.
- [x] На карточке проекта кнопка `+ Добавить задачи` теперь доступна всегда и расположена под списком задач.
- [x] На странице проектов добавлены табы `Активные` и `Архив`:
  - по умолчанию выбраны активные проекты;
  - backend фильтрует проекты по `is_archived`;
  - у архивного проекта в меню показывается `Разархивировать`.
- [x] В модалке создания/редактирования задачи поле `Проект` стало creatable:
  - можно выбрать существующий проект;
  - можно ввести новое название проекта;
  - backend автоматически создаёт проект при сохранении задачи, если проекта с таким названием ещё нет.
- [x] В проектный `.codex/config.toml` добавлена автономность внутри workspace sandbox:
  - `approval_policy = "on-failure"`;
  - `sandbox_mode = "workspace-write"`.
- [x] Проверки, которые запускались после изменений:
  - `cd frontend && npm run typecheck`;
  - `cd backend && npm run build`.

Актуальные незакрытые риски после сегодняшних изменений:

- [ ] `backend/dist` снова изменён после backend build; generated output не должен быть источником ручных правок.
- [ ] `TasksRepository.reorderTasks` всё ещё не реализован.
- [ ] Миграции БД всё ещё не вынесены из runtime `initDatabase`.
- [ ] Dashboard всё ещё требует подключения к реальным данным.
- [ ] Auth всё ещё выглядит как заглушка и требует отдельного решения для MVP.

Дата среза: 2026-04-29.

Цель MVP: получить рабочий личный трекер жизни, где можно вести задачи и проекты, видеть базовый dashboard, сохранять данные в PostgreSQL и уверенно продолжать развитие без потери контекста.

## 1. Что уже реализовано

- [x] Монорепозиторий с пакетами `frontend`, `backend`, `shared`, `docs`.
- [x] Root scripts:
  - `npm run dev` запускает frontend и backend вместе.
  - `npm run frontend:dev` запускает UI.
  - `npm run backend:dev` запускает API.
  - `npm run lint`, `npm run format` запускают проверки/форматирование по пакетам.
- [x] Frontend на React Router 7, React 19, Ant Design 6, Redux Toolkit, React Query, Axios.
- [x] Frontend разложен по FSD-слоям: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
- [x] Подключены базовые frontend providers:
  - Ant Design theme provider.
  - Redux store.
  - React Query client.
  - Theme token observer.
- [x] Реализованы frontend routes:
  - `/` -> `pages/home.tsx`.
  - `/dashboard` -> `pages/dashboard/index.tsx`.
  - `/tasks` -> `pages/tasks/index.tsx`.
  - `/projects` -> `pages/projects/index.tsx`.
- [x] Реализована базовая навигационная оболочка:
  - `widgets/Header`.
  - `widgets/Sidebar`.
  - `widgets/Layouts/rootLayout.tsx`.
  - `widgets/Preloader`.
- [x] Реализована смена темы:
  - `features/theme`.
  - `ThemeToggleButton`.
  - theme state в Redux.
- [x] Реализована frontend entity `task`:
  - типы `Task`, `CreateTaskDto`, `UpdateTaskDto`, `TaskListFilters`.
  - API слой `task-api.ts`.
  - React Query hooks `useTaskList`, `useTask`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`, `useReorderTasks`.
  - UI карточка `TaskCard`.
  - фильтры по периодам `day`, `week`, `month`, `overdue`, `all`.
- [x] Реализован widget `TaskList`:
  - загрузка списка задач.
  - создание задачи.
  - редактирование задачи.
  - удаление задачи.
  - complete/uncomplete.
  - archive/unarchive.
  - drag-and-drop reorder на frontend.
  - модальное окно задачи `ModalTask`.
- [x] Реализована frontend entity `project`:
  - типы `Project`, `CreateProjectDto`, `UpdateProjectDto`, `ProjectListFilters`.
  - API слой `project-api.ts`.
  - React Query hooks `useProjectList`, `useProject`, `useCreateProject`, `useUpdateProject`, `useDeleteProject`.
- [x] Реализована страница проектов:
  - список проектов.
  - создание проекта.
  - редактирование проекта.
  - удаление проекта.
  - archive/unarchive.
  - отображение задач проекта по секциям.
  - модальное окно проекта `ModalProject`.
- [x] Реализована страница задач:
  - использует `TaskList`.
  - есть page-specific content и head controller.
- [x] Реализован dashboard layout:
  - `Progress`.
  - `Statistics`.
  - `FastActions`.
  - `Tasks`.
  - `Projects`.
  - `Habits`.
  - `Finance`.
- [x] Backend на Node.js/TypeScript без Express, с кастомным router.
- [x] Backend entrypoint запускает HTTP server, CORS, Swagger и router.
- [x] Backend подключает PostgreSQL pool.
- [x] Backend при старте создает таблицы через `initDatabase`:
  - `tasks`.
  - `projects`.
  - `update_updated_at_column`.
  - triggers для `updated_at`.
  - перенос уникальных `tasks.project` в `projects`.
- [x] Backend modules:
  - `auth`.
  - `tasks`.
  - `projects`.
- [x] Backend routes для `tasks`:
  - `GET /tasks`.
  - `GET /tasks/:id`.
  - `POST /tasks`.
  - `PUT /tasks/:id/move`.
  - `PUT /tasks/reorder`.
  - `PUT /tasks/:id`.
  - `DELETE /tasks/:id`.
- [x] Backend routes для `projects`:
  - `GET /projects`.
  - `GET /projects/:id`.
  - `POST /projects`.
  - `PUT /projects/:id`.
  - `DELETE /projects/:id`.
- [x] Backend route для `auth`:
  - `GET /auth/login`.
- [x] Backend repository для задач:
  - CRUD.
  - фильтр по периоду.
  - фильтр по проекту.
  - move task через обновление `sort_order`.
- [x] Backend repository для проектов:
  - CRUD.
  - переименование проекта обновляет `tasks.project`.
  - удаление проекта удаляет связанные задачи.
- [x] Есть документация по frontend architecture: `docs/frontend-architecture.md`.

## 2. Что уже начато, но не закончено

- [ ] Backend `TasksRepository.reorderTasks` пока содержит `console.log('todo')`.
- [ ] Frontend endpoint config содержит `tasks.move`, но не содержит отдельный `tasks.reorder`, хотя backend route `PUT /tasks/reorder` уже объявлен.
- [ ] Auth сейчас выглядит как заглушка: на frontend есть auth API/query слой и endpoints `login/register/logout/check`, но backend route реализован только для `GET /auth/login`.
- [ ] Миграции БД как отдельные файлы не обнаружены; схема создается в `backend/src/core/database/init.ts`.
- [ ] `docs/backend-architecture.md` пустой.
- [ ] Dashboard состоит из UI-блоков, но часть блоков, вероятно, работает на статическом content, а не на реальных агрегированных данных.
- [ ] `backend/dist` содержит удаленные/измененные generated files в рабочем дереве; dist не должен быть источником правок.
- [ ] В `initDatabase` есть битая кодировка в console logs. На работу API это не влияет, но стоит поправить при ближайшей чистке.

## 3. MVP scope

- [ ] MVP должен включать только то, что нужно для ежедневного использования:
  - задачи;
  - проекты;
  - базовый dashboard;
  - локальную авторизацию или явное решение, что auth не входит в MVP;
  - стабильную PostgreSQL-схему;
  - документацию запуска и восстановления контекста.
- [ ] Не включать в MVP полноценные финансы, привычки, сложную аналитику, multi-user roles, уведомления и mobile-specific polish, пока не стабилизированы задачи и проекты.

## 4. План работ до MVP

- [ ] Стабилизировать backend persistence.
  - [ ] Перенести создание таблиц из runtime `initDatabase` в нормальные миграции `backend/migrations`.
  - [ ] Оставить `initDatabase` только для подключения/проверки БД или убрать автоматическое изменение схемы при старте.
  - [ ] Добавить миграции для `tasks`, `projects`, triggers `updated_at`, индексов и constraints.
  - [ ] Проверить, что `npm run db:migrate` и `npm run db:rollback` работают на чистой БД.
- [ ] Завершить reorder задач.
  - [ ] Решить, нужен ли один endpoint `PUT /tasks/:id/move` или batch endpoint `PUT /tasks/reorder`.
  - [ ] Удалить неиспользуемый вариант или довести оба до понятного контракта.
  - [ ] Реализовать backend `TasksRepository.reorderTasks` либо убрать route, если frontend использует только `move`.
  - [ ] Проверить drag-and-drop на `/tasks` и в задачах проекта.
- [ ] Довести CRUD задач до MVP-качества.
  - [ ] Проверить создание задачи с обязательным `title`.
  - [ ] Проверить редактирование `title`, `description`, `section`, `project`, `priority`, `deadline`.
  - [ ] Проверить complete/uncomplete.
  - [ ] Проверить archive/unarchive и решить, должны ли архивные задачи скрываться из обычных списков.
  - [ ] Проверить удаление.
  - [ ] Проверить фильтры `day`, `week`, `month`, `overdue`, `all`.
  - [ ] Добавить пустые состояния и понятные ошибки для списка задач.
- [ ] Довести CRUD проектов до MVP-качества.
  - [ ] Проверить создание проекта с уникальным `title`.
  - [ ] Проверить редактирование `title` и `description`.
  - [ ] Проверить, что переименование проекта корректно переносит связанные задачи.
  - [ ] Проверить archive/unarchive и решить, должны ли архивные проекты скрываться из обычных списков.
  - [ ] Проверить удаление проекта и подтвердить желаемое поведение: удалять связанные задачи или отвязывать их.
  - [ ] Добавить пустые состояния и понятные ошибки для списка проектов.
- [ ] Принять решение по auth для MVP.
  - [ ] Вариант A: убрать auth из MVP и не показывать недоступные auth-действия.
  - [ ] Вариант B: сделать простой single-user auth.
  - [ ] Если выбран вариант B, реализовать backend routes `register`, `login`, `logout`, `check`.
  - [ ] Если выбран вариант B, добавить хранение пользователя, password hash, session/JWT и frontend guard.
- [ ] Подключить dashboard к реальным данным.
  - [ ] Показать задачи на сегодня/просроченные/активные.
  - [ ] Показать проекты и прогресс по завершенным задачам.
  - [ ] Оставить habits/finance как disabled/placeholder или убрать из MVP navigation, если нет реального функционала.
  - [ ] Добавить быстрые действия: создать задачу, создать проект.
- [ ] Проверить UX основных сценариев.
  - [ ] Первый запуск с пустой БД.
  - [ ] Создание первой задачи.
  - [ ] Создание первого проекта.
  - [ ] Привязка задачи к проекту.
  - [ ] Работа с дедлайном и просроченными задачами.
  - [ ] Переключение темы.
  - [ ] Обновление страницы без потери данных.
- [ ] Почистить технический долг перед MVP.
  - [ ] Убрать битую кодировку в комментариях/logs там, где она видна разработчику или пользователю.
  - [ ] Убедиться, что generated folders `frontend/build` и `backend/dist` не редактируются вручную и не мешают git status.
  - [ ] Синхронизировать frontend API endpoints с реальными backend routes.
  - [ ] Удалить мертвые комментарии и экспериментальный код, который мешает навигации по проекту.
  - [ ] Заполнить `docs/backend-architecture.md`.
- [ ] Подготовить минимальную документацию запуска.
  - [ ] Обновить `.env.example`.
  - [ ] Описать локальный запуск frontend/backend.
  - [ ] Описать запуск миграций.
  - [ ] Описать минимальный smoke test после запуска.

## 5. Критерии готовности MVP

- [ ] Проект запускается командой `npm run dev`.
- [ ] Backend стартует без ручного создания таблиц вне миграций.
- [ ] Frontend открывает `/dashboard`, `/tasks`, `/projects` без runtime errors.
- [ ] Пользователь может создать, отредактировать, завершить, архивировать, переупорядочить и удалить задачу.
- [ ] Пользователь может создать, отредактировать, архивировать и удалить проект.
- [ ] Пользователь может привязать задачу к проекту и увидеть ее на странице проекта.
- [ ] Dashboard показывает реальные данные по задачам и проектам или явно ограничен только рабочими MVP-блоками.
- [ ] Пустые состояния и ошибки API не ломают интерфейс.
- [ ] `npm run lint` проходит.
- [ ] `cd frontend && npm run typecheck` проходит.
- [ ] `cd backend && npm run build` проходит.

## 6. Рекомендуемый порядок ближайших задач

- [ ] Зафиксировать решение по auth: исключить из MVP или реализовать single-user auth.
- [ ] Сделать миграции БД и убрать ответственность за схему из runtime startup.
- [ ] Завершить reorder задач и синхронизировать frontend/backend endpoints.
- [ ] Пройти вручную CRUD задач и проектов, исправить найденные ошибки.
- [ ] Подключить dashboard к реальным задачам/проектам или убрать недоделанные блоки из MVP.
- [ ] Заполнить backend architecture doc.
- [ ] Прогнать минимальную валидацию: lint, frontend typecheck, backend build.

## 7. Команды проверки

- [ ] `npm run lint`
- [ ] `cd frontend && npm run typecheck`
- [ ] `cd frontend && npm run build`
- [ ] `cd backend && npm run build`
- [ ] `cd backend && npm run db:migrate`
- [ ] `cd backend && npm run db:rollback`

## 8. Рабочие заметки для продолжения

- Текущий фокус разработки: довести задачи и проекты до стабильного CRUD MVP.
- Главный незакрытый backend пункт: миграции и reorder.
- Главный незакрытый frontend пункт: синхронизация API-контрактов, реальные данные dashboard, UX пустых/ошибочных состояний.
- Перед следующей крупной задачей проверить `git status`, потому что сейчас в рабочем дереве есть незакоммиченные изменения в frontend, backend и `docs/project-roadmap-mvp.md`.
