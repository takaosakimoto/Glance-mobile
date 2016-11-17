import {Page} from 'ionic-angular';
import {NavController} from 'ionic-angular';
import {LoginPage} from '../login/login.page';
import {SignupPage} from '../signup/signup.page';
import {ClientConfig} from "../../providers/config";
import {HeathCheckService} from "../../providers/healthcheck.service";

declare var hockeyapp: any;

@Page({
    templateUrl: 'build/pages/welcome/welcome.html',
})
export class WelcomePage {

    debugText: string = '';

    constructor(protected nav: NavController, 
                protected config: ClientConfig,
                protected hck: HeathCheckService) {
    }

    login(): Promise<any> {
        return this.nav.push(LoginPage)
    }

    signup(): Promise<any> {
        return this.nav.push(SignupPage)
    }
    
    debug() {

        function updateDebugText(res) {
            this.debugText = JSON.stringify({
                config: this.config,
                healthcheck: res,
                hockeyapp: typeof hockeyapp
            });
        }

        if (!this.debugText) {
            this.hck.status().then(updateDebugText.bind(this)).catch(updateDebugText.bind(this));
        } else {
            this.debugText = "";
        }
    }
}
