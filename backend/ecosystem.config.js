module.exports = {
    apps: [
        {
            "name": 'Macsoft SMS API',
            "script": "./src/server.js",
            "watch": '.',
            "max_memory_restart": '512M',
            "env_development": {
                "NODE_ENV": 'development',
                "DATABASE_URL": "mysql://root:Welcome123!@localhost:3306/sms",
                "PORT": 3089,
                "JWT_SECRET_KEY": "mnedwverutterunderramcommandsms", 
            },
            "env_production": {
                "NODE_ENV": 'production',
                "DATABASE_URL": "mysql://root:Welcome123!@localhost:3306/sms",
                "PORT": 3089,
                "JWT_SECRET_KEY": "mnedwverutterunderramcommandsms", 
            }
        }
    ]
};