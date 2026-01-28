/** biome-ignore-all lint/correctness/noUnusedVariables: https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript */

interface ImportMetaEnv {
  readonly PUBLIC_SERVER_URL: string
  readonly PUBLIC_COS_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
