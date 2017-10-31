import * as phantom from 'phantom';
import {WebSpider} from "./webSpider";
var getWorkURL = require('./getWorkData');
//воркер
//todo: адрес, статус, дата парсинга
export class worker
{
    private static app;
    private static phantom;
    
    constructor(_app)
    {
        //создлаем инстанс фантома
        worker.app = _app;
        phantom
            .create(
                [],
                {
                    logLevel: 'DEBUG',
                }
            )
            .then(
                phantom =>
                {
                    //передаем инстанс фантома пауку
                    worker.phantom = phantom;
                    worker.process();
                }
            )
            .catch(
                error =>
                {
                    console.error(error);
                }
            )
        ;
    }
    
    private static process()
    {
        
        let qb = worker.app.locals.ServiceContainer.QueryBuilder;
        let Site = worker.app.locals.ServiceContainer.model.Site;
        let Url = worker.app.locals.ServiceContainer.model.Url;
        
        getWorkURL(qb, Site, Url)
            .then(rows =>
                {
                    if (rows.status == 'idle')
                    {
                        console.log(rows.status);
                        worker.idle();
                    }
                    else
                    {
                        new WebSpider(worker.app)
                            .parseSite(
                                worker.app,
                                this.phantom,
                                rows.site,
                                rows.protocol,
                                rows.current_url,
                                rows.exeptions,
                                rows.source
                            )
                            .then(
                                result =>
                                {
                                    worker.success(result)
                                })
                            .catch(err=>{
                                console.error(err)
                            })
                            
                        ;
                    }
                }
            )
            .catch(err=>{
                console.error(err)
            })
        ;
    }
    
    private static success(result, next?: Function): void
    {
        console.log(result);
        if (result = 'ok')
        {
            worker.process();
        }
        else
        {
            worker.process();
            throw new Error('parsing process error');
        }
    }
    
    private static idle(): void
    {
        console.log('waiting for parse content...');
        setTimeout(function()
            {
                worker.process();
            },
            10000
        );
    }
}