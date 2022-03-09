module.exports = {
  apps : [
    {
      name: 'api',
      script: 'api/dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      exec_mode: 'cluster_mode',
      node_args: '--es-module-specifier-resolution=node'
    },
    {
      name: 'worker',
      script: 'worker/dist/index.js',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      exec_mode: 'cluster_mode',
      node_args: '--es-module-specifier-resolution=node'
    }
  ]
};
