import {Page, NavController, Alert} from "ionic-angular/index";
import {Notice} from "../../providers/notice.model";
import {NoticeService} from "../../providers/notice.service";
import {DashboardCache} from "../../providers/dashboard.cache";
import {Dashboard} from "../../providers/dashboard.model";
@Page({
    templateUrl: 'build/pages/delete-notice/delete-notice.html',
})
export class DeleteNoticePage {
    
  public mynotices: Array<Notice>=[];

    constructor(protected nav: NavController,
                protected dashboard: DashboardCache,
                protected notices: NoticeService
                ) {

        
        dashboard.myDashboard().then(results => {
            this.chooseMyBoard(results)
        }).catch(err => {
            
            console.log("Failed to get dashboard", err);
        });

        
    }


    protected chooseMyBoard(dashboard: Dashboard) {
        let myBoard = dashboard.boards.find(board => board.is_manager);
        if (myBoard) {
            var noticesaa=[];
         //   this.findmanagernotices(myBoard.id);
         noticesaa = dashboard.notices.filter(notice => notice.board_id == myBoard.id);

          this.mynotices=   noticesaa.sort(function(a,b) { 
                return new Date(b.occurs_at).getTime() - new Date(a.occurs_at).getTime() 
            });
        }
    }

    removenotice(mynotice){
        this.notices.removenotice(mynotice.board_id, mynotice.id)
        .then(() => {
            var index= this.mynotices.indexOf(mynotice);
            this.mynotices.splice(index, 1);
            console.log("remove notice");
        }

        ).catch( err => {
            console.log("Failed to remove", err);
        });
    }

    gonavback(){
        this.nav.pop();
        
    }

    isNoticeVisible(mynotice: Notice): boolean {
        if(mynotice.title=="bbbb"){
            return false;
        }
        return true;

    }

    
}
