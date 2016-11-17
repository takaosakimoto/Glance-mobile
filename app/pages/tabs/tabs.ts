import { Component } from '@angular/core';
import {AnotherNoticePage} from "../another-notice/another-notice.page";
import { DashboardPage } from '../dashboard/dashboard.page';
import {FindBoardsPage} from "../find-boards/find-boards.page";
import {SettingsPage} from "../settings/settings.page";

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = DashboardPage;
  tab2Root: any = FindBoardsPage;
  tab3Root: any = SettingsPage;

  constructor() {

  }
}
