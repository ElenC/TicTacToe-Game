import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { GameDTO } from './../models/gamedto.models';
import { AngularFirestore} from 'angularfire2/firestore';

import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Game } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public EMPTY_BOARD = ["", "", "", "", "", "", "", "", ""]; 
  public piece: string = "";
  public inGame: boolean = false;
  public gameId$: Observable<string>;
  public gameId: string = "";
  public board$: Observable<string[]>;
  public board: string[]
  public winner: boolean;
  public turn$: Observable<string>;
  public winner$: Observable<string>;

  constructor(private db: AngularFireDatabase, private auth: AuthService) {
    let usrId = this.auth.getUserId()
    this.gameId$ = new Observable(o => {
      this.db.database.ref(`users/${this.auth.getUserId()}/game`).on('value', s => {
        if (s.exists()) {
          o.next(s.val());
          this.gameId = s.val();
        } else {
          o.next("none");
          this.gameId = "none";
        }
      }, e => {
        o.next("none");
        this.gameId = "none";
      });
    });

    this.board$ = new Observable(o => {
      this.gameId$.subscribe(id => {
        this.db.database.ref(`games/${id}/board`).on('value', s => {
          if (s.exists()) {
            o.next(s.val());
            this.board = s.val();
          } else {
            o.next(this.EMPTY_BOARD);
            this.board = this.EMPTY_BOARD;
          }
        }, e => {
          o.next(this.EMPTY_BOARD);
          this.board = this.EMPTY_BOARD;
        });
      });
    });

    // get piece
    this.gameId$.subscribe(id => {
      this.db.database.ref(`games/${id}/${usrId}`).on('value', s => {
        this.piece = s.val();
      }, e => {
        this.piece = "";
      });
    });

    // console.log(this.turn$)
    //Get Turn
 this.turn$ = new Observable(o => {
    this.gameId$.subscribe(id => {
      this.db.database.ref(`games/${id}/board/turn`).on('value', s => {
        if (s.exists()) {
          o.next(s.val().toString());
        } else {
          o.next("none");
        }
      }, e => {
        o.next("none");
      });
    });
  });

// Get Winner
this.winner$ = new Observable(o => {
  this.gameId$.subscribe(id => {
    this.db.database.ref(`games/${id}/winner/`).on('value', s => {
      console.log(`games/${id}/winner/`)
      o.next(s.val())
      let winn= false
      for (var i = 0; i < 3; i++) {
        // Check for winning on row
        if ((this.board[i][0] == this.board[i][1]) && (this.board[i][1] == this.board[i][2]) && this.board[i][0] != '') {
          winn = true;
        }
        // Check for winning on column
        else if ((this.board[0][i] == this.board[1][i]) && (this.board[1][i] == this.board[2][i]) && this.board[0][i] != '') {
          winn = true;
        }
      }
  
      // Check for winning on diagonal
      if ((this.board[0][0] == this.board[1][1]) && (this.board[1][1] == this.board[2][2]) && this.board[0][0] != '') {
        winn = true;
  
      }
      else if ((this.board[0][2] == this.board[1][1]) && (this.board[1][1] == this.board[2][0]) && this.board[0][2] != '') {
        winn = true;
      }
  
      return winn;
    
    })
      this.db.object(`games/${id}/winner/`).update({
        
    });
  });
}); 
}

deleteGame(): void {
  this.db.object(`games/${this.gameId}`).remove();
}

newGame(): void{
let usrId = this.auth.getUserId()
        
this.db.database.ref(`users/${usrId}/game/board`).once('value').then(w =>{
  if(!w.exists()){
  let id = require('shortid').generate();
  this.db.object(`games/${id}/board`).update({
    0: "", 1: "", 2: "",
    3: "", 4: "", 5: "",
    6: "", 7: "", 8: ""
  })
  this.db.object(`users/${usrId}`).update({
    game:id
  })
 this.db.object(`games/${id}/${usrId}`).set('O');
this.db.object(`games/${id}/user1`).set(usrId);
}  
})
}

startGame(id: string){
  const usrI = this.auth.getUserId();
    
  this.db.database.ref(`games/${id}`).once('value').then(y =>{
  if(!y.exists()){
  alert(`Desculpe, Não encontramos ${id}. Tente um novo ID.`)
  }else{
    this.db.object(`users/${usrI}`).update({
    game: id
    });
    
  this.db.object(`games/${id}/${usrI}`).set('X');
  this.db.object(`games/${id}/user2`).set(usrI);
  }
     
  })
}

    play(pos: number): void {
      let newBoard = this.board;
      newBoard[pos] = this.piece;
      this.db.object(`games/${this.gameId}/board`).set(newBoard);
    }
  
    getGame(){
      return this.gameId$;
    }
  
    getBoard(){
      return this.board$;
    }
  
    getTurn(){
      return this.turn$;
    }

}
