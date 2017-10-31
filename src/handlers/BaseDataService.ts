import * as Knex from "knex";
import * as express from "express";

export abstract class BaseDataService<T>
{
    public _queryBuilder: Knex;

    protected get queryBuilder(): Knex
    {
        return this._queryBuilder;
    }
    
    protected get query(): Knex.QueryInterface
    {
        return <Knex.QueryInterface>this._queryBuilder;
    }
    
    constructor(app)
    
    
    {
        this._queryBuilder = app.locals.ServiceContainer;
    }

    public abstract parseSite(app, site, URL, exeptions?, source?): Promise<T>;
}