/** biome-ignore-all lint/correctness/noUnusedVariables: https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript */

/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  // Note: 'import {} from ""' syntax does not work in .d.ts files.
  interface Locals {
    user: import('better-auth').User | null
    session: import('better-auth').Session | null
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string
  readonly PUBLIC_SERVER_URL: string
  readonly PUBLIC_COS_BASE_URL: string
  readonly PUBLIC_TURNSTILE_SITE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
