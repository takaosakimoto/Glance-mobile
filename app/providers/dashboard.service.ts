import {Dashboard} from "./dashboard.model";
import {Injectable, Inject} from "@angular/core";
import {ClientConfig} from "./config";
import {Http} from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class DashboardService {

    protected dashboardUrl: string;

    constructor(@Inject(ClientConfig) protected config:ClientConfig,
                @Inject(Http) protected http:Http) {
        this.dashboardUrl = config.baseUrl + "/dashboard";
    }

    myDashboard(): Promise<Dashboard> {
        return this.http.get(this.dashboardUrl)
            .toPromise()
            .then(res => res.json());
    }

}

