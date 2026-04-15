import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  appDirectory: 'src',
  async prerender() {
    return ['/', '/tasks'];
  },
} satisfies Config;
