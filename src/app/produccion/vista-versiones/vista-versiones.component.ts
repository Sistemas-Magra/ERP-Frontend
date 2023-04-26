import { Component, OnInit } from '@angular/core';
import { ProgramacionSemanal } from '../models/programacion-semanal';
import { ProgramacionSemanalService } from '../programacion-semanal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vista-versiones',
  templateUrl: './vista-versiones.component.html',
  styleUrls: ['./vista-versiones.component.css']
})
export class VistaVersionesComponent implements OnInit {

  progSem: ProgramacionSemanal = new ProgramacionSemanal();
  dias: Date[] = [];

  constructor(
    private programacionService: ProgramacionSemanalService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      this.progSem.id = +param['id']

      if(this.progSem.id > 0) {
        this.programacionService.getDetalleVersionSemanal(this.progSem.id).subscribe({
          next: res => {

            this.dias = res.detallePlantas[0].detalleCliente[0].detalleDiarios.map(d => d.fecha);
            this.progSem = res;
          }
        })

      }
    })

  }

}
