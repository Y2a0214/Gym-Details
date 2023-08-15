import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../model';
import { EnquiryListService } from '../service/enquiry-list.service';
import { ActivatedRoute, Router } from '@angular/router';


//USED Angular Material Ui
@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.css']
})
export class RegistrationListComponent implements OnInit{
  public dataSource!: MatTableDataSource<User>;
  public user!:User[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'mobile', 'bmiResult', 'gender', 'package', 'enquiryDate', 'action'];

  constructor(private api:EnquiryListService , private route:Router ){}

  ngOnInit(): void {
      this.getUser()
  }

  getUser(){
    this.api.getRegisteredUser().subscribe(res => {
      this.user = res;
      this.dataSource = new MatTableDataSource(this.user);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id:number){
    this.route.navigate(['update' , id])
  }

  delete(id:number){
    this.api.deleteRegistered(id).subscribe(result => 
      this.getUser()
    )
  }
}

