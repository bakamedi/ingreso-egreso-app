import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { FormsModule } from "@angular/forms";
import { AngularFireAuthModule } from "angularfire2/auth";
import { CommonModule } from "@angular/common";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { RouterModule } from "@angular/router";
import { SnotifyModule, ToastDefaults, SnotifyService } from "ng-snotify";



@NgModule({
  declarations:[
    LoginComponent,
    RegisterComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularFireAuthModule,
    RouterModule,
    Ng4LoadingSpinnerModule.forRoot(),
    SnotifyModule
  ],
  providers: [
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ]
})
export class AuthModule {}
