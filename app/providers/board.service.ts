import {ClientConfig} from "./config";
import {Inject, Injectable} from "@angular/core";
import {Http, RequestOptionsArgs, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Board} from "./board.model";
import {BoardTag} from "./boardtag.model";

@Injectable()
export class BoardService {

    protected boardsUrl: string;
    protected boardsimageUrl: string;

    constructor(@Inject(ClientConfig) protected config:ClientConfig,
                @Inject(Http) protected http:Http) {
        this.boardsUrl = config.baseUrl + "/boards";
        this.boardsimageUrl = config.baseUrl + "/boards/uploadimage";
    }

    protected defaultOpts(): RequestOptionsArgs {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        return {headers: headers}
    }

    protected subscriptionUrl(boardId: number): string {
        return this.boardUrl(boardId) + "/users/current";
    }

    protected boardUrl(boardId: number): string {
        if (!boardId) {
            throw new Error("missing board_id");
        }
        return this.boardsUrl + "/" + boardId;
    }

    protected boardimageUrl(boardId: number): string {
        if (!boardId) {
            throw new Error("missing board_id");
        }
        return this.boardsimageUrl + "/" + boardId;
    }

    protected boardtagurl(boardId: number, name: string): string {
        return this.boardUrl(boardId) + "/tags/"+name;
    }
    protected removetagurl(boardId: number, name: string): string {
        return this.boardUrl(boardId) + "/tags/remove";
    }
    protected findtagurl(boardId: number): string {
        return this.boardUrl(boardId) + "/tags/find";
    }

    create(name: string, locationText: string, description: string, boardimage: any): Promise<any> {
        var body = JSON.stringify({
            name: name,
            location_text: locationText,
            description: description,
            boardimage: boardimage
        });
        return this.http.post(this.boardsUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }

    createimage(id: number, boardimage: any): Promise<any> {
        var body = JSON.stringify({
            board_id: id,
            boardimage: boardimage
        });
        return this.http.post(this.boardsimageUrl, body, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }

    update(boardId: number, name: string, locationText: string, description: string, boardimage: any): Promise<void> {
        var body = JSON.stringify({
            id: boardId,
            name: name,
            location_text: locationText,
            description: description,
            boardimage: boardimage
        });
        return this.http.put(this.boardUrl(boardId), body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }
    inserttag(boardid:number, name: string){
        return this.http.put(this.boardtagurl(boardid, name), "")
            .toPromise()
            .then(() => {} );
    }
    deletetag(boardid:number, name: string){
        // var body = JSON.stringify({
        //     boardid: boardid,
        //     name: name
            
        // });
        // return this.http.put(this.removetagurl(boardid, name), body, this.defaultOpts())
        //     .toPromise()
        //     .then(res => {} );
        return this.http.delete(this.boardtagurl(boardid, name))
            .toPromise()
            .then(() => {} );
    }

    findtags(boardid:number): Promise<Array<BoardTag>>{
        var body = JSON.stringify({
            boardid: boardid});
        return this.http.post(this.findtagurl(boardid), body, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }

    updateimage(boardId: number, boardimgage: any): Promise<void> {
        var body = JSON.stringify({
            board_id: boardId,
            boardimage: boardimgage
        });
        return this.http.put(this.boardimageUrl(boardId), body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }

    createusertag(board_id:number, name: string){
        var body = JSON.stringify({
            board_id: board_id,
            name: name
        });
        return this.http.put(this.boardsUrl+"/usertags/add", body, this.defaultOpts())
            .toPromise()
            .then(res => {});
    }
    
    findusertag(board_id:number){
        var body = JSON.stringify({
            board_id: board_id
        });
        return this.http.post(this.boardsUrl+"/usertags/find", body, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }

    listAll(): Promise<Array<Board>> {
        return this.http.get(this.boardsUrl)
            .toPromise()
            .then(res => res.json().result);
    }

    subscribe(boardId: number): Promise<void> {
        return this.http.put(this.subscriptionUrl(boardId), "")
            .toPromise()
            .then(() => {} );
    }
    
    unsubscribe(boardId: number): Promise<void> {
        return this.http.delete(this.subscriptionUrl(boardId))
            .toPromise()
            .then(() => {} );
    }

    getnumberofusers(boardid: number): Promise<number> {
        var body = JSON.stringify({
            boardid: boardid});
        return this.http.post(this.boardsUrl+"/getnumbers", body, this.defaultOpts())
            .toPromise()
            .then(res => res.json().result);
    }

}
