import * as knex from "knex";
import {BaseDataService} from "../BaseDataService";
import * as phantom from 'phantom';

export class workerDataService extends BaseDataService
{
    private data;
    public  app;
    constructor(private data, public app)
    {
        super(app, _ph);
    }
    
    public parseSite(): Promise<Promise>
    {
        
        console.log(this._queryBuilder);
        return new Promise(function(resolve, reject)
        {
            resolve(true);
        });
    }
}