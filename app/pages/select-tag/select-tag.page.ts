import {Page, NavController, Alert, NavParams} from "ionic-angular/index";
import {BoardService} from "../../providers/board.service";
import {Tag} from "../../providers/tag.model";
import {BoardTag} from "../../providers/boardtag.model";

@Page({
    templateUrl: 'build/pages/select-tag/select-tag.html',
})
export class SelectTagPage {

    public tags : Array<BoardTag>=[];
    public selecttags : Array<string>=[];
    public addtagvalue:string;
    public boardid: number;
    public alltags: boolean=false;
    public selectedall: boolean=false;
    //public 

    constructor(public navcontroller: NavController, 
        public navparams : NavParams, 
        protected boards: BoardService
        
        ){
        this.boardid=navparams.get("boardid");
        this.getboardtags();
        

    }

    getboardtags(){
        this.boards.findtags(this.boardid).then((boardtags) => {
            this.tags=boardtags;
          
        }).catch((err) => {
            alert("error");
        });
    }

    allchange(e){
        if(this.alltags){
            this.selectedall=true;
            this.selecttags=[];
            
            var index=0;
            for(let tag of this.tags) {
               tag.checked=true;
               this.selecttags.push(tag.name);
            }
            
            
        } else{ 

            if(this.selectedall){
                for(let tag of this.tags) {
                  tag.checked=false;
                }
                this.selecttags=[];
            }
            this.selectedall=false;
           
        }
    }
   
    changetag(e, tag:BoardTag){

        if(tag.checked){
            if(!this.selectedall){
                this.selecttags.push(tag.name);
            }
           
        }else{
            this.selectedall=false;
            this.alltags=false;
            var index= this.selecttags.indexOf(tag.name);
            this.selecttags.splice(index, 1);
            console.log(this.selecttags);
        }
    }

   joinfunc(){
       var stringtags='';
       for(let tagname of this.selecttags){
           stringtags=stringtags+','+ tagname;
       }

       this.boards.createusertag(this.boardid, stringtags).then(() => {
            this.navcontroller.pop();
          
        }).catch((err) => {
            console.log(JSON.stringify(err));
            this.navcontroller.pop();
        });
   }
    // changetag(e, tag: BoardTag){
    //     alert(tag.name);
    // }
   

    
}
