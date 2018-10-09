//   import { of as of$ } from 'rxjs';
//   import { map, filter } from 'rxjs/operators';

//   const observable$ = of$(1, 2, 3, 4, 5, 6);

//   const operation$ = observable$.pipe(
//     filter(d => d % 2 === 0),
//     map(d => `${d},genap ya`),
//   );

//   operation$.subscribe(
//     next => console.log(next),
//     error => console.log('error', error),
//     () => console.log('completed'),
//   );

// // //lodash code
// // import { chain } from 'lodash';

// // const data = [1, 2, 3, 4, 5, 6];

// // const result = chain(data)
// //   .filter(d => d % 2 === 0)
// //   .map(d => `${d}, genap ya`);

// // console.log(result.value());

// // /* output = [
// //   '2, genap ya',
// //   '4, genap ya',
// //   '6, genap ya'
// // ];
// // */
