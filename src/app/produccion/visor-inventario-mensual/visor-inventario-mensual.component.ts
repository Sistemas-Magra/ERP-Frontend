import { Component, OnInit } from '@angular/core';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { ProduccionService } from '../produccion.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-visor-inventario-mensual',
  templateUrl: './visor-inventario-mensual.component.html',
  styleUrls: ['./visor-inventario-mensual.component.css']
})
export class VisorInventarioMensualComponent implements OnInit {

  mesSeleccionado: any;

  listMeses: any[] = [
    {id:1, nro: '01', nombre: 'Enero', cantDias: 31},
    {id:2, nro: '02', nombre: 'Febrero', cantDias: 28},
    {id:3, nro: '03', nombre: 'Marzo', cantDias: 31},
    {id:4, nro: '04', nombre: 'Abril', cantDias: 30},
    {id:5, nro: '05', nombre: 'Mayo', cantDias: 31},
    {id:6, nro: '06', nombre: 'Junio', cantDias: 30},
    {id:7, nro: '07', nombre: 'Julio', cantDias: 31},
    {id:8, nro: '08', nombre: 'Agosto', cantDias: 31},
    {id:9, nro: '09', nombre: 'Setiembre', cantDias: 30},
    {id:10, nro: '10', nombre: 'Octubre', cantDias: 31},
    {id:11, nro: '11', nombre: 'Noviembre', cantDias: 30},
    {id:12, nro: '12', nombre: 'Diciembre', cantDias: 31},
  ];

  listDiasSemana: any[] = [
    {id: 1, nombre: 'Lunes'},
    {id: 2, nombre: 'Martes'},
    {id: 3, nombre: 'Miércoles'},
    {id: 4, nombre: 'Jueves'},
    {id: 5, nombre: 'Viernes'},
    {id: 6, nombre: 'Sábado'},
    {id: 7, nombre: 'Domingo'},
  ]
  
  listDias: any[] = [{id: 0, nombre: 'Stock', codigo: 'stockAnterior'}];
  listDiasPlanta: any[] = [];
  listDiasPlantaItems: any[] = [];

  plantas: Planta[] = [];

  listado: any[];

  constructor(
    private plantaService: PlantaService,
    private produccionService: ProduccionService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    
    this.plantaService.getPlantasActivas().subscribe({
      next: res => {
        this.plantas = res;
    
        this.mesSeleccionado = this.listMeses.find(m => m.id == (new Date()).getMonth() + 1);

        this.setMes()
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  setMes() {

    let anio: number = (new Date()).getFullYear();

    if(anio%400==0 || (anio%4 == 0 && anio%100 != 0)){
      this.listMeses[1].cantDias = 29;
    }
    
    for(let i: number = 0; i < this.mesSeleccionado.cantDias; i++) {
      let diaStr: string = (i < 9?`0${i+1}`:`${i+1}`)
      let dateString: string = `${this.listDiasSemana.find(d => d.id == (new Date(`${anio}-${this.mesSeleccionado.nro}-${diaStr}`)).getDay() + 1).nombre}, ${diaStr} de ${this.mesSeleccionado.nombre} de ${anio}`;

      this.listDias.push({
        id: i+1, 
        nombre: dateString,
        codigo: `${anio}${this.mesSeleccionado.nro}${diaStr}`
      });
    }

    this.listDias.forEach((d, i) => {
      this.plantas.forEach(p => {
        this.listDiasPlanta.push({
          dia: d.id, 
          plantaId: p.id, 
          codigo: `${d.codigo}${p.abreviatura}`,
          nombre: i==0?p.abreviatura:p.nombre
        });
      })
    })

    this.listDiasPlanta.forEach((p, i) => {
      if(i <= 3) {
        this.listDiasPlantaItems.push({tipo:1, nombre: 'S.I.', codigo: `${p.codigo}`});
      } else {
        this.listDiasPlantaItems.push({tipo:1, nombre: 'Ing.', codigo: `${p.codigo}ING`});
        this.listDiasPlantaItems.push({tipo:2, nombre: 'Egr.', codigo: `${p.codigo}EGR`});
        this.listDiasPlantaItems.push({tipo:3, nombre: 'Rech.', codigo: `${p.codigo}RECH`});
      }
    })

    this.produccionService.getListadoInventarioMensual(this.mesSeleccionado.id).subscribe({
      next: res => {

        let listadoAnterior: any[] = res.anterior;
        let listadoFijo: any[] = res.fijo;
        let listadoDiario: any[] = res.diario;

        listadoDiario.forEach(ovd => {

          let saldoFinal: number = 0;
          
          this.plantas.forEach(p => {
            let stockAnterior: any = listadoAnterior.find(ra => ra.planta_id == p.id && ra.orden_trabajo_detalle_id == ovd.orden_trabajo_detalle_id);

            let totalPlanta: number = stockAnterior?stockAnterior.stock:0;

            let totalIngresos: number = 0;
            let totalSalidas: number = 0;

            for(let key in ovd) {
              if(key.includes(p.abreviatura)) {
                totalPlanta = totalPlanta + ovd[key];
              }

              if(key.includes('ING')) {
                totalIngresos += Number(ovd[key])
              }

              if(key.includes('EGR')) {
                totalSalidas += Number(ovd[key])
              }
            }

            ovd[`stock${p.abreviatura}`] = totalPlanta;
            
            ovd[`ingresos`]   = totalIngresos;
            ovd[`salidas`]    = totalSalidas;

            ovd[`stockAnterior${p.abreviatura}`] = stockAnterior?stockAnterior.stock:0;

            saldoFinal = saldoFinal + (stockAnterior?stockAnterior.stock:0);

            ovd.saldoFinal = saldoFinal + totalIngresos - totalSalidas;

          })
        })

        let parteDinamicaAux: any = listadoDiario[0];

        listadoFijo.forEach(pf => {
          let parteDinamica: any = listadoDiario.find(rd => rd.orden_trabajo_detalle_id == pf.orden_trabajo_detalle_id);

          if(parteDinamica) {
            for(let k in parteDinamica) {
              pf[k] = parteDinamica[k];
            }
          } else {
            for(let k in parteDinamicaAux) {
              pf[k] = 0;
            }
          }
        });

        this.listado = listadoFijo;

        console.log(this.listado)
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

  }

}
