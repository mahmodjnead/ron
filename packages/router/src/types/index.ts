export interface RonRoute {
  path: string;
  filePath: string;
  layoutPath?: string | undefined;
  permission?: string | undefined;
  isDynamic: boolean;
  params: string[];
  isIndex: boolean;
  isLayout: boolean;
  children?: RonRoute[] | undefined;
}

export interface RonRouterConfig {
  pagesDir: string;
  basePath: string;
  configPath?: string | undefined;
}

export interface RonPageMeta {
  permission?: string | undefined;
  layout?: string | undefined;
  title?: string | undefined;
}
