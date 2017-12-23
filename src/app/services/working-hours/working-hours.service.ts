import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AuthService } from '../../user/auth.service';
import { WorkingHours } from '../../models/working-hours';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DayWorkingHours } from '../../models/day-working-hours';
import { environment } from '../../../environments/environment';


@Injectable()
export class WorkingHoursService {
	dataIsLoading = new BehaviorSubject<boolean>(false);
	dataChange: BehaviorSubject<WorkingHours[]> = new BehaviorSubject<WorkingHours[]>([]);
	dataLoadFailed = new Subject<boolean>();


	get data(): WorkingHours[] {
		if (this.dataChange.value) {
			return this.dataChange.value;
		}
	}

	constructor(private http: HttpClient,
				private authService: AuthService) {
	}

	onStoreData(data: WorkingHours, date: string) {

		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			if (err) {
				console.log(err);
			} else {
				this.http.post(`${environment.apiWorkingHours}/${date}`, data, {
					headers: new HttpHeaders().set('Authorization', session.getIdToken().getJwtToken())
				})
					.subscribe(
						(result: WorkingHours[]) => {
							this.dataLoadFailed.next(false);
							this.dataIsLoading.next(false);

							console.log(result);
							this.dataChange.next(result);
						},
						(error) => {
							console.log(error);
							this.dataIsLoading.next(false);
							this.dataLoadFailed.next(true);
						}
					);
			}
		});
	}

	onRetrieveData(date: string) {
		this.dataChange.next(null);
		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			this.http.get(`${environment.apiWorkingHours}/${date}`, {
				headers: new HttpHeaders().set('Authorization', session.getIdToken().getJwtToken())
			})
				.subscribe((data: WorkingHours[]) => {
						console.log('DATA: ', data);
						if (data) {
							this.dataChange.next(data);
						} else {
							this.dataLoadFailed.next(true);
						}
						this.dataIsLoading.next(false);
					},
					(error) => {
						console.log(error);
						this.dataLoadFailed.next(true);
						this.dataIsLoading.next(false);
						this.dataChange.next(null);
					}
				);
		});
	}

	onUpdateData(data: WorkingHours, date: string) {

		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		const index = this.data.map((wh: WorkingHours) => wh.id).indexOf(data.id);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			if (err) {
				console.log(err);
			} else {
				this.http.put(`${environment.apiWorkingHours}/${date}`, data, {
					headers: new HttpHeaders().set('Authorization', session.getIdToken().getJwtToken()),
					params: new HttpParams().set('index', index.toString())
				})
					.subscribe(
						(result: WorkingHours[]) => {
							this.dataLoadFailed.next(false);
							this.dataIsLoading.next(false);

							console.log(result);
							this.dataChange.next(result);
						},
						(error) => {
							console.log(error);
							this.dataIsLoading.next(false);
							this.dataLoadFailed.next(true);
						}
					);
			}
		});
	}

	onFilterData(from: string, to: string, notNext?: boolean): Promise<WorkingHours[]> {
		return new Promise<WorkingHours[]>((resolve, reject) => {
			this.dataChange.next(null);
			this.dataLoadFailed.next(false);
			this.dataIsLoading.next(true);

			this.authService.getAuthenticatedUser().getSession((err, session) => {
				this.http.get(environment.apiWorkingHours, {
					headers: new HttpHeaders().set('Authorization', session.getIdToken().getJwtToken()),
					params: new HttpParams()
						.set('from', from)
						.set('to', to)
				})
					.subscribe((data: DayWorkingHours[]) => {
							console.log('DATA: ', data);
							if (data) {
								let workingHours = [];
								data.map((day: DayWorkingHours) => {
									const whs = day.events.map((work: WorkingHours) => work);
									workingHours = workingHours.concat(whs);
								});
								if (!notNext) {
									this.dataChange.next(workingHours);
								}
								resolve(workingHours);
							} else {
								reject('Failed filtering working hours.');
							}
							this.dataIsLoading.next(false);
						},
						(error) => {
							console.log(error);
							this.dataLoadFailed.next(true);
							this.dataIsLoading.next(false);
						}
					);
			});

		})
	}

	onDeleteData(data: WorkingHours, date: string) {
		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		const index = this.data.map((wh: WorkingHours) => wh.id).indexOf(data.id);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			this.http.delete(`${environment.apiWorkingHours}/${date}?index=${index}`, {
				headers: new HttpHeaders().set('Authorization', session.getIdToken().getJwtToken())
			})
				.subscribe(
					(result: WorkingHours[]) => {
						console.log(data);

						this.dataChange.next(result);

						this.dataLoadFailed.next(false);
						this.dataIsLoading.next(false);
					},
					(error) => {
						this.dataLoadFailed.next(true);
						this.dataIsLoading.next(false);
					}
				);
		});
	}
}