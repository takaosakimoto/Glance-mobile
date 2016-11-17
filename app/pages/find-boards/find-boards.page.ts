import {Page, NavController, Alert} from "ionic-angular/index";
import {Component, Inject} from "@angular/core";
import {BoardService} from "../../providers/board.service";
import {Board} from "../../providers/board.model";
import {DashboardCache} from "../../providers/dashboard.cache";
import {Notice} from "../../providers/notice.model";
import {SelectTagPage} from "../select-tag/select-tag.page";
@Component({
    templateUrl: 'build/pages/find-boards/find-boards.html',
})
export class FindBoardsPage {

    protected boards: Array<Board> = [];
    protected dirty: Set<number> = new Set<number>();
    protected filtered: Array<Board> = [];
    protected loaded: boolean = false;
    protected failed: boolean = false;
    public subscribed: boolean=false;

    constructor(protected nav: NavController,
                protected service: BoardService,
                protected dashboard: DashboardCache) {
        this.initializeBoards();
    }

    initializeBoards(): Promise<void> {
        return this.dashboard.myDashboard().then(dashboard => {
            this.boards = dashboard.boards;
            this.filtered = dashboard.boards;
            this.failed = false;
            this.loaded = true;
            console.log("Retrieved boards", dashboard.boards.length);
        }).catch((err) => {
            console.log("Failed to retrieve boards", err);
            this.loaded = true;
            this.failed = true;
        });
    }

    filterBoards(event) {
        this.filtered = this.boards;

        var q = event.target.value.toLowerCase().trim();

        console.log("Searching for boards", q);

        if (q == '') {
            return;
        }

        this.filtered = this.boards.filter(board => {
            return board.description.toLowerCase().indexOf(q) > -1 ||
                board.name.toLowerCase().indexOf(q) > -1;
        });
    }

    toggleSubscription(board: Board): Promise<void> {
        if (board.is_member) {
            this.subscribed=false;
            return this.service.unsubscribe(board.id);
        } else {
            this.subscribed=true;
            return this.service.subscribe(board.id);
        }
    }
    onPageDidEnter(){
       this.dashboard.invalidate();
        
    }

    onClickBoard(board: Board) {
        
        
        if(!board.is_manager){
            this.dirty.add(board.id);
            this.toggleSubscription(board).then(() => {
                board.is_member = !board.is_member;
                console.log("Changed subscription");
                if(this.subscribed){
                    this.nav.push(SelectTagPage, {boardid: board.id});
                }
            
            }).catch(err => {
                console.log("Failed to change subscription", err);
            }).then(() => {
                this.dirty.delete(board.id);
            });
        }
        
       // this.nav.push(SelectTagPage, {boardid: board.id});


    }
}
