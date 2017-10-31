import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
var router = express.Router();
import index = require('../routes/index');
import crawler = require('../routes/crawler');
import {worker} from '../handlers/explorer/worker';

class ApplicationBuilder
{
    static build(app: express.Express, config)
    {
        
        // view engine setup
        app.set('views', path.join(__dirname, '../views/'));
        app.set('view engine', 'jade');
        
        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.set('port', config.Server.Port);
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
    
        
        app.use('/', index);
        app.use('/crawler', crawler);
        // app.get('/worker', function(req, res)
        //     {
        //           new worker(req, res, app);
        //     });
        // catch 404 and forward to error handler
        app.use(function(req, res, next)
        {
            var err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        
        // error handler
        // app.use(function(err, req, res, next)
        // {
        //     // set locals, only providing error in development
        //     res.locals.message = err.message;
        //     res.locals.error = req.app.get('env') === 'development' ? err : {};
        //
        //     // render the error page
        //     res.status(err.status || 500);
        //     res.render('error');
        // });
        new worker(app);
    }
}
export = ApplicationBuilder;
