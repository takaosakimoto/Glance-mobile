import {Page, NavController, Alert} from "ionic-angular/index";
import {Notice} from "../../providers/notice.model";
import {DashboardCache} from "../../providers/dashboard.cache";
import {NoticeService} from "../../providers/notice.service";
import {Dashboard} from "../../providers/dashboard.model";
import {AddtagsPage} from "../add-tags/add-tags.page";
import {AnotherNoticePage} from "../another-notice/another-notice.page";
import {Tag} from "../../providers/tag.model";
import {DashboardPage} from '../dashboard/dashboard.page';
@Page({
    templateUrl: 'build/pages/edit-notice/edit-notice.html',
})
export class EditNoticePage {
    startdate: Date = new Date();
    startat: Date = new Date();
    finishat: Date = new Date();
    localstartdate: String;
    localfinishdate: String;
    utcstartat: Date= new Date();
    utcfinishat: Date= new Date();

    //if to go into 
  //  public noticeaddflag:boolean= false;
   
    notice: Notice = {id: 0,  title: "" , description: "", url: "", posted_by: 0, board_id: 0, location_text: "", noticestate: true};
    saved: boolean = false;
    error: boolean = false;
    public noticeid: number=0;
    public selectedsave: boolean=false;
    public selectedcreatetag: boolean=false;
    public noticetags:Array<string>=[];

    public index: number=50;
    public tabBarElement: any;
    public navBarElement: any;
    public barflag: boolean= false;
    public stateflag: boolean = true;
  

    constructor(protected nav: NavController,
                protected dashboard: DashboardCache,
                protected notices: NoticeService
                ) {
        
        this.tabBarElement = <HTMLElement>document.querySelector("ion-tabbar-section");
        this.navBarElement = <HTMLElement>document.querySelector("ion-navbar-section");

        this.initdate();
        
        dashboard.myDashboard().then(results => {
            this.chooseMyBoard(results)
        }).catch(err => {
            this.error = false;
            console.log("Failed to get dashboard", err);
        });
        
    }

    

    initdate(){
        let timezone = this.startdate.getTimezoneOffset() * (-1)/60;
            this.startat.setHours(this.startdate.getHours() + timezone);
            this.finishat.setHours(this.startdate.getHours() + timezone +2);
            this.localstartdate= this.startat.toISOString();
            this.localfinishdate=this.finishat.toISOString();
            this.utcfinishat.setHours(this.startdate.getHours() +2);
            this.notice.occurs_at= this.utcstartat.toISOString();
            this.notice.finishes_at= this.utcfinishat.toISOString();
            this.notice.noticedate=this.startdate.toISOString();
    }

    onPageWillLeave()
    {

        if(this.barflag){
            this.tabBarElement.style.display = 'block';
            // this.navBarElement.style.display = 'block';
        }

    }

    changestate(){
        this.stateflag = !this.stateflag;
    }

    onPageDidEnter(){
       this.barflag = false;
        if(this.selectedcreatetag){
          if(this.noticeid){
            this.notices.findnoticetags(this.notice.board_id, this.noticeid).then(
                (noticetags)=>{
                    for(let tag of noticetags){
                        this.noticetags.push(tag.name);
                    }

                 //   this.noticetags=noticetags;
                    

            }).catch((err) => {
                 alert("error");
            });
          }
       //   this.notice= {id: 0,  title: this.notice.title , description: this.notice.de, url: "", posted_by: 0, board_id: this.notice.board_id, location_text: ""};

       } else {
           this.notice= {id: 0,  title: "" , description: "", url: "", posted_by: 0, board_id: this.notice.board_id, location_text: "", noticestate: true};
           this.noticetags=[];
           this.initdate();
           
       }
        
    }

    protected chooseMyBoard(dashboard: Dashboard) {
        let myBoard = dashboard.boards.find(board => board.is_manager);
        if (myBoard) {
            this.notice.board_id = myBoard.id;
            console.log("Selected board", myBoard);
        }
    }

    protected insertNotice() { 
         let timezone = this.startdate.getTimezoneOffset() * (-1)/60;
         var date1 = new Date(String(this.localstartdate));
         var date2 = new Date(String(this.localfinishdate));
         this.utcstartat=date1;
         this.utcfinishat= date2;
         this.utcstartat.setHours(date1.getHours() - timezone);
         this.utcfinishat.setHours(date2.getHours() - timezone);
        this.notice.occurs_at= this.utcstartat.toISOString();
        this.notice.finishes_at= this.utcfinishat.toISOString();

 
        this.notices
            .create(this.notice.board_id, this.notice.title, this.notice.description, this.notice.url, this.notice.occurs_at, this.notice.finishes_at,
                this.notice.location_text, this.notice.noticedate, this.stateflag)
            .then(row => {
                this.notice.id = row.id;
                this.noticeid=row.id.id;
                this.selectedsave=true;
                this.dashboard.invalidate();
                this.error = false;
                //this.saved = true;
                this.selectedcreatetag=false;
                this.nav.push(AnotherNoticePage, {noticetitle: this.notice.title});
                
            }).catch(err => {
            console.log("Failed to insert", err);
            this.error = true;
            this.saved = false;
        });
    }
    protected updateNotice() { 
        let timezone = this.startdate.getTimezoneOffset() * (-1)/60;
         let date1 = new Date(String(this.localstartdate));
         let date2 = new Date(String(this.localfinishdate));
         this.utcstartat=date1;
         this.utcfinishat= date2;
         this.utcstartat.setHours(date1.getHours() - timezone);
         this.utcfinishat.setHours(date2.getHours() - timezone);
        this.notice.occurs_at= this.utcstartat.toISOString();
        this.notice.finishes_at= this.utcfinishat.toISOString();
             
        
        this.notices
            .update(this.noticeid,this.notice.board_id, this.notice.title, this.notice.description, this.notice.url, this.notice.occurs_at, this.notice.finishes_at,
                this.notice.location_text, this.notice.noticedate, this.noticetags, this.stateflag)
            .then((result) => {
                this.selectedsave=true;
                this.error = false;
                this.dashboard.invalidate();
                this.selectedcreatetag=false;
                console.log("result="+ JSON.stringify(result));
                this.nav.push(AnotherNoticePage, {noticetitle: this.notice.title});
                
            }).catch(err => {
            console.log("Failed to update", err);
            this.error = true;
            this.saved = false;
        });
    }
    protected removenotice(){
        
        this.notices.removenotice(this.notice.board_id, this.noticeid)
        .then(() => {
            console.log("remove notice");
            this.nav.pop();
        }

        ).catch( err => {
            console.log("Failed to remove", err);
            this.nav.pop();
        });
    }

    visisblebasetag(){
        if(!this.noticetags[0]){
            return true;
        } else{
            return false;
        }
    }

    onremoveTags(){
        
        this.notices.removenotice(5, this.index)
        .then(() => {
            console.log("remove notice");
            this.index=this.index+1;
            console.log("indexdfsdfsdfsdfsdfffsdf="+this.index);
            
        }

        ).catch( err => {
            console.log("Failed to remove", err);
            this.index=this.index+1;
            console.log("indexdfsdfsdfsdfsdfffsdf"+this.index);
            
        });
    }
    

    //compare of date in startat
    onDateselect1() {
        var comdate1= new Date(String(this.localstartdate));

        if(this.startat>comdate1){
            this.localstartdate= this.startat.toISOString();
            this.doConfirm();
        }
       
    }
    //compare of date in finishat
    onDateselect2(){
        var comdate2= new Date(String(this.localfinishdate));
        if(this.finishat>comdate2){
            this.localfinishdate= this.finishat.toISOString();
            this.doConfirm();
        }

    }
    // display alert
    doConfirm(){
         let confirm= Alert.create({
            title: "Warning",
            message: "You selected a date in the past. Please try again"
        });
        this.nav.present(confirm);
    }

    gonavback(){
        this.barflag= true;
         this.nav.pop();
        // this.nav.setRoot(DashboardPage);
        
    }

    onCreateTags(){
        //this.nav.push(AddtagsPage, {boardid: this.notice.board_id, noticeid: 0});
        // if(this.selectedsave || this.noticeid){
        //         this.noticeaddflag=true;
        //        this.nav.push(AddtagsPage, {boardid: this.notice.board_id, noticeid: this.noticeid});
        // } else {
            this.notices
            .create(this.notice.board_id, "bbbb", "bbbb", this.notice.url, this.notice.occurs_at, this.notice.finishes_at,
                "aaaa", this.notice.noticedate, this.stateflag)
            .then(row => {
               // this.notice.id = row.id;
              // alert(this.notice.id);
               this.noticeid=row.id.id;
               this.selectedcreatetag=true;
               this.nav.push(AddtagsPage, {boardid: this.notice.board_id, noticeid: this.noticeid});
                
            }).catch(err => {
            let confirm= Alert.create({
                title: "Warning",
                message: "Connection Error"
            });
            this.nav.present(confirm);
        });
       // }
        
        
    }

    onSave(boardForm) {
        if (!boardForm.valid) {
            console.log("Invalid form", boardForm);
        } else if(!this.selectedcreatetag){
            this.insertNotice();
        } else{
            this.updateNotice();
        }
    }
}
