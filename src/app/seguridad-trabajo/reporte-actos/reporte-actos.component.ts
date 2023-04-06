import { Component, OnInit } from '@angular/core';
import { ReporteActoService } from '../reporte-acto.service';

@Component({
  selector: 'app-reporte-actos',
  templateUrl: './reporte-actos.component.html',
  styleUrls: ['./reporte-actos.component.css']
})
export class ReporteActosComponent implements OnInit {

  reportes: any[] = [];

  constructor(
    private reporteService: ReporteActoService
  ) { }

  ngOnInit(): void {
    this.reporteService.getListado(null,null,null).subscribe({
      next: res => {
        this.reportes = res;
      }
    })
  }

}
