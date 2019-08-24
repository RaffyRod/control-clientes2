import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ClienteServicio } from "src/app/servicios/clientes.service";
import { Cliente } from "src/app/modelo/cliente.model";
import { FlashMessagesService } from "angular2-flash-messages";
import { NgForm } from '@angular/forms';
import {  AfterViewInit } from '@angular/core';

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.css"]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  cliente: Cliente = {
    nombre: "",
    apellido: "",
    email: "",
    saldo: 0
  };


 @ViewChild("clienteForm") clienteForm: NgForm;
 @ViewChild("botonCerrar") botonCerrar: ElementRef;




  constructor(
    private clientesServicio: ClienteServicio,
    private flashmessages: FlashMessagesService
  ) {}

  ngOnInit() {
    this.clientesServicio.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }
  getSaldoTotal() {
    let saldoTotal: number = 0;
    if (this.clientes) {
      this.clientes.forEach(cliente => {
        saldoTotal += cliente.saldo;
      });
    }
    return saldoTotal;
  }
  agregar({ value, valid }: { value: Cliente; valid: boolean }) {
    if (!valid) {
      this.flashmessages.show("Por favor llena el formulario correctamente", {
        cssClass: "alert-danger",
        timeout: 4000
      });
    } else {
      //agregar nuevo cliente
      this.clientesServicio.agregarCliente(value);
      this.clienteForm.resetForm();
      this.cerrarModal();
    }
  }
  private cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }
}
