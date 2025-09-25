import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Select } from 'primeng/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownList, ShowActions, ShowFilteration } from './models/header.interface';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, Select, InputTextModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() dropdownChange = new EventEmitter<{ index: number; value: any }>();
  @Output() switchView = new EventEmitter<boolean>();
  @Input() isSwitchView = true;
  @Input() title = "";
  @Input() showActions!:ShowActions;
  @Input() showFilteration!: ShowFilteration;
  @Input() dropdownList:DropdownList[] = [];
  @Output() search = new EventEmitter();

  emitSearch$:Subject<any> = new Subject();
  searchControl:FormControl<string | any> = new FormControl({key:null, value:null});

   onDropdownChange(data: any, index: number) {
    let selectedItem = this.dropdownList[index];
    this.searchData({key:selectedItem.searchType, value: data.value});
  }
  ngOnInit(): void {
    // this.emitSearch$.pipe(distancedUntilChanged)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe({
        next: (data:any) => {
          this.search.emit({key:data.key,value:data.value});
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
  }
  searchData(data:any) {
    this.searchControl.setValue({key:data.key, value:data.value.value})
  }

}
