import {Dashboard} from "./dashboard.model";
import {Injectable, Inject, EventEmitter} from "@angular/core";
import 'rxjs/Rx';
import {DashboardService} from "./dashboard.service";

@Injectable()
export class DashboardCache {

    protected cachedMyDashboard: Promise<Dashboard> = null;
    
    public updated = new EventEmitter<Promise<Dashboard>>();

    constructor(@Inject(DashboardService) protected service: DashboardService) {
    }

    myDashboard(): Promise<Dashboard> {
        if (this.cachedMyDashboard == null) {
            console.log("Dashboard was not in cache");
            this.cachedMyDashboard = this.service.myDashboard();
            this.updated.emit(this.cachedMyDashboard);
        }
        return this.cachedMyDashboard;
    }
    
    invalidate() {
        console.log("Invalidated dashboard cache");
        this.cachedMyDashboard = null;
        this.updated.emit(null);
    }

}

