// Site estático (GitHub Pages). Em produção o site fica em /<repositório>, por isso o basePath
// vem de NEXT_PUBLIC_BASE_PATH (ex.: "/Paradigmas"); no computador fica vazio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};
