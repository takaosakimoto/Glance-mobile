import {WelcomePage} from "./welcome.page";
import {LoginPage} from "../login/login.page";
import {SignupPage} from "../signup/signup.page";

describe('Visiting the welcome page', function(){

    let nav;
    let page: WelcomePage;

    beforeEach(() => {
        nav = jasmine.createSpyObj("nav", ["push"]);
        nav.push.and.returnValue(Promise.resolve(null));
        page = new WelcomePage(nav)
    });

    it('can click the login button', (done) => {
        page.login().then(() => {
            expect(nav.push).toHaveBeenCalledWith(LoginPage);
            done();
        });
    });

    it('can click the register button', (done) => {
        page.signup().then(() => {
            expect(nav.push).toHaveBeenCalledWith(SignupPage);
            done();
        });
    });

});
