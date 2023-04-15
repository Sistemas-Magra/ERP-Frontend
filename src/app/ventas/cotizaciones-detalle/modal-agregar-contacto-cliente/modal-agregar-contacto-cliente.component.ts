import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClienteContacto } from 'src/app/maestros/models/cliente-contacto';

@Component({
  selector: 'app-modal-agregar-contacto-cliente',
  templateUrl: './modal-agregar-contacto-cliente.component.html',
  styleUrls: ['./modal-agregar-contacto-cliente.component.css']
})
export class ModalAgregarContactoClienteComponent implements OnInit {

  contacto: ClienteContacto = new ClienteContacto();

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.ref.close();
  }

  guardar() {

    if(!this.contacto.nombres || this.contacto.nombres.length == 0){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar los nombres del nuevo contacto.'});
      return;
    }

    if(!this.contacto.apellidoPaterno || this.contacto.apellidoPaterno.length == 0){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el apellido paterno del nuevo contacto.'});
      return;
    }

    if(!this.contacto.apellidoMaterno || this.contacto.apellidoMaterno.length == 0){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el apellido materno del nuevo contacto.'});
      return;
    }

    if(!this.contacto.celular || this.contacto.celular.length == 0){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el número de celular del nuevo contacto.'});
      return;
    }

    if(!this.contacto.correo || this.contacto.correo.length == 0){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el correo del nuevo contacto.'});
      return;
    }

    this.contacto.nombreCompleto = `${this.contacto.nombres} ${this.contacto.apellidoPaterno} ${this.contacto.apellidoMaterno}`

    this.ref.close(JSON.parse(JSON.stringify(this.contacto)));
  }

}
