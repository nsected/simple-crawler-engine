import * as URLParse from 'url-parse';
import * as normalizeUrl from 'normalize-url';
class checkURL
{
    //очистка ссылок
    constructor(public link, host)
    {
        checkURL.check(link, host)
    }
    private static check(link, host)
    {
        //return '/test';
        //проверка валидности ссылки
        
        var _url = new URLParse(link, host);
    
        if (
            (_url.pathname !== '') && (_url.hostname == host || _url.hostname == '')
        //&& (_url.protocol == 'http' || 'https')
        )
        {
            
            _url = URLParse(_url.href);
            return _url;
        }
        return false
    }
}

export {checkURL};



import * as phantom from 'phantom';
phantom
    .create([], {
        logLevel: 'warn',
    })
    .then(ph =>
    {
        ph.createPage()
        .then(page=>
        {
            page.open('http://site');
        })
    });