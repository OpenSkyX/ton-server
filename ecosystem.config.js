module.exports = {
  apps: [
    {
      name: 'ton-pump-server',
      script: 'src/main.js', // 入口文件路径，这里假设编译后的 JavaScript 代码位于 dist/src 目录下的 main.js 文件中
      instances: '1', // 可选，设置进程实例数，可以是max
      exec_mode: 'fork',// 可选，设置执行模式，使用 cluster或fork 模式
      autorestart: true, // 可选，设置自动重启
      watch: false, // 可选，设置监视文件变化并重启
      // max_memory_restart: '1G', // 可选，设置内存阈值，超过阈值时自动重启
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      log_file: 'logs/themisFilServer.log',
      log_type: 'raw',//raw、json、csv、none
      log_max_size: '10M',
      log_rotate: true,
      log_rotations: 7, // 保留最近 7 天的日志
      env: {
        NODE_ENV: 'prod', // 可选，设置环境变量
      },
    },
  ],
};
