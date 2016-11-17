import {Injectable, Inject} from "@angular/core";
import {ClientConfig} from "./config";
import {Http} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class HeathCheckService {

    constructor(@Inject(ClientConfig) protected config:ClientConfig,
                @Inject(Http) protected http:Http) {
    }

    status(): Promise<any> {
        return this.http.get(this.config.baseUrl + "/healthcheck")
            .toPromise()
            .then(res => res.json());
    }

}

