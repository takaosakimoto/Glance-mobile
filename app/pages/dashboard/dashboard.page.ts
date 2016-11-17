import {Page, NavController, Popover, Platform, Alert} from 'ionic-angular';
import {Dashboard} from "../../providers/dashboard.model";
import {Notice} from "../../providers/notice.model";
import {NoticeModal} from "../../components/notice/notice.modal";
import {BoardSlider} from "../../components/board-slider/board-slider";
import {FindBoardsPage} from "../find-boards/find-boards.page";
import {DashboardCache} from "../../providers/dashboard.cache";
import {UserService} from "../../providers/user.service";
import {Board} from "../../providers/board.model";
import {UserTag} from "../../providers/usertag.model";
import {BoardImage} from "../../providers/boardimage.model";
import {NoticeDatePipe} from "../../providers/notice-date.pipe";
import {ReversePipe} from "../../providers/reverse";
import {Observable} from 'rxjs/Rx';
import {ChangeDetectorRef} from "@angular/core";
import {ManageBoardsPage} from "../manage-boards/manage-boards.page";
import {EditNoticePage} from "../edit-notice/edit-notice.page";

import {BoardService} from "../../providers/board.service";

//import {Push} from 'ionic-native';
import {Push, CloudSettings, provideCloud, PushToken} from '@ionic/cloud-angular';


declare var intercom: any;
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'glance-142902',
  },
  'push': {
    'sender_id': '754071665000',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};
@Page({
    templateUrl: 'build/pages/dashboard/dashboard.html',
    directives: [BoardSlider],
    pipes: [ReversePipe, NoticeDatePipe]
})
export class DashboardPage {

    protected dashboard: Dashboard = {profile: null, boards: [],boardimages:[], notices: [], tags: new Map<number, Array<string>>(), myusertags:[]};
    protected boardsById = {};
    protected usertagsById = {};
    protected loading = true;
    protected failed = false;
    protected selected: Array<number> = [0];
    public nowDate: Date = new Date();

    //public noticeDate: Date;
    public stringDate: string = '';
    public cdr: ChangeDetectorRef;
    public mynotices=[];
    public mynoticesnew=[];
    public mynoticesold=[];
    ismanager:boolean=false;
    // 
    protected myBoard: Board = null;
    public tabBarElement: any;
    public navBarElement: any;
    public barflag: boolean=true;


    constructor(protected nav: NavController,
                protected dashboards: DashboardCache,
                protected userservice: UserService,
                protected boardservice: BoardService,
                cdr: ChangeDetectorRef,
                private platform:Platform,
                public push: Push) {

        this.tabBarElement = <HTMLElement>document.querySelector("ion-tabbar-section");
        this.navBarElement = <HTMLElement>document.querySelector("ion-navbar-section");

        

        if(localStorage.getItem('ismanager')=='1'){
            
            this.ismanager=true;
        }
        if(localStorage.getItem('isadmin')=='1'){
            
            this.ismanager=true;
        }

        platform.ready().then(() => {

             intercom.registerIdentifiedUser({email: localStorage.getItem('email')});
             intercom.registerForPush();
            
           
            this.push.register().then((t: PushToken) => {
                  return this.push.saveToken(t);
            }).then((t: PushToken) => {
                  
                 this.userservice.registertokenfunc(t.token).then((row) => {
                  console.log("Success to register token"+JSON.stringify(row));

            
                 }).catch(err => {
                    console.log("Failed to register token"+JSON.stringify(err));
            
                 });
            });

           this.push.rx.notification()
              .subscribe((msg) => {
                    // alert(msg.title + ': ' + msg.text);
                    let confirm= Alert.create({
                        title: msg.title,
                        message: msg.text
                    });
                    this.nav.present(confirm);
              });

        });


                
        localStorage.setItem('myboard','');
        this.loadDashboard();
    }

    

    loadDashboard() {
        var that = this;
        this.dashboards.myDashboard().then(res => {
            
            this.myBoard = res.boards.find(board => board.is_manager);
            console.log("myboard"+this.myBoard);
            localStorage.setItem('myboard', JSON.stringify(this.myBoard));

            this.dashboard = res;
            
            this.loading = false;
            this.failed = false;

            var noticesaa =[];
            noticesaa = this.dashboard.notices;
            this.mynotices = noticesaa.sort(function(a, b) { 
                return new Date(a.occurs_at).getTime() - new Date(b.occurs_at).getTime() 
            });
            this.dateorder();

              
             var usertype = '';
             if(this.dashboard.profile.is_admin && this.dashboard.profile.is_manager){
                 usertype = "Admin";
             } else if(!this.dashboard.profile.is_admin && this.dashboard.profile.is_manager){
                 usertype = "Manger";
             } else {
                 usertype = "User";             
             }

             var boardcount = this.getboardcount(this.dashboard.boards);
             // let noticecount = 0;
             if(this.myBoard){
               var noticecount = this.getnoticecount(this.myBoard.id);
               this.boardservice.getnumberofusers(this.myBoard.id).then(res => {
                      console.log("numbers="+ res[0].count);
                      intercom.updateUser({
                         custom_attributes: {
                            NoOfFollowers : res[0].count,
                            Company: this.myBoard.name,
                            NoOfPosts: noticecount
                   
                         }
                      });
               }).catch(err => {
                    console.log("Failed to get number of users", err);
            
               });
             }
            
             
             intercom.updateUser({email: localStorage.getItem('email'), name: this.dashboard.profile.fullname,
                 custom_attributes: {
                    NoCommunitiesFollowing : boardcount,
                    UserType: usertype                    
                }
             });
            this.updateBoardsById(res.boards, res.boardimages);
            this.updateusertagsById(this.dashboard.myusertags);
        }).catch(err => {
            console.log("Failed to load dashboard", err);
            this.failed = true;
            this.loading = false;
        });
    }

    dateorder(){
        var oldnotices = [];
        var newnotices = [];
        var newdate = new Date();
        for(let notice of this.mynotices) {

            if(new Date(notice.occurs_at).getTime() > newdate.getTime()){
                newnotices.push(notice);
            } else {
                oldnotices.push(notice);
            }
        }
        this.mynoticesnew = newnotices;
        this.mynoticesold=oldnotices.sort(function(a, b) { 
                return new Date(b.occurs_at).getTime() - new Date(a.occurs_at).getTime();
         });
    }

    getnoticecount(myboardid: Number): Number{
        var noticeaa = [];
        var noticecount = 0;
        noticeaa = this.dashboard.notices.filter(notice => notice.board_id == myboardid);
        for(let notice of noticeaa) {
            if(notice.title !="bbbb"){
                noticecount++;
            }
        }
        return noticecount;

    }

    getboardcount(boards: Array<Board>): Number {
        var boardcount = 0;
        for(let board of boards) {
            if(board.is_member){
                boardcount++;
            }
        }
        return boardcount;
    }

    isNoticeVisible(notice: Notice): boolean {
       //  var comdate2= new Date(String(notice.finishes_at));
       // // var comdate1= new Date(String(notice.occurs_at));
       //  this.stringDate=(Math.ceil((this.nowDate.getTime() - comdate2.getTime())/(1000*60*60*24))).toString();
        // let noticeDate= new Date();
        // noticeDate.setHours(comdate2.getHours());
        // this.stringDate=noticeDate.toISOString();
        //this.stringDate=comdate2.toISOString();

       // this.stringDate=comdate1 -comdate2;
        let board = this.boardsById[notice.board_id];
        if(notice.title=="bbbb"){
            return false;
        }
        var madeDate = new Date(String(notice.occurs_at));
        
        var diffdate= Math.ceil((madeDate.getTime() - this.nowDate.getTime())/(1000*60));
        
        this.stringDate='';
                if(diffdate > 30*24*60){
                    this.stringDate="In "+Math.ceil(diffdate/(60*24*30))+" months";

                } else if(diffdate > 7*24*60 && diffdate <= 30*24*60 ){
                    this.stringDate="In "+Math.ceil(diffdate/(60*24*7))+" weeks";
                } else if(diffdate > 24*60 && diffdate <= 7*24*60 ){
                    this.stringDate="In "+Math.ceil(diffdate/(60*24))+" days";
                } else if(diffdate > 60 && diffdate <= 24*60 ){
                    this.stringDate="In "+Math.ceil(diffdate/60)+" hours";
                } else if(diffdate <=60 && diffdate>0){
                    this.stringDate="In "+diffdate+" mins";
                } else {
                    this.stringDate="Event has finished";
                }



                if(notice.noticestate){

                    this.stringDate='';
                }
           

        
        let count=false;

        let usertag=this.usertagsById[notice.board_id];
        if(!usertag || !this.dashboard.tags[notice.id]){
            count=true;
        }
        if(usertag && this.dashboard.tags[notice.id]){
            // console.log(this.dashboard.tags[notice.id][0]);
            let arraytags= usertag.tags.split(',');
            
            
                for(let tag of this.dashboard.tags[notice.id]){
                                 
                if(arraytags.indexOf(tag) >=0)
                {
                    
                    count=true;
                }
                
             }
          

            
        }

      //  let count = true;
      
        if (!board || !board.is_member) {
            return false;
        } else if (this.selected[0] == 0 && count) {
            
            return true;
        } else {
            if(count && this.selected.indexOf(notice.board_id) >= 0){
              
                return true;
            } else{
                return false;
            }
            

            //return this.selected.indexOf(notice.board_id) >= 0;
        }
    }

    ngOnInit(){
        let timer = Observable.timer(2000,60000);
        timer.subscribe(this.timerfunc);
    }
    timerfunc() {
        this.nowDate= new Date();
       // this.loadDashboard();
         
    }

    onPageDidEnter(){
        this.barflag=true;
        // let elem = <HTMLElement>document.querySelector("ion-tabbar-section");
        // if (elem != null) {
        //   elem.style.display = 'block';
        // }
        // let elemnav = <HTMLElement>document.querySelector("ion-navbar-section");
        // if (elemnav != null) {
        //   elemnav.style.display = 'block';
        // }
       // if(localStorage.getItem('flagreload')=='1'){
       //    localStorage.setItem('flagreload','0');
       //    window.location.reload();
       //  // this.loadDashboard();
       // }
        
        // alert('aaa');

       this.loadDashboard();
       // window.location.reload();
        
    }
    onPageWillLeave()
    {

        if(!this.barflag){
            this.tabBarElement.style.display = 'none';
            // this.navBarElement.style.display = 'none';
        }

    }
    onPageWillEnter(){
        
            this.tabBarElement.style.display = 'block';
    }


    updateusertagsById(usertags: Array<UserTag>){
        let result = {};
        for(let usertag of usertags) {
            result[usertag.board_id] = usertag;
        }
        this.usertagsById = result;
        
    }
    updateBoardsById(boards: Array<Board>, boardimages: Array<BoardImage>) {
        let result = {};
        for(let board of boards) {
            result[board.id] = board;
        }
        this.boardsById = result;
    }

    onClickchart(){
        intercom.displayConversationsList();
        intercom.displayMessenger(); 
        intercom.displayMessageComposer();
        intercom.displayConversationsList();
    }

    onClicksettings() {
        // this.nav.setRoot(ManageBoardsPage);
        this.barflag=false;
        
        this.nav.push(ManageBoardsPage);
    }

    onAddnotice(){
        if(this.myBoard){
            this.barflag=false;
            this.nav.push(EditNoticePage);
            // this.nav.setRoot(EditNoticePage);
        } else{
            let confirm= Alert.create({
                        title: "Warning!",
                        message: "Please create board!"
                    });
                    this.nav.present(confirm);
        }
    }

    onClickNotice(notice: Notice) {
        
        let data = {
            noticeimage: this.boardsById[notice.board_id].imagename,
            notice: notice,
            tags: this.dashboard.tags[notice.id] || []
        };
        let modal = Popover.create(NoticeModal, data);
        this.nav.present(modal);
    }

    onSelectBoard(boards) {
        
        this.selected = boards;
    }

    onAddBoard() {
        localStorage.setItem('flagreload','1');
        this.nav.push(FindBoardsPage);
    }
}
