//получание ссылки для работы
import * as normalizeUrl from 'normalize-url';
import * as URLParse from 'url-parse';
module.exports = (qb, Site, Url) =>
    //todo: исправить баг при idle состоянии
    //todo: исправить update_date не присваивается
{
    return new Promise(function(resolve, reject)
        {
            var site;
            var host;
            var protocol;
            var pageContent;
            var exeptions = [];
            
            Site
                .find()
                .where('to_parse', true)
                .sort({'priority': -1})
                .limit(1)
                .then(rows =>
                    {
                        //получаем сайт для парсинга
                        console.log(rows);
                        if (rows.length < 1)
                        {
                            console.log('no sites to parse');
                            resolve(
                                {
                                    status: 'idle'
                                }
                            )
                        }
                        else
                        {
                            exeptions = rows[0].exeptions;
                            site = rows[0].url;
                            protocol = (new URLParse(normalizeUrl(rows[0].url))).protocol;
                            host = (new URLParse(normalizeUrl(rows[0].url))).hostname;
                            return true
                        }
                    }
                )
                .then(
                    () =>
                    {
                        //получаем ссылку,которая никогда не парсилась
                        console.log(host);
                        return Url
                            .where('site', host)
                            .where('update_date', null)
                            .limit(1)
                            .then(rows =>
                            {
                                console.log(rows);
                                return rows
                            })
                            .catch(e =>
                                {
                                    console.error(e);
                                }
                            )
                        ;
                    }
                )
                .then(
                    rows =>
                    {
                        console.log(rows);
                        if (rows.length < 1)
                        {
                            //если нет ссылок для парсинга проверяем парсился ли этот сайт
                            //если не парсился - инициализируем первую ссылку для парсинга
                            Url
                                .where('site', host)
                                .where('update_date', null)
                                .limit(1)
                                .then(
                                    rows =>
                                    {
                                        if (rows.length < 1)
                                        {
                                            //инициализируем первую ссылку для парсинга
                                            console.log('setting first url');
                                            resolve(
                                                {
                                                    status: 'ok',
                                                    site: host,
                                                    protocol: protocol,
                                                    current_url: '/',
                                                    source: '/',
                                                    exeptions: []
                                                }
                                            );
                                        }
                                        else
                                        {
                                            console.log('there are no urls to parse');
                                            resolve(
                                                {
                                                    status: 'idle'
                                                }
                                            )
                                        }
                                    }
                                )
                                .catch(
                                    e =>
                                    {
                                        console.error(e);
                                    }
                                )
                        }
                        else
                        {
                            console.log('urls got');
                            resolve(
                                {
                                    status: 'ok',
                                    site: host,
                                    protocol: protocol,
                                    current_url: rows[0].target.toString(),
                                    source: rows[0].source.toString(),
                                    exeptions: exeptions
                                }
                            );
                        }
                    }
                )
                .catch(
                    e =>
                    {
                        console.error(e);
                    }
                )
            ;
        }
    );
};