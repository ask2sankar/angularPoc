import { Component,ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexGrid,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";
import { TmHospitalMasterService } from 'src/app/modules/services/tm-hospital-master.service';
import { AuthService } from 'src/app/shared/service/auth.service';



export interface FuncationStatusChartOptions {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any;
  stroke: ApexStroke | any;
  legend: ApexLegend | any;
  grid: ApexGrid | any;
}
export interface ActiveChartOptions {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  stroke: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
}

export interface ApprovedChartOptions {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  stroke: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
}

export interface CriticalityChartOptions {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  stroke: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
}
export interface WarrantyChartOptions {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  stroke: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
}



@Component({
  selector: 'app-tm-hospital-dashboard',
  templateUrl: './tm-hospital-dashboard.component.html',
  styleUrls: ['./tm-hospital-dashboard.component.css']
})
export class TmHospitalDashboardComponent {
  @ViewChild("visitorchart") chart: ChartComponent = Object.create(null);
  public ActiveChartOptions: Partial<ActiveChartOptions>;
  @ViewChild("chart") chart2: ChartComponent = Object.create(null);
  public FuncationStatusChartOptions: Partial<FuncationStatusChartOptions>;

  @ViewChild("approvedchart") approvedChart: ChartComponent = Object.create(null);
  public ApprovedChartOptions: Partial<ApprovedChartOptions>;

  @ViewChild("criticalitychart") criticalitychart: ChartComponent = Object.create(null);
  public CriticalityChartOptions: Partial<CriticalityChartOptions>;
  @ViewChild("warrantychart") warrantychart: ChartComponent = Object.create(null);
  public WarrantyChartOptions: Partial<WarrantyChartOptions>;
  
  public equimentcount:any="";
  private equipmentarray:any=[];
  private reportdata:{ name: string,data: number[] }[]= [
   
  ]
  categoriesdata:any=[];

  constructor( private authservice:AuthService,private hostpitalService:TmHospitalMasterService) {

   
    this.ActiveInActiveChart();
    this.FuntionalEquipmentschart();
    this.ApprovedChart(0,0);
    this.criticalityChart(0,0,0);
    this.warrantyChart(0,0,0);
    
    //this.visitoroptionsdata()

    


  }
  ngOnInit() {
    this.hostpitalService.gethospitalDetailsByUserid(this.authservice.getToken()).subscribe((res1:any)=>{
      localStorage.setItem('hospitalId',res1.id);
    this.hostpitalService.getClientDashboardDetail(res1.id).subscribe((res:any)=>{
      console.log(res);

//Category
      res.monthlyFuntionalEquipments.forEach( (element:any) => {
        this.categoriesdata.push(this.getMonthName(element.month));
       console.log(this.categoriesdata);
    });    
  
    //report data
    // res.monthlyFuntionalEquipments.forEach( (element:any) => {
    //   var arr:number[]=[];   
    //   element.totalFuntionalEquipments.forEach( (element1:any) => {
    //   this.reportdata.push({name:"funtionalEquipments",data:arr})
    //   });
    // });
    
    for(let j=0; j<res.monthlyFuntionalEquipments.length; j++){
      var arr:number[]=[];  
      for(let i=0; i<3 ;i++)
      {
        arr=[]; 
        if(i==0 && j==0)
        {
          for(let k=0; k<res.monthlyFuntionalEquipments.length;k++)
          {
            arr.push(res.monthlyFuntionalEquipments[k].totalFuntionalEquipments.funtionalEquipmentsCount)
         
          }
         this.reportdata.push({name:"Funtional Equipments",data:arr})
        }
        if(i==1 && j==0)
        {
          for(let k=0; k<res.monthlyFuntionalEquipments.length;k++)
          {
            arr.push(res.monthlyFuntionalEquipments[k].totalFuntionalEquipments.nonFuntionalEquipmentsCount)
          }
          
         this.reportdata.push({name:"Non Funtional Equipments",data:arr})
        }
        if(i==2 && j==0)
        {
          for(let k=0; k<res.monthlyFuntionalEquipments.length;k++)
          {
            arr.push(res.monthlyFuntionalEquipments[k].totalFuntionalEquipments.condemnedEquipmentsCount)
          }         
         this.reportdata.push({name:"Condemned Equipments",data:arr})
        }
  
      }
    
  }
  console.log( this.reportdata);
  this.ApprovedChart(res.totalPendingAndInApprovalEquipments.approvedEquipmentsCount,res.totalPendingAndInApprovalEquipments.pendingEquipmentsCount);
  this.criticalityChart(res.totalCriticalityEquipments.criticalEquipmentsCount
    ,res.totalCriticalityEquipments.nonCriticalEquipmentsCount,
    res.totalCriticalityEquipments.semiCriticalEquipmentsCount);

    this.warrantyChart(res.totalWarrantyEquipments.warrantyApprovedEquipmentsCount
      ,res.totalWarrantyEquipments.lamcEquipmentsCount,
      res.totalWarrantyEquipments.cmcEquipmentsCount);

  this.FuntionalEquipmentschart();
      this.equimentcount=res.totalActiveAndInactiveEquipments.total;
      this.ActiveChartOptions = {
        series: [res.totalActiveAndInactiveEquipments.activeEquipmentsCount, res.totalActiveAndInactiveEquipments.inActiveEquipmentsCount],
        chart: {
          type: "donut",
          fontFamily: "Poppins,sans-serif",
          height: 250,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "50px",
            },
          },
        },
        tooltip: {
          fillSeriesColor: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 0,
        },
        legend: {
          show: true,
        },
        labels: ["Active", "In-Active"],
        colors: ["#1e88e5", "#26c6da",],
        responsive: [
          {
            breakpoint: 767,
            options: {
              chart: {
                width: 200,
              },
            },
          },
        ],
      };

    });
  });
}



FuntionalEquipmentschart()
{
  this.FuncationStatusChartOptions = {
    series:this.reportdata,
    chart: {
      type: "bar",
      fontFamily: "Poppins,sans-serif",
      height: 250,
    },
    grid: {
      borderColor: "rgba(0,0,0,.2)",
      strokeDashArray: 3,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: this.categoriesdata,
    },

    legend: {
      show: false,
    },
    fill: {
      colors: ["#26c6da", "#1e88e5","#50C878"],
      opacity: 1,
    },
    tooltip: {
      theme: "dark",
    },
  };
}
ActiveInActiveChart()
{
  this.ActiveChartOptions = {
    series: [0,0],
    chart: {
      type: "donut",
      fontFamily: "Poppins,sans-serif",
      height: 320,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80px",
        },
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: true,
    },
    labels: ["Active", "In-Active"],
    colors: ["#1e88e5", "#26c6da",],
    responsive: [
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };
}

ApprovedChart(data1:any,data2:any)
{
  this.ApprovedChartOptions = {
    series: [data1,data2],
    chart: {
      type: "donut",
      fontFamily: "Poppins,sans-serif",
      height: 320,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50px",
        },
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: true,
    },
    labels: ["Approved", "Pending"],
    colors: ["#4E9258", "#A0D6B4"],
    responsive: [
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };
}
criticalityChart(data1:any,data2:any,data3:any)
{
  this.CriticalityChartOptions = {
    series: [data1,data2,data3],
    chart: {
      type: "donut",
      fontFamily: "Poppins,sans-serif",
      height: 450,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60px",
        },
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: true,
    },
    labels: ["Critical", "Non Critical","Semi Critical"],
    colors: ["#872657", "#D16587","#CCCCFF"],
    responsive: [
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };
}

warrantyChart(data1:any,data2:any,data3:any)
{
  this.WarrantyChartOptions = {
    series: [data1,data2,data3],
    chart: {
      type: "donut",
      fontFamily: "Poppins,sans-serif",
      height: 450,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60px",
        },
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: true,
    },
    labels: ["warranty", "LAMC","CMC"],
    colors: ["#357EC7", "#BDEDFF","#15317E"],
    responsive: [
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };
}
 getMonthName(monthNumber:any) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'long' });
}




}
