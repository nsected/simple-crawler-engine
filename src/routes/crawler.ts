import * as express from 'express';
import * as phantom from 'phantom';
import * as URLParse from 'url-parse';
import * as normalizeUrl from 'normalize-url';
import {checkURL} from '../handlers/checkURL';
//todo: сделать очередь, управление циклом
//todo: запустить цикл
//todo: очистить массив ссылок от дубликатов
//todo: разделить код на модули
//todo: gui для добавления сайта
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next)
{
    var site;
    var host;
    var pageContent;
    var qb = req.app.locals.ServiceContainer.QueryBuilder;
    var parseQueue = [];
    var exeptions = [];

    qb('sites')
        .limit(1)
        .where('to_parse', true)
        .orderBy('priority', 'desc')
        .then((rows)=>
        {
            //получаем сайт для парсинга
            if (rows.length < 1)
            {
                console.log('no sites to parse');
                res.send('no sites to parse');
            }
            else
            {
                console.log(typeof rows[0].init_url.toString());
                exeptions = rows[0].exeptions;
                console.log(exeptions);
                site = rows[0].url;
                host = (new URLParse(normalizeUrl(rows[0].url))).hostname;

                if (rows[0].init_url === '')
                {
                    //получаем ссылку,которая никогда не парсилась
                    qb('urls')
                        .where('site', host)
                        .andWhere('update_date', null)
                        .limit(1)
                        .then((rows)=>
                        {
                            if (rows.length < 1)
                            {
                                console.log('there are no urls to parse');
                                res.send('there are no urls to parse');
                            }
                            else
                            {
                                rows.forEach((item)=>
                                {
                                    parseQueue.push(item.target);
                                });
                                console.log('urls got');
                                console.log(parseQueue.length);
                                parse()
                            }
                        });
                }else{
                    parseQueue.push(rows[0].init_url);
                    console.log('urls got');
                    console.log(parseQueue.length);
                    parse();
                    qb('sites')
                        .where('url', site)
                        .update({'init_url': ''})
                }
            }
        })
        .catch(err=>{
            console.error(err)
        });
    
    //начинаем парсинг ссылки
    function parse()
    {
        var _ph;
        var cleanURLs = [];
        var tasks = [];
        
        phantom
            .create([], {
                logLevel: 'warn',
            })
            .then(ph =>
            {
                //создлаем очередь ссылок для обработки
                _ph = ph;
                var _index = 0;
                var uroboros = function()
                {
                    return new Promise((resolve, reject) =>
                    {
                        console.log('get url' + parseQueue[_index]);
                        pageProcess(parseQueue[_index], resolve)
                        
                    }).then((pageProcess)=>
                    {
                        if (_index < parseQueue.length - 1)
                        {
                            _index++;
                            console.log('get url #' + _index);
                            uroboros();
                        }
                        else
                        {
                            result();
                            return true
                        }
                        console.log("parsed")
                    });
                };
                uroboros();
            })
            .catch(err=>{
                console.error(err)
            });
        
        function result()
        {
            //занесение ссылок в бд
            console.log('finale urls: ');
            console.log(cleanURLs.length);
            res.send('ok');
            _ph.exit();
            cleanURLs.forEach(url=>
            {
                console.log(url);
                qb('urls')
                    .where('site', host)
                    .andWhere('target', url.link)
                    .andWhere('source', parseQueue[0])
                    .then((rows)=>
                    {
                        if (rows.length === 0)
                        {
                            qb.insert({
                                id: uuid(),
                                source: URLParse(parseQueue[0]).pathname,
                                target: url.link,
                                create_date: new Date().toISOString(),
                                depth: 1,
                                site: host,
                                title: url.title
                            })
                                .into('urls')
                                .then(() =>
                                {
                                    console.log('inserted')
                                })
                                .catch((e)=>
                                {
                                    if (e.detail.indexOf('уже существует.') > -1)
                                    {
                                        console.log('url exists')
                                    }
                                    else
                                    {
                                        throw e;
                                    }
                                })
                        }
                    })
                    .catch(err=>{
                        console.error(err)
                    })
            });
            //помечаем текущую ссылку как обработанную
            qb('urls')
                .where('site', host)
                .andWhere('target', parseQueue[0])
                .update({
                    update_date: new Date().toISOString()
                })
                .then(() =>
                {
                    console.log('this url parsed')
                })
                .catch(err=>{
                    console.error(err)
                });
        }
        
        function pageProcess(url, resolve)
        {
            //начало работы со страницей
            var _url = url;
            var _page;
            return _ph.createPage()
                .then(page=>
                {
                    console.log('pageProcess');
                    console.log('process ' + host + _url);
                    _page = page;
                    return page.open('http://' + host + _url);
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
                        .then(links=>
                        {
                            return links;
                        });
                    return links;
                })
                .then(links =>
                {
                    //нормализация ссылок
                    console.log('checkURLs:');
                    console.log(links.length);
                    var urls = [];
                    links.forEach((link)=>
                    {
                        var chkdURL = new checkURL(link.link, host);
                        if (chkdURL)
                        {
                            urls.push({'link': chkdURL, 'title': link.title});
                            
                        }
                    });
                    var uniq = function uniq(a)
                    {
                        return Array.from(new Set(a));
                    };
                    cleanURLs = uniq(urls);
                    var regexp = new RegExp(exeptions.join("|"), 'i');
                    cleanURLs = cleanURLs.filter((url)=>
                    {
                        return !regexp.test(url.link);
                    });
                    
                    console.log('cleanURLs:');
                    console.log(cleanURLs);
                    resolve(true);
                })
                .catch(e => console.log(e));
        }
    }
});

export = router;
