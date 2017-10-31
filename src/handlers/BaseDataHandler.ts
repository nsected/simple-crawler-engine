import * as express from "express";

import {BaseHandler} from "./BaseHandler";
import {IHandlerRequest} from "./BaseHandler";
import {IHandlerResponse} from "./BaseHandler";
import {BaseDataService} from "./BaseDataService";

export abstract class BaseDataHandler<In extends IHandlerRequest, Out extends IHandlerResponse, IDataService extends BaseDataService<In>> extends BaseHandler<In, Out>
{
    protected abstract createDataService(data: In): IDataService;

    protected calc(data: In): Promise<Out>
    {
        return this.createDataService(data)
            .parseSite()
            .then((res: Out) => {
                return res;
            });
    }
}