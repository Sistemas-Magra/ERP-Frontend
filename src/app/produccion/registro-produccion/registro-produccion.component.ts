import { Component, OnInit } from '@angular/core';
import { EncargadoPlantaService } from '../encargado-planta.service';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalSiNoComponent } from 'src/app/commons/modal-si-no/modal-si-no.component';
import { AuthService } from 'src/app/seguridad/auth.service';
import { MessageService } from 'primeng/api';
import { ProduccionPlantaPoste } from '../models/produccion-planta-poste';
import { OrdenTrabajo } from '../models/orden-trabajo';
import { OrdenTrabajoService } from '../orden-trabajo.service';
import { ProduccionPlanta } from '../models/produccion-planta';
import { ProduccionService } from '../produccion.service';

@Component({
  selector: 'app-registro-produccion',
  templateUrl: './registro-produccion.component.html',
  styleUrls: ['./registro-produccion.component.css']
})
export class RegistroProduccionComponent implements OnInit {

  produccionPlanta: ProduccionPlanta = new ProduccionPlanta();
  blnHayResponsable: boolean = false;

  listadoEncargados: any[];
  plantas: Planta[];
  plantaSeleccionada: Planta;

  encargado: string;

  listadoProduccion: ProduccionPlantaPoste[] = [];

  ref: DynamicDialogRef;

  listadoOrdenesTrabajo: OrdenTrabajo[] = [];

  blnCalidad: boolean = false;
  blnProduccion: boolean = false;

  blnFilaAniadidaSinGuardar: boolean = false;
  validarFila: number = -1;

  constructor(
    private authService: AuthService,
    private encargadoPlantaService: EncargadoPlantaService,
    private ordenTrabajoService: OrdenTrabajoService,
    private produccionService: ProduccionService,
    private plantaService: PlantaService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.plantaService.getPlantasActivas().subscribe({
      next: res => {
        this.plantas = res;
      }
    })

    this.encargadoPlantaService.getEncargadosPlantasHoy().subscribe({
      next: res => {
        this.listadoEncargados = res;
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
    
  }

  validarEncargado() {
    this.encargadoPlantaService.getEncargadosPlantasporPlanta(this.plantaSeleccionada.id).subscribe({
      next: res => {

        if(res.length > 0) {

          if(res[0].id == this.authService.usuario.id) {
            this.encargado = this.authService.usuario.nombreCompleto;
            this.blnHayResponsable = true;

            this.produccionPlanta.planta = this.plantaSeleccionada;

            this.produccionService.create(this.produccionPlanta).subscribe({
              next: resp => {
                this.blnProduccion = true;
                this.produccionPlanta = resp.object;
                this.listadoProduccion = this.produccionPlanta.detallePostes;
              },
              error: err => {
                if(err.status == 409) {
                  this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
                } else {
                  this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
                }
              }
            })
          } else {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:'La planta seleccionada ya tiene un encargado asignado.'})
            this.encargado = null;
            this.blnHayResponsable = false;
          }

        } else {
          this.ref = this.dialogService.open(ModalSiNoComponent, {
            data: {
              titulo: 'Confirmación de Asignación de Planta',
              texto: `¿Desea asignarse como el encargado de la ${this.plantaSeleccionada.nombre} del día de hoy?`,
              botonAceptacion: 'Sí',
              botonDeclinacion: 'No'
            },
            width: '400px',
            height: '170px',
          })
  
          this.ref.onClose.subscribe(resp => {
            if(resp.res == 1) {
              this.encargadoPlantaService.create(this.authService.usuario.id, this.plantaSeleccionada.id).subscribe({
                next: respns => {
                  this.messageService.add({severity:'success', summary:'Éxito', detail:'Asignación realizada correctamente.'});
                  this.blnHayResponsable = true;
                  this.encargado = this.authService.usuario.nombreCompleto;

                  this.produccionPlanta.planta = this.plantaSeleccionada;

                  this.produccionService.create(this.produccionPlanta).subscribe({
                    next: resp3 => {
                      this.blnProduccion = true;
                      this.messageService.add({severity: 'success', summary: 'Éxito', detail: resp3.mensaje});
                      this.produccionPlanta = resp3.object;
                    },
                    error: err => {
                      if(err.status == 409) {
                        this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
                      } else {
                        this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
                      }
                    }
                  })
                }
              })
            } else {
              this.encargado = null;
              this.blnHayResponsable = false;
              this.plantaSeleccionada = null;
            }
          })
        }
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

  ordenTrabajoAutocomplete(event) {
    this.ordenTrabajoService.autocomplete(event.query).subscribe({
      next: res => {
        this.listadoOrdenesTrabajo = res;
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

  setOrdenTrabajo(event, i: number) {
    this.listadoProduccion[i].listadoAutocompleteAux = event.detalle;
  }
  
  asignarFila(i) {
    this.validarFila = i;
  }

  addProductoProducido() {
    if(this.blnFilaAniadidaSinGuardar) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe terminar de guardar la fila actual para añadir otra fila.'})
      return;
    }

    let newRow: ProduccionPlantaPoste = new ProduccionPlantaPoste();
    newRow.nroProduccion = this.listadoProduccion.length + 1;
    this.blnFilaAniadidaSinGuardar = true;
    this.validarFila = this.listadoProduccion.length;
    this.listadoProduccion.push(newRow);
  }

  findProducto(event, i: number) {
    let term: string = event.query;
    this.listadoProduccion[i].listadoAutocompleteAux = this.listadoProduccion[i].ordenTrabajo.detalle.filter(otd => otd.ordenVentaDetalle.producto.nombre.toUpperCase().includes(term.toUpperCase()))
  }

  guardar(i: number) {
    if(!this.listadoProduccion[i].ordenTrabajo) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: `Debe asignar una orden de trabajo.`})
      return;
    }

    if(!this.listadoProduccion[i].ordenTrabajoDetalle) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: `Debe asignar un producto.`})
      return;
    }

    if(!this.listadoProduccion[i].stickerProduccion) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: `Debe asignar un sticker de producción.`})
      return;
    }

    this.produccionPlanta.detallePostes = this.listadoProduccion;

    this.produccionService.update(this.produccionPlanta).subscribe({
      next: res => {
        console.log(res);
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Poste registrado correctamente.'})
        this.produccionPlanta = res.object;
        this.listadoProduccion = this.produccionPlanta.detallePostes;
        this.blnFilaAniadidaSinGuardar = false;
      }
    })
  }

  calidad() {

  }

}