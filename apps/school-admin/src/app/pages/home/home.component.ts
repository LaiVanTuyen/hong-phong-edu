import { Component, AfterViewInit, OnDestroy } from '@angular/core';

declare var feather: any;
declare var $: any;
declare var ApexCharts: any;

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  title = 'Welcome to School Admin';
  stats = [
    { label: 'Total Students', value: 1250 },
    { label: 'Total Teachers', value: 85 },
    { label: 'Classes', value: 42 }
  ];

  ngAfterViewInit(): void {
    // Initialize feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

    // Delay to ensure DOM containers exist then init charts
    setTimeout(() => {
      this.initCharts();
    }, 200);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private initCharts(): void {
    if (typeof ApexCharts === 'undefined') return;

    this.renderBarChart();
    this.renderStackedBarChart();
    this.renderLineChart();
    this.renderDonutChart();
    this.renderCustomerRadialChart();
    this.renderSalesStatisticsChart();
    this.renderSalesDayChart();
    this.renderHeatChart();
  }

  private renderBarChart(): void {
    const el = document.querySelector('#s-col');
    if (!el) return;
    el.innerHTML = '';
    const options = {
      series: [{ name: 'Sales', data: [44, 55, 57, 56, 61, 58, 63, 60, 66] }],
      chart: { type: 'bar', height: 200, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] }
    };
    new ApexCharts(el, options).render();
  }

  private renderStackedBarChart(): void {
    const el = document.querySelector('#s-col-stacked');
    if (!el) return;
    el.innerHTML = '';
    const options = {
      series: [
        { name: 'Product A', data: [44, 55, 41, 67, 22] },
        { name: 'Product B', data: [13, 23, 20, 8, 13] }
      ],
      chart: { type: 'bar', height: 200, stacked: true, toolbar: { show: false } },
      xaxis: { categories: ['2019', '2020', '2021', '2022', '2023'] }
    };
    new ApexCharts(el, options).render();
  }

  private renderLineChart(): void {
    const el = document.querySelector('#sales_charts');
    if (!el) return;
    el.innerHTML = '';
    const options = {
      series: [{ name: 'Sales', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }],
      chart: { type: 'line', height: 350 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] }
    };
    new ApexCharts(el, options).render();
  }

  private renderDonutChart(): void {
    const el = document.querySelector('#sales-analysis');
    if (!el) return;
    el.innerHTML = '';
    const options = {
      series: [44, 55, 13, 43],
      chart: { type: 'donut', height: 300 },
      labels: ['Product A', 'Product B', 'Product C', 'Product D']
    };
    new ApexCharts(el, options).render();
  }

  private renderCustomerRadialChart(): void {
    const el = document.querySelector('#customer-chart');
    if (!el) return;
    el.innerHTML = '';
    const options = {
      chart: { height: 150, type: 'radialBar', toolbar: { show: false } },
      plotOptions: {
        radialBar: {
          hollow: { size: '30%' },
          dataLabels: { name: { offsetY: -5 }, value: { offsetY: 5 } }
        }
      },
      stroke: { lineCap: 'round' },
      colors: ['#E04F16', '#0E9384'],
      series: [70, 70],
      labels: ['First Time', 'Return']
    };
    new ApexCharts(el, options).render();
  }

  private renderSalesStatisticsChart(): void {
    const el = document.querySelector('#sales-statistics');
    if (!el) return;
    el.innerHTML = '';
    const options = {
      series: [
        { name: 'Revenue', data: [9,25,25,20,20,18,25,15,20,12,8,20] },
        { name: 'Expenses', data: [-10,-18,-9,-20,-20,-10,-20,-20,-8,-15,-18,-20] }
      ],
      chart: { type: 'bar', height: 290, stacked: true, zoom: { enabled: true } },
      colors: ['#0E9384', '#E04F16'],
      plotOptions: { bar: { horizontal: false, borderRadius: 4, columnWidth: '20%' } },
      dataLabels: { enabled: false },
      yaxis: {
        min: -30, max: 30, tickAmount: 6,
        labels: { offsetX: -15, formatter: (val: number) => val+'K' }
      },
      xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
      legend: { show: false },
      fill: { opacity: 1 }
    };
    new ApexCharts(el, options).render();
  }

  private renderSalesDayChart(): void {
    const el = document.querySelector('#sales-daychart');
    if (!el) return;
    el.innerHTML = '';
    const options = {
      series: [
        { name: 'Sales', data: [18,25,10,18,25,18,10,20,40,8,30,20] },
        { name: 'Purchase', data: [50,40,30,50,40,50,30,30,50,30,40,30] }
      ],
      chart: { type: 'bar', height: 245, stacked: true, toolbar: { show: false } },
      colors: ['#FE9F43', '#FFE3CB'],
      plotOptions: { bar: { borderRadius: 8, horizontal: false, endingShape: 'rounded' } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
      yaxis: { labels: { formatter: (val: number)=> val+'K', offsetX: -15 } },
      legend: { show: false },
      grid: { borderColor: '#E5E7EB', strokeDashArray: 5 }
    };
    new ApexCharts(el, options).render();
  }

  private renderHeatChart(): void {
    const el = document.querySelector('#heat_chart');
    if (!el) return;
    el.innerHTML = '';
    const generateSeries = () => {
      const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      return days.map(d => ({ x: d, y: Math.floor(Math.random()*300)+50 }));
    };
    const options = {
      series: [{ name: 'Orders', data: generateSeries() }],
      chart: { type: 'heatmap', height: 220, toolbar: { show: false } },
      dataLabels: { enabled: false },
      colors: ['#0E9384'],
      xaxis: { type: 'category' }
    };
    new ApexCharts(el, options).render();
  }
}
