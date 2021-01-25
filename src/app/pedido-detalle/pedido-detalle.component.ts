import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../confirmar/confirmar.component';

import { PedidoDetalle } from '../share/pedido-detalle';
import { PedidoDetalleService } from '../share/pedido-detalle.service';

import { Producto } from '../share/producto'
import { ProductoService } from '../share/producto.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css']
})
export class PedidoDetalleComponent implements OnInit {

  @Input() pediId!: number;

  items : PedidoDetalle[] = [];
  seleccionado = new PedidoDetalle();

  columnas: string[] =  ['detaProdId', 'prodDescripcion', 'detaCantidad','detaPrecio', 'acciones'];
  dataSource = new MatTableDataSource<PedidoDetalle>();

  form = new FormGroup({});

  mostrarFormulario = false;

  productos: Producto[] = [];

  constructor(
    private pedidoDetalleService: PedidoDetalleService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      detaId: [''],
      detaPediId: [''],
      detaProdId: ['', Validators.required],
      detaCantidad: [''],
      detaPrecio: [''],
      detaBorrado: [''],
      detaFechaAlta: [''],
      prodDescripcion: ['']
    })

    this.getPedidoDetalle();
    this.getProducto();
  }

  getPedidoDetalle(): void {
    this.pedidoDetalleService.get(this.pediId).subscribe(
      (pedDetalle) => {
        this.items = pedDetalle;
        this.actualizarTabla();
      }
    )
  }

  getProducto() {
    this.productoService.get().subscribe(
      (producto) => {
        this.productos = producto;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new PedidoDetalle();
    this.mostrarFormulario = true;
  }

  delete(row: PedidoDetalle) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.pedidoDetalleService.delete(row.detaId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.items = this.items.filter((item) => {
              if (item.detaId != row.detaId) {
                return true
              } else {
                return false
              }
            });

            this.actualizarTabla();
          });
      }
    });
  }

  edit(seleccionado: PedidoDetalle) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    //si hay q agregar uno x uno
    //this.seleccionado.prodDescripcion = this.form.value.prodDescripcion;

    if (this.seleccionado.detaId) {
      this.pedidoDetalleService.put(this.seleccionado)
        .subscribe((pedidoDetalle) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.pedidoDetalleService.post(this.seleccionado)
        .subscribe((pedidoDetalle: PedidoDetalle) => {
          pedidoDetalle.prodDescripcion = this.productos.find(c => c.prodId == pedidoDetalle.detaProdId)!.prodDescripcion;
          this.items.push(pedidoDetalle);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        })
    }

  }

  cancelar() {
    this.mostrarFormulario = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}
