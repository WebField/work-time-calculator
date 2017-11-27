import { Component, OnInit } from '@angular/core';
import { Utility } from '../../utils/utility';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import { WorkingHoursService } from '../../services/working-hours/working-hours.service';
import { WorkingHours } from '../../models/working-hours';

@Component({
	selector: 'chy-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	todaysDate = new Date();
	chartMonth = new Date();
	todaysLink: string;
	chartLink: string;
	dataFound = true;
	chartData: WorkingHours[];
	// TODO: remove this workaround. Necessary as the async time causes an error whenn building the prod package.
	async: any;

	constructor(private router: Router, private workingHoursService: WorkingHoursService) {
		this.todaysLink = '/working-hours/' + Utility.encodeDate(this.todaysDate);
		this.updateChart();
	}

	ngOnInit() {
	}

	nextMonth(): void {
		this.chartMonth = moment(this.chartMonth).add(1, 'month').date(1).toDate();
		this.updateChart();
	}

	previousMonth(): void {
		this.chartMonth = moment(this.chartMonth).subtract(1, 'month').date(1).toDate();
		this.updateChart();
	}

	updateChart(): void {
		this.chartLink = '/working-hours/' + Utility.encodeDate(this.chartMonth);

		const startDate = Utility.encodeDate(moment(this.chartMonth).startOf('month').toDate());
		const endDate = Utility.encodeDate(moment(this.chartMonth).endOf('month').toDate());


		const from = startDate;
		const to = endDate;
		this.workingHoursService.onFilterData(from, to).then(data => {
			this.chartData = data;
			(data.length > 0) ? this.dataFound = true : this.dataFound = false;
		});
	}

	navigateToWorkingHours(): void {
		this.router.navigate([this.todaysLink]);
	}

	navigateToChartMonth(): void {
		this.router.navigate([this.chartLink]);
	}

	navigateToProjects(): void {
		this.router.navigate(['/projects']);
	}
}
