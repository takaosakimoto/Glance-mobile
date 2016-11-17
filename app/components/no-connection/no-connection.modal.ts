import {Component} from "@angular/core";
import {NavParams, ViewController, NavController} from "ionic-angular/index";
import {SessionCache} from "../../providers/session.cache";
import {DashboardPage} from "../../pages/dashboard/dashboard.page";
import {WelcomePage} from "../../pages/welcome/welcome.page";

@Component({
    templateUrl: 'build/components/no-connection/no-connection.html',
})
export class NoConnectionModal {

    protected retrying: boolean = false;

    constructor(protected viewCtrl: ViewController,
                protected params: NavParams,
                protected session: SessionCache,
                protected nav: NavController) {
        console.log("Opened no connection modal");
    }

    onClose() {
        this.viewCtrl.dismiss();
    }
    
    onLogout() {
        this.session.logout().then(x => {
            this.viewCtrl.dismiss();
            this.nav.setRoot(WelcomePage);
        }).catch(err => {
            console.log("Failed to log out %o", err)
        });
    }

    onRetry() {
        this.retrying = true;
        this.session.current(true).then(user => {
            this.retrying = false;
            this.viewCtrl.dismiss();
            if (user != null) {
                this.nav.setRoot(DashboardPage);
            }
        }).catch(err => {
            this.retrying = false;
            console.log("Retry failed %o", err);
        })
    }
}
