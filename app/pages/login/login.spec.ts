import {LoginPage} from "./login.page";
//import {DashBoardPage} from "../../users/dashboard/dashboard.page";
import {DashboardPage} from "../dashboard/dashboard.page";
import {beforeEachProviders, inject, it, injectAsync} from '@angular/core/testing';
import {NavController} from "ionic-angular/index";
//import {SessionService} from "../../client/session.service";
import {SessionService} from "../../providers/session.service";
import {TestComponentBuilder} from "@angular/compiler/testing";

describe('LoginPage', function(){

    let nav;
    let sessions;

    beforeEachProviders(() => {
        nav = jasmine.createSpyObj("nav", ["push"]);
        sessions = jasmine.createSpyObj("sessions", ["login"]);
        return [
            {provide: NavController, useValue: nav},
            {provide: SessionService, useValue: sessions},
            LoginPage
        ]
    });

    it('it is initialized correctly', injectAsync([ TestComponentBuilder ], (tcb) => {
        return tcb.createAsync(LoginPage).then((page) => {
            expect(page).toBeDefined();
            expect(page.componentInstance.nav).toBeDefined();
            expect(page.componentInstance.sessions).toBeDefined();
            expect(page.componentInstance.serverErrors).toEqual({});
            expect(page.nativeElement.querySelector('input[type="email"]')).toBeDefined();
            expect(page.nativeElement.querySelector('input[type="password"]')).toBeDefined();
            expect(page.nativeElement.querySelector('button[type="submit"]')).toBeDefined();
        });
    }));

/*
    it('databinds fields and triggers the submit method', injectAsync([ TestComponentBuilder ], (tcb) => {
        return tcb.createAsync(LoginPage).then((page) => {
            sessions.login.and.returnValue(Promise.resolve({username: "a@b.com", fullname: "jon d", id: 123}));

            page.nativeElement.querySelector('#username').value = "a@a.com";
            page.nativeElement.querySelector('#password').value = "aaaaa";
            // this fails with "Error: No value accessor for '' at new BaseException"
            page.detectChanges();
            page.nativeElement.querySelector('button[type="submit"]').click();

            expect(sessions.login).toHaveBeenCalledWith("a@b.coom", "aaaaa");
            expect(nav.push).toHaveBeenCalledWith(DashBoardPage);
        });
    }));


    it('accepts a successful log in old', injectAsync([ LoginPage ], (page) => {

        page.user.username = "jon";
        page.user.password = "letmein";

        page.sessions.login.and.returnValue(Promise.resolve({username: "jon", fullname: "jon d", id: 123}));

        return page.submit().then(() => {
            expect(page.sessions.login).toHaveBeenCalledWith("jon", "letmein");
            expect(page.nav.push).toHaveBeenCalledWith(DashBoardPage);
        });
    }));


    it('rejects an unsuccessful login', injectAsync([ LoginPage ], (page) => {
        page.user.username = "jon";
        page.user.password = "letmein";

        page.sessions.login.and.returnValue(Promise.reject({unauthorized: true}));

        return page.submit().then(() => {
            expect(page.sessions.login).toHaveBeenCalledWith("jon", "letmein");
            expect(page.nav.push).not.toHaveBeenCalled();
            expect(page.errors).toEqual({unauthorized: true});
        });
    }));
*/
});
