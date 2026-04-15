import fs from 'fs';
import path from 'path';
import React from 'react';
import ruRU from 'antd/locale/ru_RU';
import { App, ConfigProvider, theme, ThemeConfig } from 'antd';
import { extractStyle } from '@ant-design/static-style-extract';

const outputPath = path.join(process.cwd(), 'public', 'antd.min.css');

try {
  console.log('🔄 Генерация статического CSS Ant Design...');

  const themeConfig: ThemeConfig = {
    algorithm: theme.defaultAlgorithm,
  };

  const css = extractStyle((node) => (
    <>
      <ConfigProvider locale={ruRU} componentSize="middle">
        {node}
      </ConfigProvider>
    </>
  ));
  // Создаём папку public, если её нет
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Записываем CSS файл
  fs.writeFileSync(outputPath, css);

  console.log('✅ Ant Design CSS сгенерирован:', outputPath);
  console.log(`📦 Размер файла: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('❌ Ошибка генерации CSS:', error);
  process.exit(1);
}
