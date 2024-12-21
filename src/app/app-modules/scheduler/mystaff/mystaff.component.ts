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
import { Component, DoCheck, OnInit } from '@angular/core';
import { SchedulerService } from '../shared/services';
import { Router } from '@angular/router';
import { SetLanguageComponent } from '../../core/components/set-language.component';
import { HttpServiceService } from '../../core/services/http-service.service';
import { SessionStorageService } from 'Common-UI/src/registrar/services/session-storage.service';

@Component({
  selector: 'app-mystaff',
  templateUrl: './mystaff.component.html',
  styleUrls: ['./mystaff.component.css']
})
export class MystaffComponent implements OnInit,DoCheck {

  specialistList: any = [];
  filterTerm: any;
  filteredSpecialistList: any = [];
  specializationMaster: any = [];
  selectedSpecialization: any;
  currentLanguageSet:any;
  languageComponent!: SetLanguageComponent;

  constructor(private schedulerService: SchedulerService,
    public httpServiceService:HttpServiceService,
    readonly sessionstorage: SessionStorageService,
    private router: Router) { }

  ngOnInit() {
    const specialistListReq = {
      "specializationID": 0,
      "providerServiceMapID": this.sessionstorage.getItem('tm-providerServiceMapID'),
      "userID": this.sessionstorage.getItem('tm-userID')
    }
    this.fetchLanguageResponse();
    this.getAllSpecialist(specialistListReq);
    this.getSpecialisationMaster();
  }

  getAllSpecialist(specialistListReq: any) {
    this.schedulerService.getAllSpecialist(specialistListReq).subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.specialistList = response.data;
        this.filteredSpecialistList = response.data;
      }
      console.log('Specialist List..', this.specialistList);
    })
  }

  getSpecialisationMaster() {
    this.schedulerService.getSpecializationMaster()
      .subscribe((res: any) => {
        if (res.statusCode === 200 && res.data) {
          this.specializationMaster = res.data;
        }
      });
  }

  openProfile(specialist: any) {
    console.log('Opening profile..');
    const userID = specialist.userID;
    this.sessionstorage.setItem('supervisor-specialistID',userID);
    
    this.router.navigate(['telemedicine/profile', userID]);
  }

  filterSpecialist() {
    const filter1 = this.specialistList;
    const filter2 = this.filterBySearch(this.filterTerm, filter1);
    const filter3 = this.filterBySpec(this.selectedSpecialization, filter2);

    this.filteredSpecialistList = filter3;
  }

  filterBySpec(selectedSpecialization: string, filteredSpecialist: any) {
    if (selectedSpecialization === undefined || selectedSpecialization === null || selectedSpecialization === "All") {
      return filteredSpecialist;
    } else {
      const filteredSpecialistList: any = [];
      filteredSpecialist.forEach((item: any) => {
        if (item.specialization === this.selectedSpecialization) {
          filteredSpecialistList.push(item);
        }
      });
      return filteredSpecialistList;
    }
  }

  filterBySearch(searchTerm: string, filteredSpecialist: any) {
    console.log('filteredSpecialist', filteredSpecialist);
    if (searchTerm === undefined || searchTerm === null || searchTerm === "") {
      return filteredSpecialist;
    } else {
      const filteredSpecialistList: any = [];
      filteredSpecialist.forEach((item: any) => {
        console.log("item", JSON.stringify(item, null, 4));
        for (const key in item) {
          if (
            key === "firstName" || key === "lastName"
          ) {
            const value: string = "" + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              filteredSpecialistList.push(item);
              break;
            }
          }
        }
        console.log('filteredSpecialistList', filteredSpecialistList);
      });
      return filteredSpecialistList;
    }
  }

  // AV40085804 27/09/2021 Integrating Multilingual Functionality -----Start-----
  ngDoCheck() {
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  }
  // -----End------
}
