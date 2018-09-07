import { Injectable } from '@angular/core';
import {SnotifyService} from 'ng-snotify';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snotifyService: SnotifyService) { }

  toastSuccess(content: string) {
    return this.snotifyService.success(content, {
      position: "rightBottom",
      timeout: 5000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }

  toastError(content: string) {
    return this.snotifyService.error(content, {
      position: "rightBottom",
      timeout: 5000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }

}
