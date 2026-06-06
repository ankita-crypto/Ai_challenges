interface AppConfig {
  appName: string;
  appVersion: string;
  isDemoMode: boolean;
}

const readStringEnv = (key: keyof ImportMetaEnv, fallback: string): string => {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

export const appConfig: AppConfig = {
  appName: readStringEnv('VITE_APP_NAME', 'ZenStudy'),
  appVersion: readStringEnv('VITE_APP_VERSION', '1.0.0'),
  isDemoMode: import.meta.env.VITE_DEMO_MODE !== 'false'
};
