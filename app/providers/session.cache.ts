import {Storage} from 'ionic-angular';
import {SessionService} from "./session.service";
import {Injectable} from "@angular/core";
import {User} from "./user.model";

/** Wraps the Session service to persists login tokens across sessions and provide a convenient local cache of the
 * user record for reference in components */
@Injectable()
export class SessionCache {

    protected key: string = "session";

    constructor(protected storage: Storage,
                protected sessions: SessionService) {

    }

    protected update(user, resolve, reject) {
        let value = JSON.stringify(user);
        console.log("Adding user to local storage %o", user);
        this.storage.set(this.key, value)
            .then(x => resolve(user))
            .catch(reject)
    }

    login(username: string, password: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.sessions.login(username, password)
                .then(user => this.update(user, resolve, reject)).catch(reject);
        });
    }
    
    logout(): Promise<any> {
        return new Promise((resolve, reject) => {
                this.sessions.logout()
                    .then(res => {
                        console.log("Removing user from local storage %o", res);
                        this.storage.remove(this.key).then(resolve).catch(reject)
                    }).catch(err => {
                        console.log("Failed to make logout request but deleting from local storage anyway %o", err);
                        this.storage.remove(this.key).then(resolve).catch(reject)
                    });
            }
        );
    }
    
    current(validateSession: boolean = false): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.storage.get(this.key).then(user => {
                if (user == null) {
                    console.log("No user in local storage");
                    return resolve(null);
                }

                else if (validateSession) {
                    this.sessions.current()
                        .then(retrievedUser => this.update(retrievedUser, resolve, reject))
                        .catch(err => {
                            console.log("Failed to validate session %o", err);
                            reject(err);
                        });
                }

                else {
                    console.log("Retrieved user from local storage %o", user);
                    resolve(JSON.parse(user));
                }
            }).catch(reject);
        });
    }

}
