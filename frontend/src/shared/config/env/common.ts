export const envPrefix = 'FRONTEND_';

export const prepareEnv = (env: Record<string, string>) => {
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [key.replace(envPrefix, ''), value])
  );
};
