import {Injectable, Inject} from "@angular/core";
import {ClientConfig} from "./config";
import {Http, Headers, RequestOptionsArgs} from "@angular/http";
import {User} from "./user.model";
import 'rxjs/Rx';

@Injectable()
export class UserService {
    protected usersUrl: string;
    protected currentUrl: string;
    protected resetUrl: string;
    protected updatePasswordUrl: string;
    protected verifyUrl: string;
     protected registertokenUrl: string;

    constructor(@Inject(ClientConfig) protected config: ClientConfig,
                @Inject(Http) protected http: Http) {
        this.usersUrl = config.baseUrl + "/users";
        this.currentUrl = config.baseUrl + "/users/current";
        this.resetUrl = config.baseUrl + "/users/reset_password";
        this.updatePasswordUrl = config.baseUrl + "/users/current/password";
        this.verifyUrl = config.baseUrl + "/users/verify";
        this.registertokenUrl = config.baseUrl + "/users/registertoken";
    }
    
    protected updateIsManagerUrl(id): string {
        return this.usersUrl + "/" + id + "/is_manager";
    }
    
    protected defaultOpts(): RequestOptionsArgs {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        return {headers: headers}
    }

    register(username: string, password: string, fullname: string): Promise<User> {
        let body = JSON.stringify({username: username, password: password, fullname: fullname});
        return this.http
            .post(this.usersUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => res.json());
    }
    registertokenfunc(devicetoken: string): Promise<any> {
        let body = JSON.stringify({token: devicetoken});
        return this.http
            .post(this.registertokenUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => res.json());
    }

    deactivate(): Promise<any> {
        return this.http
            .delete(this.currentUrl)
            .toPromise();
    }

    current(): Promise<User> {
        
        return this.http.get(this.currentUrl)
            .toPromise()
            .then(res => res.json());
    }
    
    requestPasswordReset(username: string, password: string): Promise<any> {
        let body = JSON.stringify({username: username, password: password});
        return this.http
            .put(this.resetUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }

    verifyreset(username: string, password: string): Promise<any> {
        let body = JSON.stringify({username: username, password: password});
        return this.http
            .post(this.verifyUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => res.json());
    }

    updatePassword(current_password: string, new_password: string): Promise<void> {
        let body = JSON.stringify({current_password: current_password, new_password: new_password});
        return this.http
            .put(this.updatePasswordUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }

    updateProfile(fullname: string): Promise<void> {
        let body = JSON.stringify({fullname: fullname});
        return this.http
            .put(this.currentUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }

    updateIsManager(id: number, value: boolean): Promise<void> {
        let body = JSON.stringify({value: value});
        return this.http
            .put(this.updateIsManagerUrl(id), body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }
    
    listAllProfiles(): Promise<Array<User>> {
        return this.http
            .get(this.usersUrl, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }

}
