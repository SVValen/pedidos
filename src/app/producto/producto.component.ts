import { Component, OnInit } from '@angular/core';
import { Producto } from '../share/producto';
import { ProductoService } from '../share/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  productos : Producto[] = [];

  constructor(
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    this.productoService.get().subscribe(
      (productos) => {
        this.productos = productos;
      }
    )
  }


  
  

}
