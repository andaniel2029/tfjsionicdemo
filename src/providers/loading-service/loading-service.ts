import { Injectable } from '@angular/core';
import {LoadingController} from "ionic-angular";

@Injectable()
export class LoadingServiceProvider {

  loader: any = null;

  constructor(private loadingController: LoadingController) {
  }

  private showLoadingHandler(message) {
    if (this.loader == null) {
      this.loader = this.loadingController.create({
        content: message
      });
      this.loader.present();
    } else {
      this.loader.data.content = message;
    }
  }

  private hideLoadingHandler() {
    if (this.loader != null) {
      this.loader.dismiss();
      this.loader = null;
    }
  }

  public showLoader(message) {
    this.showLoadingHandler(message);
  }

  public hideLoader() {
    this.hideLoadingHandler();
  }
}
