import {Page, NavController, Alert, NavParams} from "ionic-angular/index";
import {Dashboard} from "../../providers/dashboard.model";
import {DashboardPage} from '../dashboard/dashboard.page';
import {TabsPage} from '../tabs/tabs';
@Page({
    templateUrl: 'build/pages/another-notice/another-notice.html',
})
export class AnotherNoticePage {
   public noticetitle: string= '';
   public tabBarElement: any;
    public navBarElement: any;
    public barflag: boolean= false;
  

    constructor(protected nav: NavController,
                public navparams : NavParams
                ) {
        
        this.noticetitle=navparams.get("noticetitle");
        this.tabBarElement = <HTMLElement>document.querySelector("ion-tabbar-section");
        this.navBarElement = <HTMLElement>document.querySelector("ion-navbar-section");
    }

    onPageWillLeave()
    {

        if(this.barflag){
            this.tabBarElement.style.display = 'block';
            // this.navBarElement.style.display = 'block';
        }

    }
    onPageDidEnter(){
       this.barflag = false;
   }

    onNewnotice(){
        this.nav.pop();
    }

    gotodashboard(){
        this.barflag = true;
        this.nav.setRoot(DashboardPage);
        
    }

    
}
