import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, ChartData } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PouchdbService } from 'src/app/services/pouchdb.service';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardData: ChartData = {
    success: false,
    chartDonut: [],
    chartBar: [],
    tableUsers: [],
  };
  
  isLoading = true;

  private donutRoot!: am5.Root;
  private barRoot!: am5.Root;

  constructor(
    private auth: AuthService,
    private pouch: PouchdbService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.auth.dashboard().subscribe({
      next: async (res) => {
        this.dashboardData = res;
        await this.pouch.saveDashboardData(res);
        
        this.isLoading = false;
        this.renderCharts();
      },
      error: async (err) => {
        console.error(err);
        const offlineData = await this.pouch.getDashboardData();

        if (offlineData) {
          this.dashboardData = offlineData;
          this.notify.show(
            'success',
            'Offline mode: showing the latest saved dashboard data.',
          );
          this.isLoading = false;
          this.renderCharts();
          return;
        }

        this.notify.show('error', 'Unable to load dashboard data.');
        this.isLoading = false;
      },
    });
  }

  private renderCharts() {
    setTimeout(() => {
      this.disposeCharts();
      this.renderDonutChart();
      this.renderBarChart();
    });
  }

  private disposeCharts() {
    if (this.donutRoot) {
      this.donutRoot.dispose();
    }

    if (this.barRoot) {
      this.barRoot.dispose();
    }
  }

  renderDonutChart() {
    this.donutRoot = am5.Root.new('donutChart');

    this.donutRoot.setThemes([am5themes_Animated.new(this.donutRoot)]);

    const chart = this.donutRoot.container.children.push(
      am5percent.PieChart.new(this.donutRoot, {
        layout: this.donutRoot.verticalLayout,
      }),
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(this.donutRoot, {
        valueField: 'value',
        categoryField: 'name',
        innerRadius: am5.percent(60),
      }),
    );

    series.data.setAll(this.dashboardData.chartDonut);
  }

  renderBarChart() {
    this.barRoot = am5.Root.new('barChart');

    this.barRoot.setThemes([am5themes_Animated.new(this.barRoot)]);

    const chart = this.barRoot.container.children.push(
      am5xy.XYChart.new(this.barRoot, {}),
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.barRoot, {
        categoryField: 'name',
        renderer: am5xy.AxisRendererX.new(this.barRoot, {
          minGridDistance: 10,
        }),
      }),
    );

    xAxis.data.setAll(this.dashboardData.chartBar);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.barRoot, {
        renderer: am5xy.AxisRendererY.new(this.barRoot, {}),
      }),
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(this.barRoot, {
        xAxis,
        yAxis,
        valueYField: 'value',
        categoryXField: 'name',
      }),
    );

    series.data.setAll(this.dashboardData.chartBar);
  }

  ngOnDestroy(): void {
    this.disposeCharts();
  }
}
