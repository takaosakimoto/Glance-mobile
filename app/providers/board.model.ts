

export interface Board {
    id: number;
    name: string;
    location_text: string;
    description: string;
    invite_code: string;
    is_member?: boolean;
    is_manager?: boolean;
    joined_at?: Date;
    // boardlogo: any;
    // logoext: string;
     imagename?: any;
}
