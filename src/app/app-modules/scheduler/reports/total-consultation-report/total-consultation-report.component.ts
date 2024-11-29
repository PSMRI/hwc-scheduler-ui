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
import { FormBuilder, FormGroup } from '@angular/forms';
import { SchedulerService } from '../../shared/services/scheduler.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import * as moment from 'moment';
import { SetLanguageComponent } from '../../../core/components/set-language.component';
import { HttpServiceService } from 'src/app/app-modules/core/services/http-service.service';
import * as ExcelJS from 'exceljs';
import * as saveAs from 'file-saver';
import { SessionStorageService } from 'src/app/app-modules/core/services/session-storage.service';

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

@Component({
  selector: 'app-total-consultation-report',
  templateUrl: './total-consultation-report.component.html',
  styleUrls: ['./total-consultation-report.component.css'],
})
export class TotalConsultationReportComponent implements OnInit, DoCheck {
  totalConsultationForm!: FormGroup;

  languageComponent!: SetLanguageComponent;
  currentLanguageSet: any;

  constructor(
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
    readonly sessionstorage: SessionStorageService

  ) {}

  providerServiceMapID: any;
  userID: any;
  totalConsultationList = [];
  today!: Date;
  minEndDate!: Date;
  maxEndDate!: Date;
  criteriaHead: any;

  ngOnInit() {
    this.providerServiceMapID = this.sessionstorage.getItem('tm-providerServiceMapID');
    this.userID = this.sessionstorage.getItem('tm-userID');
    this.fetchLanguageResponse();
    this.createTotalConsultationForm();

    /* Set Max date*/
    this.maxEndDate = new Date();
    this.today = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
  }
  createTotalConsultationForm() {
    this.totalConsultationForm = this.formBuilder.group({
      fromDate: null,
      toDate: null,
    });
  }
  get fromDate() {
    return this.totalConsultationForm.controls['fromDate'].value;
  }

  get toDate() {
    return this.totalConsultationForm.controls['toDate'].value;
  }

  checkEndDate() {
    if (this.toDate === null) {
      this.minEndDate = new Date(this.fromDate);
    } else {
      this.totalConsultationForm.patchValue({
        toDate: null,
      });
      if (this.fromDate !== undefined && this.fromDate !== null)
        this.minEndDate = new Date(this.fromDate);
    }
  }

  downloadReport(downloadFlag: boolean) {
    if (downloadFlag) {
      this.searchReport();
    }
  }

  searchReport() {
    const reqObjForTotalConsultationReport = {
      fromDate: new Date(
        this.fromDate.valueOf() -
          1 * this.fromDate.getTimezoneOffset() * 60 * 1000,
      ),
      toDate: new Date(
        this.toDate.valueOf() - 1 * this.toDate.getTimezoneOffset() * 60 * 1000,
      ),
      providerServiceMapID: this.providerServiceMapID,
      userID: this.userID,
      // fromDate: moment(this.fromDate).format('YYYY-MM-DD'),
      // toDate: moment(this.toDate).format('YYYY-MM-DD'),
    };
    console.log(
      'reqObjForTotalConsultationReport',
      JSON.stringify(reqObjForTotalConsultationReport, null, 4),
    );

    this.schedulerService
      .getTotalConsultationReports(reqObjForTotalConsultationReport)
      .subscribe({
        next: (response: any) => {
          console.log(
            'Json data of response: ',
            JSON.stringify(response, null, 4),
          );
          if (response.statusCode === 200) {
            this.totalConsultationList = response.data;
            this.createSearchCriteria();
          } else {
            this.confirmationService.alert(response.errorMessage, 'error');
          }
        },
        error: (err: any) => {
          this.confirmationService.alert(err, 'error');
        },
      });
  }
  createSearchCriteria() {
    const criteria: any = [];
    criteria.push({
      Filter_Name: 'From Month',
      value: moment(this.fromDate).format('MMM-YY'),
    });
    criteria.push({
      Filter_Name: 'To Month',
      value: moment(this.toDate).format('MMM-YY'),
    });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    if (criteria.length > 0) {
      const criteriaArray = criteria.filter(function (obj: any) {
        for (const key in obj) {
          if (obj[key] === null) {
            obj[key] = '';
          }
        }
        return obj;
      });
      if (criteriaArray.length !== 0) {
        this.criteriaHead = Object.keys(criteriaArray[0]);
        console.log('this.criteriaHead', this.criteriaHead);
      }
    }
    if (this.totalConsultationList.length > 0) {
      const array = this.totalConsultationList.filter(function (obj: any) {
        for (const key in obj) {
          if (obj[key] === null) {
            obj[key] = '';
          }
        }
        return obj;
      });
      if (array.length !== 0) {
        const head = Object.keys(array[0]);
        console.log('head', head);
        const wb_name = 'Total Consultation Report';

        // below code added to modify the headers

        let i = 65; // starting from 65 since it is the ASCII code of 'A'.
        let count = 0;
        while (i < head.length + 65) {
          let j;
          if (count > 0) {
            j = i - 26 * count;
          } else {
            j = i;
          }
          const cellPosition = String.fromCharCode(j);
          let finalCellName: any;
          if (count === 0) {
            finalCellName = cellPosition + '1';
            console.log(finalCellName);
          } else {
            const newcellPosition = String.fromCharCode(64 + count);
            finalCellName = newcellPosition + cellPosition + '1';
            console.log(finalCellName);
          }
          const newName = this.modifyHeader(head, i);
          // delete report_worksheet[finalCellName].w; report_worksheet[finalCellName].v = newName;
          i++;
          if (i === 91 + count * 26) {
            // i = 65;
            count++;
          }
        }
        // --------end--------

        const workbook = new ExcelJS.Workbook();
        const criteria_worksheet = workbook.addWorksheet('Criteria');
        const report_worksheet = workbook.addWorksheet('Report');

        report_worksheet.addRow(head);
        criteria_worksheet.addRow(this.criteriaHead);

        // Add data
        criteria.forEach((row: { [x: string]: any }) => {
          const rowData: any[] = [];
          this.criteriaHead.forEach((header: string | number) => {
            rowData.push(row[header]);
          });
          criteria_worksheet.addRow(rowData);
        });

        this.totalConsultationList.forEach((row: { [x: string]: any }) => {
          const rowData: any[] = [];
          head.forEach((header) => {
            rowData.push(row[header]);
          });
          report_worksheet.addRow(rowData);
        });

        // Write to file
        workbook.xlsx.writeBuffer().then((buffer: any) => {
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          saveAs(blob, wb_name + '.xlsx');
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, wb_name);
          } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('visibility', 'hidden');
            link.download = wb_name.replace(/ /g, '_') + '.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        });
      }
      this.confirmationService.alert(
        this.currentLanguageSet.totalConsultationReportDownloaded,
        'success',
      );
    } else {
      this.confirmationService.alert(this.currentLanguageSet.norecordfound);
    }
  }

  modifyHeader(headers: any, i: any) {
    let modifiedHeader: string;
    modifiedHeader = headers[i - 65]
      .toString()
      .replace(/([A-Z])/g, ' $1')
      .trim();
    modifiedHeader =
      modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.substring(1);
    return modifiedHeader.replace(/I D/g, 'ID');
  }

  //AN40085822 27/9/2021 Integrating Multilingual Functionality --Start--
  ngDoCheck() {
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  }
  //--End--
}
