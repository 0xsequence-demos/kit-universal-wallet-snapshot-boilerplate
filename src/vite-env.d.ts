/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KIT_ACCESS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
