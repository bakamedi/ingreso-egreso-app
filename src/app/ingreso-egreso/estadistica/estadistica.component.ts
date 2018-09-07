import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {

  ingresos: number;
  egresos: number;

  contIngresos: number;
  contEgresos: number;

  subscription: Subscription = new  Subscription();
  public doughnutChartLabels:string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData:number[] = [];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
      .subscribe( ingresoEgreso => {
        this.contarIngresoEgreso(ingresoEgreso.items)
      });
  }

  contarIngresoEgreso(items: IngresoEgreso[]){
    this.ingresos = 0;
    this.egresos = 0;
    this.contIngresos = 0;
    this.contEgresos = 0;
    items.forEach(item => {
      if (item.tipo === 'ingreso') {
        this.contIngresos ++;
        this.ingresos += item.monto;
      } else {
        this.contEgresos ++;
        this.egresos += item.monto;
      }
    });
    this.graficaDona();
  }

  graficaDona () {
    this.doughnutChartData = [this.ingresos, this.egresos];
  }

}
