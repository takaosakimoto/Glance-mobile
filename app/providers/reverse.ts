import {Pipe, PipeTransform} from "@angular/core";
import {Notice} from "./notice.model";
@Pipe({
  name: 'reverse1'
})
export class ReversePipe implements PipeTransform {
  transform(input:Notice[]) {
     var copy = input.slice();
     return copy.reverse();
   
  }
}