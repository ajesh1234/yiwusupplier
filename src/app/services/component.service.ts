import { Injectable } from '@angular/core';
import { ToastController,LoadingController } from '@ionic/angular';
import {Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
	loading: any;
  constructor(public toastControllter:ToastController, public loadingController:LoadingController) { }
  private channels: { [key: string]: Subject<any>; } = {};

  
	async presentLoading() {
		this.loading = await this.loadingController.create({});
		await this.loading.present();
	}

	async stopLoading() {
		if (this.loading != undefined) {
			await this.loadingController.dismiss();
		}
		else {
			var self = this;
			setTimeout(function () {
				self.stopLoading();
			}, 1000);
		}
	}
  async presentToast(message, color) {
		const toast = await this.toastControllter.create({
			message: message,
			duration: 2000,
			position: 'bottom',
      color:color == 'error' ? 'danger' : color,
			// showCloseButton: true
		});
		toast.present();
	}

	
  /**
   * Subscribe to a topic and provide a single handler/observer.
   * @param topic The name of the topic to subscribe to.
   * @param observer The observer or callback function to listen when changes are published.
   *
   * @returns Subscription from which you can unsubscribe to release memory resources and to prevent memory leak.
   */
   eventsubscribe(topic: string, observer: (_: any) => void): Subscription {
	if (!this.channels[topic]) {
		this.channels[topic] = new Subject<any>();
	}

	return this.channels[topic].subscribe(observer);
}

/**
 * Publish some data to the subscribers of the given topic.
 * @param topic The name of the topic to emit data to.
 * @param data data in any format to pass on.
 */
eventpublish(topic: string, data: any): void {
	const subject = this.channels[topic];
	if (!subject) {
		// Or you can create a new subject for future subscribers
		return;
	}

	subject.next(data);
}
async presentContactToast(message, color) {
	const toast = await this.toastControllter.create({
		message: message,
		duration: 5000,
		position: 'bottom',
  color:color == 'error' ? 'danger' : color,
		// showCloseButton: true
	});
	toast.present();
}

}
