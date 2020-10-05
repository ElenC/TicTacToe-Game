import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { GameService } from '../service/game.service';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public gameId$: Observable<string>;
  public gameId: string;
  public gameInfo: string= "";
  public turn$: Observable<string>;
  public winner$: Observable<string>;

  constructor(private games: GameService, private auth: AuthService, private change: ChangeDetectorRef, private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.gameId$ = this.games.getGame();
    this.gameId$.subscribe(o => {
      this.gameId = o;
      this.change.detectChanges();
     
    })

  this.turn$ = this.games.getTurn();
  this.turn$.subscribe(o => {
    if (this.gameId) {
      this.gameInfo = (o === this.auth.getUserId() ? 'X' : "O");
    } else {
      this.gameInfo = "You are not in a game";
    }
    this.change.detectChanges();
  });
  
  this.games.winner$.subscribe(o => {
    if (o === 'cat') {
      this.gameInfo = "Cat's Scratch!";
    } else {
      this.gameInfo = (o === this.auth.getUserId() ? "You Won!" : "You Lost!");
    }
    this.change.detectChanges();
  });console.log(this.gameInfo)

  
  }
  newGame() {
    this.games.newGame();
  }
  endGame(): void {
    this.games.deleteGame();
  }
  startGame(id: string) {
    this.games.startGame(id);
  }
  gameWon(){}
}


