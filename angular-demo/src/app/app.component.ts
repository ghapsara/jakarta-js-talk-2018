import { Component, OnInit } from '@angular/core';
import { fromEvent, interval, merge, timer } from 'rxjs';
import {
  map,
  switchMap,
  takeUntil,
  takeWhile,
  filter,
  tap,
  exhaustMap,
} from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

export const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ngrxui';

  private frameCount = 30;
  windowHeight = window.innerHeight;

  dropMinimumPosition = this.windowHeight * 0.7;
  rulerPosition = `${this.dropMinimumPosition}px`;

  axisLabel = this.positionPercentage(this.dropMinimumPosition);

  x = null;
  y = this.windowHeight * 0.09999;

  minY = this.y;
  maxY = 0;

  elementStyle = {
    height: `${this.minY}px`
  };


  elementPercentage = this.positionPercentage(this.y);

  isExceeded = this.y > this.dropMinimumPosition;

  positionPercentage(position: number) {
    const percentage = Math.ceil((position / this.windowHeight) * 100);
    return `${percentage}%`;
  }

  ngOnInit() {
    this.setupEvents();
  }

  setupEvents() {
    const element = document.getElementById('pull-element');

    const mouseDown$ = fromEvent<MouseEvent>(element, 'mousedown');
    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

    const animationFrame$ = interval(0, animationFrame);

    const pullDown$ = mouseDown$.pipe(
      switchMap(() => {
        return mouseMove$.pipe(
          filter((d: MouseEvent) => d.y > this.minY),
          map((d: MouseEvent) => d.clientY),
          takeUntil(mouseUp$)
        );
      })
    );

    const pullUp$ = mouseUp$.pipe(
      exhaustMap(() => {
        return animationFrame$.pipe(
          filter(() => this.y > this.minY),
          map((t: number) => lerp(this.maxY, this.minY, t / this.frameCount)),
          takeWhile((y: number) => y >= this.minY)
        );
      })
    );

    pullDown$.subscribe((y: number) => {
      const style = {
        height: `${y}px`
      };

      this.y = y;
      this.maxY = y;
      this.elementPercentage = this.positionPercentage(y);
      this.elementStyle = style;

      this.isExceeded = this.y > this.dropMinimumPosition;
    });

    pullUp$.subscribe((y: number) => {
      const style = {
        height: `${y}px`
      };

      this.y = y;
      this.elementPercentage = this.positionPercentage(y);
      this.elementStyle = style;

      this.isExceeded = this.y > this.dropMinimumPosition;
    });
  }

  onClick() {
    console.log('clicked');
  }
}
