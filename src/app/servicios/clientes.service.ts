import { Injectable } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Cliente } from '../modelo/cliente.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class ClienteServicio{
  modificar(value: Cliente) {
    throw new Error("Method not implemented.");
  }
    clientesColeccion: AngularFirestoreCollection<Cliente>;
    clienteDoc: AngularFirestoreDocument<Cliente>;
    clientes: Observable<Cliente[]>;
    cliente: Observable<Cliente>;

    constructor (private db: AngularFirestore){
        this.clientesColeccion = db.collection('clientes', ref => ref.orderBy('nombre' , 'asc'));


    }
    getClientes(): Observable<Cliente[]>{

        this.clientes = this.clientesColeccion.snapshotChanges().pipe(
            map( cambios => {
                return cambios.map(accion => {
                        const datos = accion.payload.doc.data() as Cliente;
                        datos.id = accion.payload.doc.id;
                        return datos;
                })


            } )
        );

        return this.clientes;
    
        }
        agregarCliente(cliente: Cliente){
            this.clientesColeccion.add(cliente);
        }
        getCliente(id: string){
            this.clienteDoc = this.db.doc<Cliente>(`clientes/${id}`);
            this.cliente = this.clienteDoc.snapshotChanges().pipe(
                map( accion => {
                    if(accion.payload.exists ===false) {
                        return null;
                    }
                    else {
                        const datos = accion.payload.data() as Cliente;
                        datos.id = accion.payload.id;
                        return datos;
                    }
                } )
            );
                    return this.cliente;
        }
        modificarCliente(cliente: Cliente){
            this.clienteDoc = this.db.doc (`clientes/${cliente.id}`);
            this.clienteDoc.update(cliente);
        }
        eliminarCliente(cliente: Cliente){
            this.clienteDoc = this.db.doc(`clientes/${cliente.id}`)
            this.clienteDoc.delete();
        }
    }
