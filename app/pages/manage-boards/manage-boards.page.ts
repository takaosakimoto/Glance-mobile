import {Page, NavController} from "ionic-angular/index";
import {EditBoardPage} from "../edit-board/edit-board.page";
import {EditNoticePage} from "../edit-notice/edit-notice.page";
import {DeleteNoticePage} from "../delete-notice/delete-notice.page";
import {DashboardCache} from "../../providers/dashboard.cache";
import {Board} from "../../providers/board.model";
import {SearchUsersPage} from "../search-users/search-users.page";
import {TabsPage} from "../tabs/tabs";
import {DashboardPage} from '../dashboard/dashboard.page';

@Page({
    templateUrl: 'build/pages/manage-boards/manage-boards.html',
})
export class ManageBoardsPage {

    protected myBoard: Board = null;
    public tabBarElement: any;
    public navBarElement: any;
    public barflag: boolean= true;

    constructor(protected nav: NavController, protected dashboards: DashboardCache) {
        this.tabBarElement = <HTMLElement>document.querySelector("ion-tabbar-section");
        this.navBarElement = <HTMLElement>document.querySelector("ion-navbar-section");

        dashboards.myDashboard().then(dashboard => {
            this.myBoard = dashboard.boards.find(board => board.is_manager);
        }).catch(err => {
            console.log("Failed to retrieve dashboard", err);
        });
    }
    onPageWillLeave()
    {


        if(!this.barflag){
            this.tabBarElement.style.display = 'block';
            // this.navBarElement.style.display = 'block';
        }

    }

    onPageDidEnter() {
        this.barflag= true;
    }
    gototabbar(){
        this.barflag=false;
        this.nav.pop();
    }
    onCreateBoard() {
        this.nav.push(EditBoardPage);
    }

    onEditBoard() {
        this.nav.push(EditBoardPage)
    }
    
    // onCreateNotice() {
    //     this.nav.push(EditNoticePage)
    // }
    onManageNotice() {
        this.nav.push(DeleteNoticePage);
    }
    onmanageuser(){
        this.nav.push(SearchUsersPage);
    }
}
