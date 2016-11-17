import {Page} from 'ionic-angular';
import {NavController} from 'ionic-angular';
import {UserService, SessionErrors, User} from "../../providers";
import {ResetPasswordPage} from "../reset-password/reset-password.page";
import {DashboardPage} from "../dashboard/dashboard.page";
import {SessionCache} from "../../providers/session.cache";
import {TabsPage} from "../tabs/tabs";
import {BoardService} from "../../providers/board.service";

export interface Signup {
    username: string;
    password: string;
    fullname: string;
}

@Page({
    templateUrl: 'build/pages/signup/signup.html',
})
export class SignupPage {

    public serverErrors: SessionErrors = {};

    public signup: Signup = {username: "", password: "", fullname: ""};

    public repeatPassword: string = "";

    public submitted = false;

    constructor(public users: UserService,
                public service: BoardService,
                public sessions: SessionCache,
                public nav: NavController) {

    }

    static isValidEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }

    signupSuccess(session: User) {
        console.log("Signed up as ", session);
        this.sessions.login(this.signup.username, this.signup.password).then(user => {
            console.log("Logged in as ", session, user);
            // 42: jon, 115: panos staging
            this.service.subscribe(11)
            .then(this.gototabpage.bind(this))
            .catch();
            
            // this.nav.setRoot(DashboardPage);
        }).catch(err => {
            console.log("Signed up but failed to log in with same credentials");
            this.serverErrors = {unknown: true};
        });
    }

    gototabpage(user: any){
        localStorage.setItem("flaglogin","1");
        localStorage.setItem('email', this.signup.username);
        localStorage.setItem('password', this.signup.password);
        console.log("user====="+ JSON.stringify(user));

        this.nav.setRoot(TabsPage);
    }

    signupFailure(response) {
        // FIXME move to service
        switch (response.status) {
            case 404: this.serverErrors = {unreachable: true}; break;
            case 401: this.serverErrors = {duplicate: true}; break;
            default: this.serverErrors = {unknown: true};
        }
        console.log("Failed to log in", this.serverErrors, response);
    }

    onSignup(form): Promise<User> {
        this.serverErrors = {};
        this.submitted = true;
        if (!SignupPage.isValidEmail(this.signup.username)) {
            console.log("Invalid email", this.signup.username);
            this.serverErrors = {invalidEmail: true};
        } else if (!form.valid) {
            console.log("Invalid form", form);
            return Promise.resolve<User>(form);
        } else if(form.valid) {
            console.log("Valid form, submitting");
            
            return this.users
                .register(this.signup.username, this.signup.password, this.signup.fullname)
                .then(this.signupSuccess.bind(this))
                .catch(this.signupFailure.bind(this));
        }
    }

    onForgottenPassword(): Promise<any> {
        return this.nav.push(ResetPasswordPage);
    }

}
