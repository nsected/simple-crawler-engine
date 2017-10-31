import {HttpExternalSystem} from "../../models/HttpExternalSystem";
import {IOwnCloudApiConfig} from "../../services/owncloud/OwnCloudApi";

export interface ISessionStorage extends IPGConnParams
{
    tableName: string;
    poolSize: number;
}

export interface IServerConfig
{
    Port: number;
    SessionStorage: ISessionStorage;
    PublicDirectory: string;
    JsonBodyLimit: string; // Important for printing
}

export interface IHDFSConfig
{
    user?: string
    host: string;
    port: number;
    path: string;
    namenoderpcaddress?: string;
}

export interface  ISolrConfig
{
    host: string;
    port: number;
    path: string;
    secure:boolean;

    cores: {
        users: string;
        roles: string;
    }
}

export interface IParams
{
    AppName: string;
    CompanyName?: string;
    Phone?: string;
    Email?: string;
}


export interface IMailConfig
{
    From: {
        Name: string;
        Address: string;
    },
    Transport: {
        Host: string;
        Port: number;
        Username: string;
        Password: string;
        UseSSL: boolean;
    }
}

export interface IServiceJobConfig
{
    Period: number;
    IsActive: boolean;
    IsDebug: boolean;
}

export interface IServiceJobsConfig
{

}

export interface ITaskConfig
{
    Urgent: {
        DaysBeforeExpiration: number
    }
}

export interface  IExternalSystem
{
    AuthServer: HttpExternalSystem;
    Auth: HttpExternalSystem;
    BIS: HttpExternalSystem;
}

export interface IApplication
{
    Code: string;
    Role: {
        Admin: number;
        Top: number;
        Employee: number;
    }
}

export interface IOwnCloudConfig
{
    Api : IOwnCloudApiConfig;
}

export interface IInitiativeConfig
{
    Icon: {
        Default: string;
    }
}

export interface IPrintingConfig
{
    TmpDir: string;
}

export interface IKnexPoolSize
{
    min: number;
    max: number;
}

export interface IKnexConnParams extends IPGConnParams
{
    poolSize: IKnexPoolSize;
    searchPath: string;
}

export interface IPGConnParams
{
    username: string;
    password: string;
    host: string;
    port: number;
    database: string;
}


export interface IConfig
{
    App: IApplication;
    ExternalSystem: IExternalSystem;
    Server: IServerConfig;
    Tasks: IKnexConnParams;
    IntData: IKnexConnParams;
    OwnCloud: IOwnCloudConfig;
    HDFS: IHDFSConfig;
    Params?: IParams;
    Mail: IMailConfig;
    ServiceJob: IServiceJobsConfig;
    Task: ITaskConfig;
    Initiative: IInitiativeConfig;
    Printing : IPrintingConfig;
}

