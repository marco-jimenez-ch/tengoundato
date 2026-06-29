import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trustUrl'
})
export class TrustUrlPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
