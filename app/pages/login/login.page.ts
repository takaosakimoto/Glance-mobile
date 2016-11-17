import {Page, NavController} from 'ionic-angular';
import {SessionErrors, Login} from "../../providers/session.service";
import {DashboardPage} from "../dashboard/dashboard.page";
import {TabsPage} from "../tabs/tabs";
import {ResetPasswordPage} from "../reset-password/reset-password.page";
import {User} from "../../providers/user.model";
import {SessionCache} from "../../providers/session.cache";


@Page({
    templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

    public serverErrors: SessionErrors = {};

    public signup: Login = {username: "", password: ""};

    public submitted = false;

    constructor(public sessions: SessionCache,
                public nav: NavController) {

    }

    static isValidEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }
    
    loginSuccess(user: any) {
        console.log("Logged in as %o", user);
        localStorage.setItem("flaglogin","1");
        localStorage.setItem('email', this.signup.username);
        localStorage.setItem('password', this.signup.password);
        console.log("user====="+ JSON.stringify(user));
        if(user.result.is_manager){
           
           localStorage.setItem('ismanager', "1");
           
        }
        if(user.result.is_admin){
           localStorage.setItem('isadmin', "1");
        }
        this.nav.setRoot(TabsPage);
    }
    
    loginFailure(response) {
        // FIXME move to service
        switch (response.status) {
            case 404: this.serverErrors = {unreachable: true}; break;
            case 401: this.serverErrors = {unrecognized: true}; break;
            default: this.serverErrors = {unknown: true};
        }
        console.log("Failed to log in %o %o", this.serverErrors, response);
    }

    onLogin(form): Promise<User> {
        this.serverErrors = {};
        this.submitted = true;
        if (!LoginPage.isValidEmail(this.signup.username)) {
            console.log("Invalid email %o", this.signup.username);
            this.serverErrors = {invalidEmail: true};
        } else if (!form.valid) {
            console.log("Invalid form %o", form);
            return Promise.resolve<User>(form);
        } else if(form.valid) {
            console.log("Valid form, submitting");
            return this.sessions
                .login(this.signup.username, this.signup.password)
                .then(this.loginSuccess.bind(this))
                .catch(this.loginFailure.bind(this));
        }
    }
    
    onForgottenPassword(): Promise<any> {
        return this.nav.push(ResetPasswordPage);
    }
}
