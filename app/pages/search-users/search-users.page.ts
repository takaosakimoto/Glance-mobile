import {Component, Inject} from "@angular/core";
import {User} from "../../providers/user.model";
import {UserService} from "../../providers/user.service";

@Component({
    templateUrl: 'build/pages/search-users/search-users.html',
})
export class SearchUsersPage {

    protected users: Array<User> = [];
    protected dirty: Set<number> = new Set<number>();
    protected filtered: Array<User> = [];
    protected loaded: boolean = false;
    protected failed: boolean = false;
    
    constructor(@Inject(UserService) protected service: UserService) {
        this.initializeUsers();
    }

    initializeUsers(): Promise<void> {
        return this.service.listAllProfiles().then((users) => {
            this.users = users;
            this.filtered = users;
            this.failed = false;
            this.loaded = true;
            console.log("Retrieved users", users.length);
        }).catch((err) => {
            console.log("Failed to retrieve users", err);
            this.loaded = true;
            this.failed = true;
        });
    }
    
    updateIsManager(user: User): Promise<void> {
        this.dirty.add(user.id);
        return this.service.updateIsManager(user.id, !user.is_manager).then(() => {
            console.log("Updated user", user);
        }).catch ((err) => {
            console.log("Failed to update user", user, err);
            user.is_manager = !user.is_manager;
        }).then(() => {
            this.dirty.delete(user.id)
        });
    }

    filterUsers(event) {
        this.filtered = this.users;

        var q = event.target.value.toLowerCase().trim();

        console.log("Searching for users", q);

        if (q == '') {
            return;
        }

        this.filtered = this.users.filter((user) => {
            return user.fullname.toLowerCase().indexOf(q) > -1;
        });
    }
}
