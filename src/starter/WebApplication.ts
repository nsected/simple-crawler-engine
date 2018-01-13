import ApplicationBuilder = require('./ApplicationBuilder');
import http = require('http');
import * as express from 'express';
import ServiceConfig = require("./ServiceConfig");

export class WebApplication
{
    
    /**
     * Get port from environment and store in Express.
     */
    private _instance: express.Express;
    private port;
    private _config;
    private _server;
    
    constructor(public config)
    {
        this._config = config;
        this.port = this.normalizePort( this._config.Server.Port);
        var app = express();
        this.configure(app);
        this._instance = app;
    }
    
    private configure(app: express.Express)
    {
        ServiceConfig.configure(app, this._config);
        ApplicationBuilder.build(app, this._config);
    }
    
    start()
    {
        var server = http.createServer(this._instance);
        server.listen(this.port);
        server.on('error', this.onError.bind(this));
        server.on('listening', this.onListening.bind(this));
        this._server = server;
    }
    
    /**
     * Normalize a port into a number, string, or false.
     */
    
    private normalizePort(val)
    {
        var port = parseInt(val, 10);
        
        if (isNaN(port))
        {
            // named pipe
            return val;
        }
        
        if (port >= 0)
        {
            // port number
            return port;
        }
        
        return false;
    }
    
    /**
     * Event listener for HTTP server "error" event.
     */
    
    private onError(error)
    {
        if (error.syscall !== 'listen')
        {
            throw error;
        }
    
        if (typeof this.port === 'string')
        {
            var bind = 'Pipe ' + this.port;
        }
        else
        {
            var bind = 'Port ' + this.port;
        }
    
        // handle specific listen errors with friendly messages
        switch (error.code)
        {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    
    /**
     * Event listener for HTTP server "listening" event.
     */
    
    private onListening()
    {
        var addr = this._server.address();
        if (typeof addr === 'string')
        {
            var bind = 'pipe ' + addr;
        }
        else
        {
            var bind = 'port ' + addr.port;
        }
        console.info('Listening on ' + bind);
    }
}