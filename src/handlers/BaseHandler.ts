import path = require('path');
import express = require('express');
import IServiceContainer = require('./../app_start/other/IServiceContainer');

import Exception = require("../core/exceptions/base");
import NotImplementedException = require("../core/exceptions/NotImplementedException");
import UnauthorizeException = require("../core/exceptions/UnauthorizeException");
import InvalidRequestDataException = require("../core/exceptions/InvalidRequestDataException");

export interface IHandlerRequest
{
}

export interface IHandlerResponse
{
}

export abstract class BaseHandler<In extends IHandlerRequest, Out extends IHandlerResponse>
{
    // <editor-fold desc="fields">
    private _req: express.Request;
    private _res: express.Response;
    private _next: Function;
    // </editor-fold>

    // <editor-fold desc="properties">
    protected get Url(): string
    {
        return this._req.protocol + '://' + this._req.get('Host') + this._req.originalUrl;
    }

    protected get ServiceContainer(): IServiceContainer
    {
        return this._req.app.locals.ServiceContainer;
    }
    

    protected get Query(): any
    {
        return this._req.query;
    }

    constructor(req: express.Request, res: express.Response, next?: Function = null)
    {
        this._req = req;
        this._res = res;
        this._next = next;
    }

    protected abstract prepare(req: express.Request): In;

    protected abstract calc(data: In): Promise<Out>;

    protected abstract success(res: express.Response, data: Out, next?: Function = null): void;

    

    protected renderFile(view: string, options: any): string
    {
        return require('jade').renderFile(this.createViewPath(view), this.createOptions(options));
    }
    // </editor-fold>

  
    private _prepare(): Promise<In>
    {
        return Promise
            .resolve()
            .then(() => {
                return this.prepare(this._req);
            });
    }
    
    private _calc(data: In): Promise<Out>
    {
        return Promise
            .resolve()
            .then(() => {
                return this.calc(data);
            });
    }
    private _success(data: Out): void
    {
        this.success(this._res, data, this._next);
    }
    

   

    private Success(data: Out)
    {
        try
        {
            this._success(data);
        }
        catch (ex)
        {
            this.fatalError(ex);
        }
    }


    private createViewPath(view: string): string
    {
        var viewsDir: string = path.join(path.join(__dirname, '/../'), 'views');
        var viewDir: string = path.join(viewsDir, `${view}.jade`);
        return viewDir;
    }
}