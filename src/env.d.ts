/** biome-ignore-all lint/correctness/noUnusedVariables: https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript */

interface ImportMetaEnv {
  readonly PUBLIC_COS_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
