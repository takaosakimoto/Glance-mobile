


import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Board} from "../../providers/board.model";
import {BoardImage} from "../../providers/boardimage.model";

@Component({
    selector: 'board-slider',
    templateUrl: 'build/components/board-slider/board-slider.html'
})
export class BoardSlider{

    @Input() boards: Array<Board> = [];
    @Input() boardimages: Array<BoardImage> = [];

    @Output() select = new EventEmitter();

    protected selected: string;
    public height: any;
    public width: any;
    public filterflag: boolean = false;
    public displayddl: string = "none";

    boardimage: string;

    constructor() {
       // this.onClickAll();
       this.onClickposts();
    }
  
    isimagevisible(board: Board): boolean {
        if(board.imagename){
            return true;
        }else{
            return false;
        }

    }

    onClickposts(){
        this.filterflag= !this.filterflag;
        this.displayddl = this.filterflag ? "none" : "inline";
        if(this.filterflag){
            this.selected = "Filter posts by community";
            this.select.emit([0]);
        } else {
            this.selected = "All community posts";
        }
    }

    onClickAll() {
        this.selected = "All recent notices";
        this.select.emit([0]);
    }

    onClick(board) {
        this.selected = board.name;
        this.select.emit([board.id]);
    }
}
