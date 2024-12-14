/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Component, OnInit, Input, Output, Optional, EventEmitter, ViewChild, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { HttpServiceService } from '../../services/http-service.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ShowCommitAndVersionDetailsComponent } from '../show-commit-and-version-details/show-commit-and-version-details.component';
import { SessionStorageService } from 'Common-UI/src/registrar/services/session-storage.service';
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit, AfterContentChecked {
  @ViewChild('activeTCSpecialist')
  private activeTCSpecialist!: RouterLinkActive;
  
  @ViewChild('activeReport')
  private activeReport!: RouterLinkActive;

  @Input()
  showRoles!: boolean;
  language_file_path: any = "./assets/";
  app_language: any = "English";
  currentLanguageSet: any;
  languageArray: any;
  status: any;
  isConnected=true;

  servicePoint!: string;
  userName!: string;
  isAuthenticated!: boolean;
  roles: any;

  filteredNavigation: any;
  navigation: any;
  reportNavigation: any;
  license:any;

  updateCSSToShowActiveTCSpecialist = false;
  updateCSSToShowActiveReport = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
    readonly sessionstorage: SessionStorageService,
    private dialog: MatDialog) { }
  
  ngOnInit() {
    this.getUIVersionAndCommitDetails()
     this.license = environment.licenseUrl;
     const servicePointName: any = this.sessionstorage.getItem('tm-servicePointName');
    this.servicePoint = servicePointName;
    const tmUserName: any = this.sessionstorage.getItem('tm-userName');
    this.userName = tmUserName;
    this.fetchLanguageSet();
    this.isAuthenticated = sessionStorage.getItem('tm-isAuthenticated') === 'true' ? true : false;
    
  }

  ngAfterContentChecked(): void {
    if (this.activeTCSpecialist !== undefined && this.activeTCSpecialist.isActive) {
        console.log('isActive');
        this.updateCSSToShowActiveTCSpecialist = true;
    } else{
      this.updateCSSToShowActiveTCSpecialist = false;
    }
    if (this.activeReport !== undefined && this.activeReport.isActive) {
      console.log('isActive');
      this.updateCSSToShowActiveReport = true;
    } else{
      this.updateCSSToShowActiveReport = false;
    }
  }

  fetchLanguageSet() {
    this.httpServiceService.fetchLanguageSet().subscribe((languageRes: any) => {
      if (languageRes && Array.isArray(languageRes.data)) {
        this.languageArray = languageRes.data;
        this.getLanguage();
      }
    });
    console.log('language array' + this.languageArray);
  }

  changeLanguage(language: any) {
    
    this.httpServiceService.getLanguage(this.language_file_path+language+".json").subscribe(response => {
      if(response){
        this.languageSuccessHandler(response,language)
      }else{
        alert(this.currentLanguageSet.langNotDefined)
      }      
    },error => {
      alert(this.currentLanguageSet.comingUpWithThisLang + " " + language);
      
    }
    );
  }

  getLanguage() {
    if (sessionStorage.getItem('setLanguage') !== null) {
      this.changeLanguage(sessionStorage.getItem('setLanguage'));
    } else {
      this.changeLanguage(this.app_language);
    }
  }

  languageSuccessHandler(response: any, language: any) {
    console.log("language is ", response);
    if (response === undefined) {
      alert(this.currentLanguageSet.langNotDefined)
    }

    if (response[language] !== undefined) {
      this.currentLanguageSet = response[language];
      sessionStorage.setItem('setLanguage', language);
      if (this.currentLanguageSet) {
        this.languageArray.forEach((item: any) => {
          if (item.languageName === language) {
            this.app_language = language;
          
          }

        });
      } else {
        this.app_language = language;
      }
     
      this.httpServiceService.getCurrentLanguage(response[language]);
      this.rolenavigation();
    } else {
      alert(this.currentLanguageSet.comingUpWithThisLang + " " + language);
    }
  }

  rolenavigation(){
  this.navigation = [
    {
      role: 'Supervisor',
      label: this.currentLanguageSet.supervisor,
       work: [
        // { link: ['/telemedicine/timesheet', 'Supervisor'], label: 'Timesheet' },
        { link: '/telemedicine/myStaff', label: this.currentLanguageSet.myStaff },
        { link: 'specialization/dayview', label: this.currentLanguageSet.dayView },
        { link: 'smstemplate', label: this.currentLanguageSet.sMSTemplate }
        // { link: 'appointment/view', label: 'Appointment View' },

      ]
    },
    {
      role: "TC Specialist",
      label: this.currentLanguageSet.tCSpecialist,
       work: [
        { link: ['/telemedicine/timesheet', 'TC Specialist'], label: this.currentLanguageSet.timesheet }
      ]
    }

  ];

  this.reportNavigation = [{
    role: 'Reports',
    label: this.currentLanguageSet.report,
    work: [
      { link: 'chiefComplaintReport', label: this.currentLanguageSet.chiefComplaintReport },
      { link: 'totalConsultationReport', label: this.currentLanguageSet.totalConsultationReport },
      { link: 'consultationReport', label: this.currentLanguageSet.consultationReport },
      { link: 'monthlyReport', label: this.currentLanguageSet.monthlyReport },
      { link: 'dailyReport', label: this.currentLanguageSet.dailyReport }
    ]
  }]

  if (this.showRoles) {
    const tmRoles: any = this.sessionstorage.getItem('tm-roles');
    this.roles = JSON.parse(tmRoles);
    if (this.roles) {
      this.filteredNavigation = this.navigation.filter((item: any) => {
        return this.roles.includes(item.role);
      })
    }
    console.log(' this.filteredNavigation', this.filteredNavigation);

  }
  }

  DataSync() {
    this.router.navigate(['/datasync'])
  }

  redirectToSpecialistWorklist() {
    const returnUrl: any = this.sessionstorage.getItem('tm-return');
    window.location.href = returnUrl;
  }

  returnToMMU: any;
  logout() {
    const loginUrl: any = this.sessionstorage.getItem('tm-fallback');
    this.auth.logout().subscribe({
      next: (res: any) => {
        this.auth.removeExternalSessionData();
        window.location.href = loginUrl;
      },
      error: (error: any) => {
        this.auth.removeExternalSessionData();
        window.location.href = loginUrl;
      },
    });
  }
  getSwymedLogout() {
    this.auth.getSwymedLogout().subscribe((res: any) => {
      window.location.href = res.data.response;
      this.logout();
    });
  }


  commitDetailsUI: any;
  versionUI: any
  getUIVersionAndCommitDetails() {
    const commitDetailsPath: any = "assets/git-version.json";
    this.auth.getUIVersionAndCommitDetails(commitDetailsPath).subscribe((res) => {
      console.log('res', res);
      this.commitDetailsUI = res
      this.versionUI = this.commitDetailsUI['version']
    }, err => {
      console.log('err', err);

    })
  }

  showVersionAndCommitDetails() {
    this.auth.getAPIVersionAndCommitDetails().subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.constructAPIAndUIDetails(res.data);
        }
      },
    });
  }
  constructAPIAndUIDetails(apiVersionAndCommitDetails: any) {
    const data = {
      commitDetailsUI: {
        version: this.commitDetailsUI['version'],
        commit: this.commitDetailsUI['commit']
      },
      commitDetailsAPI: {
        version: apiVersionAndCommitDetails['git.build.version'] || 'NA',
        commit: apiVersionAndCommitDetails['git.commit.id'] || 'NA'
      }
    }
    if (data) {
      this.showData(data)
    }
  }
  showData(versionData: any) {
    const dialogRef = this.dialog.open(ShowCommitAndVersionDetailsComponent, {
      data: versionData
    });

  }

}
