import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DepartmentService } from '../department.service';
import { Department } from './department';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  pageTitle: string = "Department List";
  departments: Department[] = [];
  errorMessage: string = '';

  constructor(private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(){
    this.departmentService.getDepartments().subscribe({
      next: departments => {
        this.departments = departments;
      },
      error : err => {
        this.errorMessage = err,
        console.log(err)
      }
    });
  }

}
