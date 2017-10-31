import * as knex from "knex";
import express = require('express');
import IServiceContainer = require('./other/IServiceContainer');
var mongoose = require('mongoose');

class ServiceConfig
{
    public static makeContainer(config)
    {
        var container: IServiceContainer = <IServiceContainer>{};
        container.QueryBuilder = knex({
            client: 'pg',
            connection: {
                user: config.Server.db.username,
                password: config.Server.db.password,
                database: config.Server.db.database,
                host: config.Server.db.host,
                port: config.Server.db.port
            },
            pool: {
                min: config.Server.poolSize.min,
                max: config.Server.poolSize.max
            },
            searchPath: config.Server.searchPath
        });

        return container;
    }

    public static configure(app: express.Express, config)
    {
        app.locals.ServiceContainer = ServiceConfig.makeContainer(config);
        
        //компилим схему и модель для мангуста
        app.locals.ServiceContainer.mongoose = mongoose.connect(config.mongo.host);
        app.locals.ServiceContainer.mongoose.Promise = global.Promise;
        app.locals.ServiceContainer.schema={};
        app.locals.ServiceContainer.schema.url_schema = app.locals.ServiceContainer.mongoose.Schema({
            source: "string",
            target: "string",
            create_date: "date",
            update_date: "date",
            depth: "Number",
            site: "string",
            title: "string"
        });
        app.locals.ServiceContainer.schema.site_schema = app.locals.ServiceContainer.mongoose.Schema({
            url: "string",
            to_parse: "boolean",
            create_date: "date",
            update_date: "date",
            priority: "Number",
            exeptions: [],
            init_url: "string"
        });
        app.locals.ServiceContainer.schema.page_schema = app.locals.ServiceContainer.mongoose.Schema({
            contentType: "string",
            url: "string",
            redirectURL: "string",
            create_date: "date",
            update_date: "date",
            status: "Number",
            bodySize: "Number",
            site: "string",
        });
        
        app.locals.ServiceContainer.model={};
        app.locals.ServiceContainer.model.Url = mongoose.model(
            'Url',
            app.locals.ServiceContainer.schema.url_schema);
        
        app.locals.ServiceContainer.model.Page = mongoose.model(
            'Page',
            app.locals.ServiceContainer.schema.page_schema);
        
        app.locals.ServiceContainer.model.Site = mongoose.model(
            'Site',
            app.locals.ServiceContainer.schema.site_schema,
            'sites'
        );
    
    }
}

export = ServiceConfig;