import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular/index";
import {Notice} from "../../providers/notice.model";
import {Board} from "../../providers/board.model";

@Component({
    templateUrl: 'build/components/notice/notice.html',
})
export class NoticeModal {

    protected notice: Notice;
    noticeimage:any="";
    
    protected tags: Array<String>;
    public nowdate: Date= new Date();
    public localdate: string='';
    public realurl: string='';

    constructor(protected viewCtrl: ViewController,
                protected params: NavParams) {

        let timezone = this.nowdate.getTimezoneOffset() * (-1)/60;
        this.noticeimage=params.data.noticeimage;
        this.notice = params.data.notice;
        this.tags = params.data.tags;

        var stringrurl=this.notice.url.split("://");
        console.log(stringrurl);

        if(stringrurl[0] && !stringrurl[1]){
            this.realurl="http://"+ this.notice.url;
        } else{
            this.realurl= this.notice.url;
        }
        


        var noticeDate= new Date(String(this.notice.occurs_at));
        var Months=['January','February','March','April','May','June','July','August','September','October','November','December'];
        var month=noticeDate.getMonth();
        var day=noticeDate.getDate();
        var hour=noticeDate.getHours();
        if(hour>12){
            this.localdate+=(hour-12)+'pm';
        } else if(hour == 12){
            this.localdate+=12+'pm';
        } else{
            this.localdate+=hour + 'am';
        }

        this.localdate+=' on '+Months[month];
        if(day==1){
            this.localdate+=" 1st";
        } else if( day==2){
            this.localdate+=" 2nd";
        } else if( day==3){
            this.localdate+=" 3rd";
        } else{
            this.localdate+=" "+day+"th";
        }


        console.log("Opened notice modal %o %o", this.notice, this.tags);
    }
    isimagevisible(image1): boolean {
        if(image1){
            return true;
        }else{
            return false;
        }

    }

    onClose() {
        this.viewCtrl.dismiss();
    }
}
