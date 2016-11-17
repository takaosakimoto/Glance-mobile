import {Page, NavController} from 'ionic-angular';
import {SessionErrors, Login} from "../../providers/session.service";
import {UserService} from "../../providers/user.service";
import {DashboardPage} from "../dashboard/dashboard.page";
import {SessionCache} from "../../providers/session.cache";
import {TabsPage} from "../tabs/tabs";
@Page({
    templateUrl: 'build/pages/reset-password/reset-password.html',
})
export class ResetPasswordPage {


    public serverErrors: SessionErrors = {};

    public signup: Login = {username: "", password: ""};

    public submitted = false;

    public success:number=0;
    public verificode: number=0;
    public inputverifiedcode: number;
    public verifystate: boolean=false;

    constructor(public users: UserService,
                public nav: NavController,
                public sessions: SessionCache) {

    }

    static isValidEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }

    resetSuccess() {
        console.log("Reset code sent to email address");

        this.success = 2;
    }

    resetFailure(response) {
        this.serverErrors = {unknown: true};
        this.success = 1;
        console.log("Failed to reset password", this.serverErrors, response);
    }

    loginSuccess(user: any) {
        console.log("Logged in as %o", user);
        localStorage.setItem("flaglogin","1");
        this.nav.setRoot(TabsPage);
        // this.nav.setRoot(DashboardPage);
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

    onLogin(form): Promise<any> {
        this.serverErrors = {};
        this.submitted = true;
        if (!ResetPasswordPage.isValidEmail(this.signup.username)) {
            console.log("Invalid email %o", this.signup.username);
            this.serverErrors = {invalidEmail: true};
        } else if (!form.valid) {
            console.log("Invalid form %o", form);
            return Promise.resolve<any>(form);
        } else if(form.valid) {
            console.log("Valid form, submitting");
            return this.sessions
                .login(this.signup.username, this.signup.password)
                .then(this.loginSuccess.bind(this))
                .catch(this.loginFailure.bind(this));
        }
    }

    onReset(form): Promise<any> {
       // this.success = false;
        this.serverErrors = {};
        this.submitted = true;
        if (!form.valid) {
            console.log("Invalid form", form);
            return Promise.resolve<any>(form);
        } else if(form.valid) {
            console.log("Valid form, submitting");
            console.log("verificode="+this.verificode+"inputverificode="+this.inputverifiedcode);
            if(this.verificode == this.inputverifiedcode){
                this.verifystate=false;
                return this.users
                .requestPasswordReset(this.signup.username, this.signup.password)
                .then(this.resetSuccess.bind(this))
                .catch(this.resetFailure.bind(this));
            } else{
                this.verifystate=true;
            }
            
        }
    }

     onverify(form): Promise<any> {
       // this.success = false;
        this.serverErrors = {};
        this.submitted = true;
        if (!form.valid) {
            console.log("Invalid form", form);
            return Promise.resolve<any>(form);
        } else if(form.valid) {
            console.log("Valid form, submitting");
            return this.users
                .verifyreset(this.signup.username, this.signup.password)
                .then(this.verifySuccess.bind(this))
                .catch(this.verifyFailure.bind(this));
        }
    }

    verifySuccess(code: any) {
        
        this.verificode=code.code;
        this.success=1;
        
    }

    verifyFailure(response) {
        this.serverErrors = {unknown: true};
        console.log("Failed to verified", this.serverErrors, response);
        this.success=0;
    }



}
