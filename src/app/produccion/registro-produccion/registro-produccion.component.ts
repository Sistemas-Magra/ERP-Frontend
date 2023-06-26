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
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

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

  id: number;

  blnCargando: boolean = false;

  stickerCalidadInicio: string;

  constructor(
    private authService: AuthService,
    private encargadoPlantaService: EncargadoPlantaService,
    private ordenTrabajoService: OrdenTrabajoService,
    private produccionService: ProduccionService,
    private plantaService: PlantaService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private pipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.id = +sessionStorage.getItem("idCalidad");
    sessionStorage.removeItem("idCalidad");

    this.plantaService.getPlantasActivas().subscribe({
      next: res => {
        this.plantas = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
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

  asignarStickers() {
    let count: number = 0;
    this.listadoProduccion.forEach((p, i) => {
      if(p.indConformidad) {
        p.stickerCalidad = (Number(this.stickerCalidadInicio) + count).toString();
        count = count + 1;
      }
    })
  }

  validarEncargado() {

    if(!this.id) {
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

    } else {

      this.produccionService.getProduccionPlantaByPlantaIdProduccionId(this.plantaSeleccionada.id, this.id).subscribe({
        next: res => {

          this.ref = this.dialogService.open(ModalSiNoComponent, {
            data: {
              titulo: 'Confirmación de Inicio de Calidad',
              texto: `¿Desea asignarse iniciar el proceso de calidad en la ${this.plantaSeleccionada.nombre}?`,
              botonAceptacion: 'Sí',
              botonDeclinacion: 'No'
            },
            width: '400px',
            height: '170px',
          })
    
          this.ref.onClose.subscribe(resp => {
            if(resp.res == 1) {

              this.blnCalidad = true;
              this.produccionPlanta = res.obj;
              this.listadoProduccion = this.produccionPlanta.detallePostes;

            } else {
              this.encargado = null;
              this.blnHayResponsable = false;
              this.plantaSeleccionada = null;
            }
          })
        }, error: err => {
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje})
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
          }
          this.encargado = null;
          this.blnHayResponsable = false;
          this.plantaSeleccionada = null;
        }
      })
    }
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
    if(this.blnFilaAniadidaSinGuardar) {
      return;
    }

    this.validarFila = i;
  }

  addProductoProducido() {
    if(this.blnFilaAniadidaSinGuardar) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe terminar de guardar la fila actual para añadir otra fila.'})
      return;
    }

    let newRow: ProduccionPlantaPoste = new ProduccionPlantaPoste();
    newRow.nroProduccion = this.listadoProduccion.length + 1;

    let nroProd: string = (newRow.nroProduccion < 10?`0${newRow.nroProduccion}`:`${newRow.nroProduccion}`)

    newRow.stickerProduccion = `${this.plantaSeleccionada.numero}${this.pipe.transform(new Date(), 'yyyyMMdd')}${nroProd}`;
    this.blnFilaAniadidaSinGuardar = true;
    this.validarFila = this.listadoProduccion.length;
    this.listadoProduccion.push(newRow);
  }

  findProducto(event, i: number) {
    let term: string = event.query;
    this.listadoProduccion[i].listadoAutocompleteAux = this.listadoProduccion[i].ordenTrabajo.detalle.filter(otd => otd.ordenVentaDetalle.producto.nombre.toUpperCase().includes(term.toUpperCase()))
  }

  guardar(i: number) {

    this.blnCargando = true;
    
    if(!this.listadoProduccion[i].ordenTrabajo) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: `Debe asignar una orden de trabajo.`})
      this.blnCargando = false;
      return;
    }

    if(!this.listadoProduccion[i].ordenTrabajoDetalle) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: `Debe asignar un producto.`})
      this.blnCargando = false;
      return;
    }

    if(!this.listadoProduccion[i].stickerProduccion) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: `Debe asignar un sticker de producción.`})
      this.blnCargando = false;
      return;
    }

    if(this.listadoProduccion[i].cantidad > this.listadoProduccion[i].ordenTrabajoDetalle.cantidadPendiente) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: `La cantidad que está ingresando es más de la que está en el pedido.`})
    }

    this.produccionPlanta.detallePostes = this.listadoProduccion;

    this.produccionService.update(this.produccionPlanta, this.listadoProduccion[i].stickerProduccion).subscribe({
      next: res => {
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Poste registrado correctamente.'})
        this.produccionPlanta = res.object;
        this.listadoProduccion = this.produccionPlanta.detallePostes;
        this.blnFilaAniadidaSinGuardar = false;
        this.blnCargando = false;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
          this.blnCargando = false;
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
          this.blnCargando = false;
        }
      }
    })
  }

  calidad() {
    let blnSticker: boolean = false;
    this.listadoProduccion.forEach(p => {
      if(!p.idUsuarioCalidad) {
        p.idUsuarioCalidad = this.authService.usuario.id;
      }

      if(p.indConformidad && !p.stickerCalidad) {
        blnSticker = true;
      }

      if(p.indConformidad == null) {
        p.indConformidad = false;
      }
    });

    if(blnSticker) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Hay postes aprobados sin stickers de calidad.'});
      return;
    }

    this.produccionPlanta.detallePostes = this.listadoProduccion;

    this.produccionService.updateCalidad(this.produccionPlanta).subscribe({
      next: res => {
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Datos de calidad guardados correctamente.'});
        this.router.navigate(['/produccion/registro-produccion-postes/listado']);
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    });
  }

}