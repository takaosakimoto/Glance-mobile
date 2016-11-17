import {SessionService} from "./session.service"
import {ClientConfig} from "./config";
import {ResponseOptions, Response} from "@angular/http";

describe('SessionService', () => {

    let config: ClientConfig = {baseUrl: "https://test"};

    function response(data: any): Response {
        return new Response(new ResponseOptions({ body: JSON.stringify(data) }));
    }

    it('can log users in', (done) => {
        let http = jasmine.createSpyObj("http", ["put"]);
        let promise = Promise.resolve(response({id: 123, username: "jon"}));
        let service = new SessionService(config, http);
        http.put.and.returnValue({ toPromise: () => promise });

        service.login("jon", "letmein").then((data) => {
            expect(data).toEqual({id: 123, username: "jon"});
            expect(http.put).toHaveBeenCalledWith("https://test/sessions/current",
                JSON.stringify({username: "jon", password: "letmein"}));
            done();
        });
    });

    it('can log users out', () => {
        let http = jasmine.createSpyObj("http", ["delete"]);
        let service = new SessionService(config, http);
        let promise = Promise.resolve(response({id: 123, username: "jon"}));
        http.delete.and.returnValue({ toPromise: (data) => promise });

        service.logout();

        expect(http.delete).toHaveBeenCalledWith("https://test/sessions/current");
    });

    it('can return the current session', (done) => {
        let http = jasmine.createSpyObj("http", ["get"]);
        let promise = Promise.resolve(response({id: 123, username: "jon"}));
        let service = new SessionService(config, http);
        http.get.and.returnValue({ toPromise: (data) => promise });

        service.current().then((data) => {
            expect(http.get).toHaveBeenCalledWith("https://test/sessions/current");
            done();
        });
    });

});
