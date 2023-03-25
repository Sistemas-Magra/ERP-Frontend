import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-si-no',
  templateUrl: './modal-si-no.component.html',
  styleUrls: ['./modal-si-no.component.css']
})
export class ModalSiNoComponent implements OnInit {

  titulo: string;
  texto: string;

  botonAceptacion: string;
  botonDeclinacion: string;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.titulo = this.config.data.titulo;
    this.texto = this.config.data.texto;
    this.botonAceptacion = this.config.data.botonAceptacion;
    this.botonDeclinacion = this.config.data.botonDeclinacion;
  }

  cerrar(ind: number) {
    this.ref.close({res: ind})
  }

}
