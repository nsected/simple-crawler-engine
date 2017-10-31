import * as URLParse from 'url-parse';
import * as normalizeUrl from 'normalize-url';
//import {checkURL} from '../checkURL';
let uuid = require('../../utils/uuid');
import {BaseDataService} from "../BaseDataService";
const URL = require('url').Url;

//веб-паук
//todo: закрывать страницу фантома от утечек памяти.
//todo: а лучше вообще уйти с фантома
//todo: починить исключения для парсинга
//todo: разнести код по модулям
//todo: разнести код по функциям
//todo: сделать конвеер парсинга
//todo: сделать отображение распарсенных и не распарсенных страниц на графе+
//todo: отображать распарсенные страницы на графе+
//todo: придумать лучшее условие для парсинга
//todo: сделать билд при запуске+

export class WebSpider extends BaseDataService<any>
{
    constructor(public app)
    {
        super(app);
    }
    
    public parseSite(app, phantom, site, protocol, current_url, exeptions?, source?)
    {
        
        return new Promise(function(resolve, reject)
        {
            console.log(exeptions);
            var host = site;
            var pageContent;
            var qb = app.locals.ServiceContainer.QueryBuilder;
            var mongoose = app.locals.ServiceContainer.mongoose;
            var cleanURLs = [];
            var Url = app.locals.ServiceContainer.model.Url;
            var Page = app.locals.ServiceContainer.model.Page;
            var page_data;
            var page_received = false;
            //начинаем парсинг ссылки
            pageProcess(current_url);
            function save_urls(cleanURLs)
            {
                //сохранение ссылок в бд
                console.log('finale urls: ');
                console.log(cleanURLs.length);
                resolve('ok');
                
                cleanURLs.forEach(url =>
                {
                    Url
                        .where('source', current_url)
                        .where('target', url.link)
                        .where('site', host)
                        .then(rows =>
                            {
                                console.log('url exists');
                                if (rows.length === 0)
                                {
                                    Url({
                                        source: current_url,
                                        target: url.link,
                                        create_date: new Date().toISOString(),
                                        update_date: null,
                                        depth: 1,
                                        site: host,
                                        title: url.title
                                    })
                                        .save()
                                        .catch(e =>
                                        {
                                            console.error(e);
                                        });
                                }
                                else
                                {
                                    console.log('url exists')
                                }
                            }
                        )
                        .catch(e =>
                        {
                            console.error(e);
                        });
    
                    //сохранение распарсенных ссылок в качестве нераспарсенных страниц
                    Page
                        .where('url', url.link)
                        .where('site', host)
                        .then(rows =>
                            {
                                
                                if (rows.length === 0)
                                {
                                    Page({
                                        contentType: null,
                                        url: url.link,
                                        redirectURL: null,
                                        create_date:  null,
                                        update_date: null,
                                        status: null,
                                        bodySize: null,
                                        site: host,
                                    })
                                        .save()
                                        .catch(e =>
                                        {
                                            console.error(e);
                                        });
                                }
                                else
                                {
                                    console.log('page exists');
                                    let create_date = rows.create_date || new Date().toISOString();
                                    let query = {
                                        'url': current_url,
                                        'site': host,
                                    };
                                    let update_data = {
                                        contentType: page_data.contentType,
                                        url: current_url,
                                        redirectURL: page_data.redirectURL,
                                        create_date: create_date,
                                        update_date: new Date().toISOString(),
                                        status: page_data.status,
                                        bodySize: page_data.bodySize,
                                        site: host,
                                    };
                                    Page.findOneAndUpdate(
                                        query,
                                        update_data,
                                        {upsert: true},
                                        function(err, doc)
                                        {
                                            console.log("page updated");
                                            console.log(query);
                            
                                        });
                                }
                            }
                        )
                        .catch(e =>
                        {
                            console.error(e);
                        });
                });
                //сохранение страницы
                Page
                    .where('url', current_url)
                    .where('site', host)
                    .then(rows =>
                        {
                            if (rows.length === 0)
                            {
                                Page({
                                    contentType: page_data.contentType,
                                    url: current_url,
                                    redirectURL: page_data.redirectURL,
                                    create_date:  new Date().toISOString(),
                                    update_date: null,
                                    status: page_data.status,
                                    bodySize: page_data.bodySize,
                                    site: host,
                                })
                                    .save()
                                    .catch(e =>
                                    {
                                        console.error(e);
                                    });
                            }
                            else
                            {
                                let create_date = rows.create_date || new Date().toISOString();
                                console.log('!!!!!!!!!!!' + create_date);
                                console.log('page exists');
                                let query = {
                                    'url': current_url,
                                    'site': host,
                                };
                                let update_data = {
                                    contentType: page_data.contentType,
                                    url: current_url,
                                    redirectURL: page_data.redirectURL,
                                    create_date: create_date,
                                    update_date: new Date().toISOString(),
                                    status: page_data.status,
                                    bodySize: page_data.bodySize,
                                    site: host,
                                };
                                Page.findOneAndUpdate(
                                    query,
                                    update_data,
                                    {upsert: true},
                                    function(err, doc)
                                    {
                                        console.log("page updated");
                                        console.log(query);
            
                                    });
                            }
                        }
                    )
                    .catch(e =>
                    {
                        console.error(e);
                    });
                
                //помечаем текущую ссылку как обработанную
                
                let query = {
                    'site': host,
                    'target': current_url,
                    'source': source
                };
                let update_data = {
                    update_date: new Date().toISOString()
                };
                Url.findOneAndUpdate(
                    query,
                    update_data,
                    {upsert: true},
                    function(err, doc)
                    {
                        console.log("url updated");
                        console.log(query);
                        
                    });
            }
            
            function pageProcess(url)
            {
                //начало работы со страницей
                var _url = url;
                var _page;
                phantom
                    .createPage()
                    .then(page =>
                    {
                        console.log('pageProcess');
                        console.log('process ' + protocol + '//' + host + _url);
                        _page = page;
                        _page.on("onResourceReceived", function(resource) {
                            if(new URLParse(resource.url).pathname===_url && page_received !== true){
                                console.log('Resource Received');
                                console.info('code: ', resource);
                                page_data = resource;
                                page_received = true;
                            }
                        });
                        return page.open(protocol + '//' + host + _url)
                            .catch(e =>
                            {
                                console.error(e);
                            });
                    })
                    .then(status =>
                    {
                        
                        //извлекаем ссылки из страницы
                        console.log('load status ' + status);
                        var links = _page.evaluate(function()
                        {
                            return [].map.call(document.querySelectorAll('a'), function(link)
                            {
                                return {link: link.getAttribute('href'), title: link.innerText}
                            });
                        })
                            .then(links =>
                            {
                                return links;
                            })
                            .catch(e =>
                            {
                                console.error(e);
                            });
                        pageContent={};
                        return links;
                    })
                    .then(links =>
                    {
                        //нормализация ссылок
                        //очистка ссылок
                        console.log('URLs to check:');
                        console.log(links);
                        var urls: Array<any> = [];
                        links.forEach((link) =>
                        {
                            var chkdURL = checkURL(link.link, host);
                            
                            if (chkdURL !== false)
                            {
                                //console.log(chkdURL);
                                urls.push({'link': chkdURL, 'title': link.title});
                                
                            }
                        });
                        console.log('cheked urls');
                        console.log(urls);
                        //очистка от дубликатов
                        urls.forEach(function(url) {
                            urls.find(function(found_url){
                                if (url.link === found_url.link){
                                    if (found_url.checked!==1){
                                        cleanURLs.push(found_url)
                                    }
                                    found_url.checked=1;
                                    return true
                                }
                                return false
                            })
                        });
                        console.log('cleaned urls');
                        console.log(cleanURLs);
                        
                        //todo: поправить исключения
                        // var regexp = new RegExp(exeptions.join("|"), 'i');
                        // cleanURLs = cleanURLs.filter((url) =>
                        // {
                        //     return !regexp.test(url.link);
                        // });
                        save_urls(cleanURLs);
                    })
                    .catch(e =>
                    {
                        console.error(e);
                    });
            }
            
            function checkURL(link, host)
            {
                //очистка ссылок
                var _url = new URLParse(link, host);
                
                if (
                    (_url.pathname !== '') &&
                    (_url.hostname == host || _url.hostname == '')
                //&& (_url.protocol == 'http' || 'https')
                )
                {
                    // console.log(_url.pathname);
                    //_url = URLParse(_url.href);
                    return _url.pathname;
                }
                return false
            }
        });
    }
}