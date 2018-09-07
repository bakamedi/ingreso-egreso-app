import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnSetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class IngresoEgresoService {

	ingresoEgresoListenerSubscription: Subscription = new Subscription();
	ingresoEgresoItemsSubscription: Subscription = new Subscription();

	constructor(private afDB: AngularFirestore,
							private authService: AuthService,
							private store: Store<AppState>) { }

	initIngresoEgresoListener() {
		this.store.select('auth')
			.pipe(
				filter( auth => auth.user != null )
			)
			.subscribe( auth => this.ingresoEgresoItems(auth.user.uid));
	}

	crearIngresoEgreso( ingresoEgreso: IngresoEgreso) {
		const user = this.authService.getUser();
		return this.afDB.doc(`${user.uid}/ingresos-egresos`)
			.collection('items').add({...ingresoEgreso});
	}

	cancelarSubscriptions() {
		this.ingresoEgresoItemsSubscription.unsubscribe();
		this.ingresoEgresoListenerSubscription.unsubscribe();
		this.store.dispatch(new UnSetItemsAction());
	}

	borrarIngresoEgreso(uid: string) {
		const user = this.authService.getUser();
		return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`).delete();
	}

	private ingresoEgresoItems( uid: string){
		this.afDB.collection(`${uid}/ingresos-egresos/items`)
			.snapshotChanges().pipe(
				map( docData => {
					return docData.map(docData => {
						return {
							uid: docData.payload.doc.id,
							...docData.payload.doc.data()
						};
					})
				})
			).subscribe( (collection: any[]) => {
				this.store.dispatch(new SetItemsAction(collection));
			});
	}

}
