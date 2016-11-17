import {Board} from "./board.model"
import {Notice} from "./notice.model";
import {User} from "./user.model";
import {BoardImage} from "./boardimage.model";
import {UserTag} from "./usertag.model";
export interface Dashboard {
    boards: Array<Board>
    notices: Array<Notice>
    boardimages: Array<BoardImage>
    profile: User
    tags: Map<number, Array<string>>
    myusertags: Array<UserTag>
}
