import {Injectable, Inject} from "@angular/core";
import {Http, RequestOptionsArgs, Headers} from "@angular/http";
import {ClientConfig} from "./config";
import 'rxjs/Rx';
import {Tag} from "./tag.model";
@Injectable()
export class NoticeService {

    protected noticesUrl: string;

    constructor(@Inject(ClientConfig) protected config:ClientConfig,
                @Inject(Http) protected http:Http) {
        this.noticesUrl = config.baseUrl + "/notices";
    }

    protected defaultOpts(): RequestOptionsArgs {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        return {headers: headers}
    }

    protected noticesupdateUrl(): string {
        return this.noticesUrl+"/updatenotice";
    }

    protected noticesremoveUrl(): string {
        return this.noticesUrl+"/removenotice";
    }

    protected inserttagurl(): string {
        return this.noticesUrl+"/createtag";
    }
    protected removetagurl(): string {
        return this.noticesUrl+"/removetag";
    }
    protected noticetagurl(): string {
        return this.noticesUrl+"/findnoticetags";
    }

    protected mynoticesurl(): string {
        return this.noticesUrl+"/findmynotices";
    }
    protected managernoticesurl(): string {
        return this.noticesUrl+"/Mynoticesbymanager";
    }

    create(board: number, title: string, description: string, url: string, occursAt: String, finishesAt: String, locationText: string, noticeDate: String, noticestate: boolean): Promise<any> {
        var body = JSON.stringify({
            board_id: board,
            title: title,
            occurs_at: occursAt,
            finishes_at: finishesAt,
            location_text: locationText,
            description: description,
            url: url,
            noticeDate: noticeDate,
            noticestate: noticestate
        });
        console.log("noticedate-notice.service="+ this.noticesUrl);
        return this.http.post(this.noticesUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }

    update(noticeid: number, board: number, title: string, description: string, url: string, occursAt: String, finishesAt: String, locationText: string, noticeDate: String, noticetags: Array<string>, noticestate: boolean): Promise<any> {
        console.log("noticetags="+ noticetags[0]);
        var body = JSON.stringify({
            noticeid: noticeid,
            boardid: board,
            title: title,
            occurs_at: occursAt,
            finishes_at: finishesAt,
            location_text: locationText,
            description: description,
            url: url,
            noticeDate: noticeDate,
            noticetags: noticetags,
            noticestate: noticestate
        });
        // return this.http.put(this.noticesupdateUrl(), body, this.defaultOpts())
        //     .toPromise()
        //     .then(res => {});
        return this.http.post(this.noticesupdateUrl(), body, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }
    removenotice(boardid: number, noticeid: number): Promise<void> {
        var body = JSON.stringify({
            boardid: boardid,
            noticeid: noticeid
        });
        return this.http.put(this.noticesremoveUrl(), body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }

    inserttag(boardid: number, name: string, noticeid: number): Promise<void> {
        var body = JSON.stringify({
            boardid: boardid,
            name: name,
            noticeid: noticeid
        });
        console.log("boardid="+ boardid+ "name="+ name+ "noticeid="+ noticeid);
        return this.http.put(this.inserttagurl(), body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }
    removetag(boardid: number, name: string, noticeid: number): Promise<void> {
        var body = JSON.stringify({
            boardid: boardid,
            name: name,
            noticeid: noticeid
        });
        return this.http.put(this.removetagurl(), body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }
    findnoticetags(boardid:number, noticeid: number): Promise<Array<Tag>>{
        var body = JSON.stringify({
            boardid: boardid,
            noticeid: noticeid
        });
        return this.http.post(this.noticetagurl(), body, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }

    findMynotices(): Promise<Array<any>>{
        
        return this.http.get(this.mynoticesurl())
            .toPromise()
            .then(res => res.json().result);
    }

    findmanagernotices(): Promise<Array<any>>{
        
        return this.http.get(this.managernoticesurl())
            .toPromise()
            .then(res => res.json().result);
    }


}
