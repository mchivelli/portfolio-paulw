module.exports = {
    apps: [
        {
            name: 'portfolio-frontend',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G'
        },
        {
            name: 'portfolio-backend',
            cwd: './server',
            script: 'npm',
            args: 'run production',
            env: {
                NODE_ENV: 'production',
                PORT: 3001
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G'
        }
    ]
};
