import * as Knex from "knex";

interface IServiceContainer
{
    QueryBuilder: Knex;
    mongoose: any
}

export = IServiceContainer;