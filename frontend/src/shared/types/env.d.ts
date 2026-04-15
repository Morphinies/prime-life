/// <reference types="vite/client" />

// Опционально: расширьте типы для ваших переменных окружения
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
