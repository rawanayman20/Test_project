
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/projects",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-6T4W4YXW.js",
      "chunk-GVE26NUC.js"
    ],
    "route": "/projects"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-I5FRDJ6O.js",
      "chunk-GVE26NUC.js"
    ],
    "route": "/users"
  },
  {
    "renderMode": 2,
    "redirectTo": "/projects",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2527, hash: 'a2acf1a1eb938ed0ceef4aaa73c0e530a42ba737b91f1da95c427055e6b5100c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1504, hash: '1d3548e8e2a89ecc291d747e1486cf86b71476d7b1f2045557ebb8e714010fa3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'projects/index.html': {size: 56323, hash: '69831291e24c84c870dcd4cb8fdf60fa6d32e1d346232f66c9bb33379511b42c', text: () => import('./assets-chunks/projects_index_html.mjs').then(m => m.default)},
    'users/index.html': {size: 55702, hash: 'dc728e613ce971165c16af317573880ddcaef67d6cd311945ccec467b5ff0a22', text: () => import('./assets-chunks/users_index_html.mjs').then(m => m.default)},
    'styles-WXPHTN3O.css': {size: 2008, hash: 'qwpyNrXrDm8', text: () => import('./assets-chunks/styles-WXPHTN3O_css.mjs').then(m => m.default)}
  },
};
