import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared-service/shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  searchType: String;
  searchNameText:String = '';
  searchAssociateIDText:String = '';
  searchSkillOption:String = '';
  allSkills: Subscription;
  allSkillData: any;
  searchResult: Subscription;
  searchInitialized: boolean;
  obtainedSearchResult: any;

  constructor(
    private http:HttpClient,
    private sharedService:SharedService
    ){}

  ngOnInit(): void {
    this.obtainAllSkills();
  }
  

  searchButtonAction(){
    console.log("Obtained Search Text is "+this.searchNameText);
    this.obtainedSearchResult = null;
    this.populateSearchType();
    this.searchServiceCall();
  }

  populateSearchType(){
    if(this.searchNameText.length > 0){
      this.searchType = "NAME";

    }else if(this.searchAssociateIDText.length > 0){
      this.searchType = "AssociateId";

    }else if(this.searchSkillOption.length > 0){
      this.searchType = "SkillTopic"
    }else{
      this.searchType = '';
    }
    
  }

  searchServiceCall(){
    console.log('Search Type is '+this.searchType);
    if(this.searchType == "NAME"){
      this.searchResult = this.sharedService.searchWithName(this.searchNameText).subscribe((success: any) => {
        this.obtainedSearchResult = success;
        console.log('Search Result Obtained');
        console.log(this.obtainedSearchResult);
        this.searchInitialized = true;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.log('Search Error');
        console.log(httpErrorResponse.error);
      },
      () => {}
      );

    }else if(this.searchType == "AssociateId"){
      this.searchResult = this.sharedService.searchWithAssociateId(this.searchAssociateIDText).subscribe((success: any) => {
        this.obtainedSearchResult = success;
        console.log('Search Result Obtained');
        console.log(this.obtainedSearchResult);
        this.searchInitialized = true;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.log('Search Error');
        console.log(httpErrorResponse.error);
      },
      () => {}
      );

    }else if(this.searchType == "SkillTopic"){
      this.searchResult = this.sharedService.searchSkillTopic(this.searchSkillOption).subscribe((success: any) => {
        this.obtainedSearchResult = success;
        console.log('Search Result Obtained');
        console.log(this.obtainedSearchResult);
        this.searchInitialized = true;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.log('Search Error');
        console.log(httpErrorResponse.error);
      },
      () => {}
      );
    }else{
      console.log('Invalid Search Type');
    }

  }

  obtainAllSkills(){
    this.allSkills = this.sharedService.getAllSkills().subscribe((success: any) => {
      this.allSkillData = success;
      console.log(this.allSkillData);

    },
    (httpErrorResponse: HttpErrorResponse) => {
      console.log('Error Getting All Skills');
      console.log(httpErrorResponse.error);
    },
    () => {}
    ); 
  }

}
