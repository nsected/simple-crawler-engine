import {WebApplication} from "./starter/WebApplication";
import {AppConfig as config}  from './config';

    let app: WebApplication = new WebApplication(config);
    app.start();
