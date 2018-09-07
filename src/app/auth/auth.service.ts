import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.action';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      console.log(fbUser);
    });
  }

  crearUsuario ( nombre: string, email: string, password: string ) {
    this.store.dispatch( new ActivarLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword( email, password )
    .then( response => {
      console.log(response);
      const user: User = {
        uid: response.user.uid,
        nombre: nombre,
        email: response.user.email
      };
      this.afDB.doc(`${ user.uid }/usuario`).set( user ).then( () => {
        this.router.navigate(['/']);
        this.store.dispatch(new DesactivarLoadingAction());
      });
    }).catch( error => {
      console.log(error);
      this.store.dispatch(new DesactivarLoadingAction());
      Swal('Error al crear Usuario', error.message, 'error');
    });
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password )
    .then( response => {
      console.log(response);
      this.router.navigate(['/']);
    })
    .catch( error => {
      console.log(error);
      Swal('Error en el login', error.message, 'error');
    });
  }

  logOut() {
    this.afAuth.auth.signOut()
      .then( () => {
        this.router.navigate(['/login']);
      }).catch( error => {
        Swal('Error al cerrar sesion', error.message, 'error');
      });
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map(fbUser => {
        if (fbUser == null) {
          this.router.navigate(['/login']);
        }
        return fbUser != null;
      })
    );
  }

}
