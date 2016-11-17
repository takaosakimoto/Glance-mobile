import {Page, NavController, Alert, NavParams} from "ionic-angular/index";
import {Notice} from "../../providers/notice.model";
import {DashboardCache} from "../../providers/dashboard.cache";
import {NoticeService} from "../../providers/notice.service";
import {BoardService} from "../../providers/board.service";
import {Dashboard} from "../../providers/dashboard.model";

import {Tag} from "../../providers/tag.model";
import {BoardTag} from "../../providers/boardtag.model";

@Page({
    templateUrl: 'build/pages/add-tags/add-tags.html',
})
export class AddtagsPage {
    public tags : Array<BoardTag>=[];
    public noticetags : Array<Tag>=[];
    public inputtag: BoardTag={board_id:0, name:"", checked:false};
    public addtagvalue:string;
    public boardid: number;
    public noticeid: number;
    constructor(public navcontroller: NavController, 
        public navparams : NavParams, 
        protected boards: BoardService,
        protected notices: NoticeService
        ){
        this.boardid=navparams.get("boardid");
        this.noticeid=navparams.get("noticeid");
        this.getboardtags();
        

    }

    getboardtags(){
        this.boards.findtags(this.boardid).then((boardtags) => {
            this.tags=boardtags;
          
        }).catch((err) => {
            alert("error");
        });
    }
    convertnotictag(boardtags:Array<BoardTag>) {
        let result:Array<BoardTag>=[];
        var index:number=0;
        for(let boardtag of boardtags) {
            boardtag.checked=false;
            result[index]=boardtag;
            index++;
        }
        this.tags=result;
       // this.boardsById = result;
    }

    changetag(e, tag:BoardTag){
        if(tag.checked){
            console.log(tag.name+this.boardid);
            this.notices.inserttag(this.boardid, tag.name, this.noticeid).then(() => {
                console.log("inserted noticetag");
            
            }).catch(err => {
                console.log("Failed to noticetag", err);
               // tag.checked=false;
            
           });
        }else{
            this.notices.removetag(this.boardid, tag.name, this.noticeid).then(() => {
                console.log("delete noticetag");
            
            }).catch(err => {
                console.log("Failed to deletetag", err);
              //  tag.checked=true;
            
           });
        }
    }
    // changetag(e, tag: BoardTag){
    //     alert(tag.name);
    // }
    removetag(tag: BoardTag){
        console.log(tag.name+"boardid="+ this.boardid);

        this.boards.deletetag(this.boardid, tag.name).then(() => {
            console.log("deleted boardtag");
            this.getboardtags();
            // var index= this.tags.indexOf(tag);
            
            // this.tags.splice(index,1); 
        }).catch(err => {
            console.log("Failed to delete tag", err);
            
        });
    }

    gonavback(){
        this.navcontroller.pop();
    }

    done(){
        this.navcontroller.pop();
    }

    addtagfunc(){
        console.log("click add");

        this.boards.inserttag(this.boardid, this.addtagvalue).then(() => {
            console.log("inserted boardtag");
            // this.inputtag.name=this.addtagvalue;
            // this.tags.push(this.inputtag);
            this.getboardtags();
            
        }).catch(err => {
            console.log("Failed to update", err);
            
        });
        
    }

    

    
    
}
