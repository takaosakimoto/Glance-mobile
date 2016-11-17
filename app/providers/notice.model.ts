
export interface Notice {
    id: number;
    title: string;
    description: string;
    url: string;
    noticestate: boolean;
 // occurs_at?: Date;
 //  finishes_at?: Date;
    occurs_at?: String;
   finishes_at?: String;
   noticedate?: String;
    posted_by: number;
    board_id: number;
    location_text: string;
}
