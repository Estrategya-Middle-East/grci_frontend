import { Pipe, PipeTransform } from '@angular/core';
import { OrganizationType } from '../enums/types.enum';

@Pipe({
  name: 'organizationType',
  standalone: true
})
export class OrganizationTypePipe implements PipeTransform {

  transform(value: number): string {
    return OrganizationType[value] ?? 'Unknown';
  }

}
