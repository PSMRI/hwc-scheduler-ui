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
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { HttpServiceService } from './services/http-service.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService } from './services/confirmation.service';
import { SpinnerService } from './services/spinner.service';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './services/auth-guard.service';
import { BeneficiaryDetailsService } from './services/beneficiary-details.service';
import { CameraService } from './services/camera.service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { CommonDialogComponent } from './components/common-dialog/common-dialog.component';
import { CameraDialogComponent } from './components/camera-dialog/camera-dialog.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { WebcamModule } from 'ngx-webcam';
import { NgChartsModule } from 'ng2-charts';
import { myEmailDirective } from './directives/email/myEmail.directive';
import { MyMobileNumberDirective } from './directives/MobileNumber/myMobileNumber.directive';
import { myNameDirective } from './directives/name/myName.directive';
import { myPasswordDirective } from './directives/password/myPassword.directive';
import { DisableFormControlDirective } from './directives/disableFormControl.directive';
import { NullDefaultValueDirective } from './directives/null-default-value.directive';
import { NumberValidatorDirective } from './directives/numberValidator.directive';
import { StringValidatorDirective } from './directives/stringValidator.directive';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ShowCommitAndVersionDetailsComponent } from './components/show-commit-and-version-details/show-commit-and-version-details.component';
import { PreviousDetailsComponent } from './components/previous-details/previous-details.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SetLanguageComponent } from './components/set-language.component';
import { TextareaDialogComponent } from './components/textarea-dialog/textarea-dialog.component';
import { TextareaDialog } from './components/textarea-dialog/textarea-dialog.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatListModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    WebcamModule,
    MatSidenavModule,
    NgChartsModule
  ],
  declarations: [
    // WebCamComponent,
    CommonDialogComponent,
    CameraDialogComponent,
    TextareaDialogComponent,
    SpinnerComponent,
    AppFooterComponent,
    SetLanguageComponent,
    AppHeaderComponent,
    PreviousDetailsComponent,
    ShowCommitAndVersionDetailsComponent,
    myEmailDirective,
    MyMobileNumberDirective,
    myNameDirective,
    myPasswordDirective,
    DisableFormControlDirective,
    NullDefaultValueDirective,
    NumberValidatorDirective,
    StringValidatorDirective 
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SetLanguageComponent,
    CommonDialogComponent,
    CameraDialogComponent,
    TextareaDialogComponent,
    SpinnerComponent,
    AppFooterComponent,
    AppHeaderComponent,
    PreviousDetailsComponent,
    FullCalendarModule,
    ShowCommitAndVersionDetailsComponent,
    myEmailDirective,
    MyMobileNumberDirective,
    myNameDirective,
    myPasswordDirective,
    myPasswordDirective,
    DisableFormControlDirective,
    NullDefaultValueDirective,
    NumberValidatorDirective,
    StringValidatorDirective
    
  ],
})
export class CoreModule {

  

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ConfirmationService,
        CameraService,
        BeneficiaryDetailsService,
        HttpInterceptorService,
        HttpServiceService,
        TextareaDialog,
        AuthGuard,
        AuthService,
        SpinnerService,
        CanDeactivateGuardService,
      ]
    };
  }
}

