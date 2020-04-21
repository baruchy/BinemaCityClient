import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'title'
})
export class TitlePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value) return value;
        value = value.replace(/[^\w\s]/gi, '');//remove all special charechters
        return value.replace(/\w\S*/g, function (txt) {// uppercase first letter
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

}
