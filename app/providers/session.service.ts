import {Injectable, Inject} from '@angular/core';
import {Http, RequestOptionsArgs, Headers} from '@angular/http';
import {ClientConfig} from "./config";
import {User} from "./user.model";
import 'rxjs/Rx';

export interface Login {
    username: string;
    password: string
}

export interface SessionErrors {
    unknown?: boolean;
    unreachable?: boolean;
    unrecognized?: boolean;
    duplicate?: boolean;
    invalidEmail?: boolean;
}

@Injectable()
export class SessionService {
    protected currentUrl: string;

    constructor(@Inject(ClientConfig) protected config: ClientConfig,
                @Inject(Http) protected http: Http) {
        this.currentUrl = config.baseUrl + "/sessions/current";
    }

    protected defaultOpts(): RequestOptionsArgs {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        return {headers: headers}
    }

    login(username: string, password: string): Promise<User> {
        let body = JSON.stringify({username: username, password: password});
        return this.http
            .put(this.currentUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => res.json());
    }

    logout(): Promise<any> {
        return this.http
            .delete(this.currentUrl)
            .toPromise();
    }

    current(): Promise<User> {
        return this.http.get(this.currentUrl)
            .toPromise()
            .then(res => res.json());
    }

}
