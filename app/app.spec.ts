import { ADDITIONAL_TEST_BROWSER_PROVIDERS, TEST_BROWSER_STATIC_PLATFORM_PROVIDERS } from '@angular/platform-browser/testing/browser_static';
import { BROWSER_APP_DYNAMIC_PROVIDERS } from '@angular/platform-browser-dynamic';
import { resetBaseTestProviders, setBaseTestProviders } from '@angular/core/testing';
import { MyApp } from './app';

resetBaseTestProviders();
setBaseTestProviders(
    TEST_BROWSER_STATIC_PLATFORM_PROVIDERS,
    [
        BROWSER_APP_DYNAMIC_PROVIDERS,
        ADDITIONAL_TEST_BROWSER_PROVIDERS,
    ]
);

describe('ClickerApp', () => {

});
