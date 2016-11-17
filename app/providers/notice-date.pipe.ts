import {Pipe, PipeTransform} from "@angular/core";
import {DateFormatter} from "@angular/common/src/facade/intl";

@Pipe({name: 'noticeDate'})
export class NoticeDatePipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        if (value) {
            var date = value instanceof Date ? value : new Date(value);
            //return DateFormatter.format(date, 'pt', 'dd/MM hh:mm');
        }
        return value;
    }
}
