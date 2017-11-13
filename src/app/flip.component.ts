import { Component, Input, trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'flip-front, flip-back',
  template: `<ng-content></ng-content>`
})
export class FlipSection { }

@Component({
  selector: 'flip',
  template: `
    <div class="container">
      <div class="flipper" [@flip]="flipped?'flipped':'unflipped'">
        <div class="sides front">
          <ng-content select="flip-front"></ng-content>
        </div>
        <div class="sides back">
          <ng-content select="flip-back"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      perspective: 1000px;
	    transform-style: preserve-3d;
    }
    .flipper {
      position: relative;
      transform-style: preserve-3d;
      min-width: 200px;
      min-height: 100px;
    }
    .sides {
      position: absolute;
      backface-visibility: hidden;
      width: 100%;
      height: 100%;
      user-select: none;
    }
    .back {
      transform: rotateY(180deg);
    }
  `],
  animations: [
    trigger('flip', [
      state('flipped', style({ transform: 'rotateY(180deg)' })),
      state('unflipped', style({ transform: 'rotateY(0)' })),
      transition('* => *', animate('400ms ease-in-out'))
    ])  
  ]
})
export class FlipComponent {
  @Input() flipped = false;
  flip = 'unflipped';
}
