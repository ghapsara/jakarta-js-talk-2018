import { fromEvent, merge, timer } from 'rxjs';
import { scan, startWith, map, takeUntil, switchMap } from 'rxjs/operators';

const counterElement = document.getElementById('counter-element');
const incrementEvent$ = fromEvent(
  document.getElementById('increment-button'),
  'mousedown'
);
const decrementEvent$ = fromEvent(
  document.getElementById('decrement-button'),
  'mousedown'
);
const mouseUp$ = fromEvent(document, 'mouseup');

const increment$ = incrementEvent$.pipe(
  switchMap(() => {
    return timer(0, 100).pipe(
      map(() => 1),
      takeUntil(mouseUp$)
    );
  }),
);

const decrement$ = decrementEvent$.pipe(
  switchMap(() => {
    return timer(0, 100).pipe(
      map(() => -1),
      takeUntil(mouseUp$)
    );
  }),
);

const observable$ = merge(
  increment$,
  decrement$,
);

const counter$ = observable$.pipe(
  startWith(0),
  scan((curr, next) => curr + next)
);

counter$.subscribe(state => {
  counterElement.innerText = state;
});
