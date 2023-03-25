import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ChangedPassword } from '../models/changed-password';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  empresa: string = environment.empresa;

  nuevaPass: string = '';
  nuevaPassConf: string = '';

  blnLng: boolean = false;
  blnNum: boolean = false;
  blnMin: boolean = false;
  blnMax: boolean = false;

  blnFrstPassValid: boolean = false;

  blnCoincidencia: boolean = false;

  blnCargando: boolean = false;

  token: string;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.token = p['token'];
      this.usuarioService.validStayInPage(this.token).subscribe({
        next: res => {
          if(res.ind == 0) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Ya se cambió una contraseña con este enlace.'})
            this.router.navigate(['/'])
          }
        }
      })
    })
  }

  validarPass(event) {

    let stringInput: string = event.target.value;

    let regexNum = /^(?=.*\d)/
    let regexMin = /^(?=.*[a-záéíóúüñ])/
    let regexMax = /^(?=.*[A-ZÁÉÍÓÚÜÑ])/

    if(stringInput.length >= 6) {
      this.blnLng = true;
    } else {
      this.blnLng = false;
    }

    if(regexNum.test(stringInput)) {
      this.blnNum = true;
    } else {
      this.blnNum = false;
    }

    if(regexMin.test(stringInput)) {
      this.blnMin = true;
    } else {
      this.blnMin = false;
    }

    if(regexMax.test(stringInput)) {
      this.blnMax = true;
    } else {
      this.blnMax = false;
    }

    if(stringInput == this.nuevaPassConf) {
      this.blnCoincidencia = true;
    } else {
      this.blnCoincidencia = false;
    }

    this.blnFrstPassValid = (this.blnLng && this.blnMax && this.blnMin && this.blnNum)

  }

  validarPassConf(event) {

    let stringInput: string = event.target.value;

    if(stringInput == this.nuevaPass) {
      this.blnCoincidencia = true;
    } else {
      this.blnCoincidencia = false;
    }

  }

  changePass() {
    this.blnCargando = true;

    this.usuarioService.changePassword(this.token, this.nuevaPass).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail: 'Contraseña actualizada con éxito.'})
        this.router.navigate(['/login'])
      }, error: err => {
        this.blnCargando = false;
        this.messageService.add({severity:'error', summary:'Error', detail: 'Error al actualizar contraseña.'})
      }
    })
  }

}
