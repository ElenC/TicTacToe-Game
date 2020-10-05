import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from '../service/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-dash',
  templateUrl: './game-dash.component.html',
  styleUrls: ['./game-dash.component.scss', './game-dash.component.css']
})
export class GameDashComponent implements OnInit  {

  private board$: Observable<string[]>;
  public board: string[] = ["", "", "", "", "", "", "", "", ""];

  constructor(private games: GameService, private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.board$ = this.games.getBoard();
    this.board$.subscribe(d => {
      this.board = d;
      this.change.detectChanges();
    });
  }

  play(pos: number) {
    this.games.play(pos);
  }
}
