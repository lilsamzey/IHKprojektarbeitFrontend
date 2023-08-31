import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';





import{AuthService} from '../../core/service/auth.service'
import {TeacherService} from '../teacher.service'

import {TeachercourseinfoComponent} from '../teachercourseinfo/teachercourseinfo.component'




















import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexGrid,
  ApexFill,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';

export type avgLecChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

export type pieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  labels: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public avgLecChartOptions!: Partial<avgLecChartOptions>;
  public pieChartOptions!: Partial<pieChartOptions>;












  userName!:string;
  userId!:number;
  studentId!: any;
  courses: any[] =[];
  course={};





  FileCountOfCourse!:number;










  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Teacher'],
      active: 'Dashboard',
    },
  ];

  constructor(private authService:AuthService,
    private teacherService:TeacherService,
    public dialog: MatDialog,



    ) {
    //constructor
  }













  ngOnInit() {

    this.userId=this.authService.currentUserValue.id
    this.userName=this.authService.currentUserValue.firstName
    this.getUsersCourses();


    console.log(this.userId)



    this.chart1();
    this.chart2();
  }









  getUsersCourses(): void {
    this.teacherService.getUserCourses(this.userId).subscribe(
      (courses: any) => {
        this.courses = courses;
        console.log('Courses of ',this.userName, courses);
        // Diğer işlemleri burada gerçekleştirin
      },
      (error) => {
        console.error('Hata:', error);
      }
    );}



    details(course: any) {

      console.log('detaydan gelen' + course.CourseId)

      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      const dialogRef = this.dialog.open(TeachercourseinfoComponent, {
        data: {
          course: course,
          action: 'edit',
        },
        direction: tempDirection,
      });
      // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      //   if (result === 1) {
      //     // When using an edit things are little different, firstly we find record inside DataService by id
      //     const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
      //       (x: { id: number | undefined; }) => x.id === this.id
      //     );
      //     // Then you update that record using data from dialogData (values you enetered)
      //     if (foundIndex != null && this.exampleDatabase) {
      //       this.exampleDatabase.dataChange.value[foundIndex] =
      //         this.teachersService.getDialogData();
      //       // And lastly refresh table
      //       this.refreshTable();
      //       this.showNotification(
      //         'black',
      //         'Edit Record Successfully...!!!',
      //         'bottom',
      //         'center'
      //       );
      //     }
      //   }

      // })


    }









    refreshTable() {
      throw new Error('Method not implemented.');
    }
    showNotification(arg0: string, arg1: string, arg2: string, arg3: string) {
      throw new Error('Method not implemented.');
    }
















  private chart1() {
    this.avgLecChartOptions = {
      series: [
        {
          name: 'Avg. Lecture',
          data: [65, 72, 62, 73, 66, 74, 63, 67],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        foreColor: '#9aa0ac',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'July', 'Aug'],
        title: {
          text: 'Weekday',
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      yaxis: {},
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#35fdd8'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private chart2() {
    this.pieChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Science', 'Mathes', 'Economics', 'History', 'Music'],
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
    };
  }











  // getFileCountOfCourse(courseId: number): Promise<number> {
  //   return new Promise<number>((resolve, reject) => {
  //     this.teacherService.getFileCountOfCourse(courseId).subscribe(
  //       (data: any[]) => {
  //         resolve(data[0].FileCount);
  //       },
  //       (error) => {
  //         console.error('Error fetching file count:', error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }















}


