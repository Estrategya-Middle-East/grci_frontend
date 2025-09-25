import { Pipe, PipeTransform } from '@angular/core';
import { LocationType } from '../enums/types.enum';

@Pipe({
  name: 'locationType',
  standalone: true
})
export class LocationtypePipe implements PipeTransform {
  transform(value: number): string {
    return LocationType[value] ?? 'Unknown';
  }

}
