import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnquiryListService } from '../service/enquiry-list.service';
import { User } from '../model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit{

 public userDetails:any
  getid:any

  constructor(private route:ActivatedRoute , private api:EnquiryListService){}

    ngOnInit(): void {
        this.route.params.subscribe((params:any) => {
          this.getid = params['id']
          this.api.getRegisteredUserId(this.getid).subscribe((res:any) => { console.log(res)
            this.userDetails = res
          })
        })
        console.log(this.userDetails)
    }

}
