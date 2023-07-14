import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared-service/shared.service';
import { UpdateProfileRequestModel } from './model/updateProfileRequestModel'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  updateProfileForm:FormGroup;
  updateProfileRequestModel: UpdateProfileRequestModel;
  allSkills: Subscription;

  //Behaviour Subject (Login ==> User) - populated by Service from Login Component
  jwtTokenSubscription: Subscription;
  authRequest: any;

  profileDataSubscription: Subscription;
  profileData: any;
  ratingsData: Subscription;
  obtainedRatingsData: any;
  updateData: Subscription;
  updateSuccess: boolean;
  updateError: boolean;
  updateErrorMessage=''

  techskillsToAdd : {id: string, skillId: string, topic: string, rating:string}[] = [];
  nontechskillsToAdd : {id: string, skillId: string, topic: string, rating:string}[] = [];

  constructor(
    private formBuilder:FormBuilder,
    private http:HttpClient,
    private router: Router,
    private sharedService:SharedService){
      this.updateProfileRequestModel = new UpdateProfileRequestModel();
  }
  ngOnInit():void{
    this.initializeForm();
    this.obtainAssociateToken();
  }

  initializeForm(){
    this.updateProfileForm=this.formBuilder.group({
      associateid:[''],
      name:[''],
      mobile:[''],
      email:[''],
      techskills: this.formBuilder.array([]),
      nontechskills: this.formBuilder.array([]),
    })
  }

   /**
   * Method to obtain JWT Token data from shared service (Behaviour Subject Login==> User)
   * Then in the COMPLETE Callback block invoke the getUserCall
   */
  obtainAssociateToken(){
    this.authRequest = null;
    this.jwtTokenSubscription = this.sharedService.loggedInToken$.subscribe((data: any) => {
      this.authRequest = data;
      console.log("################## obtained Token from Login Component");
      console.log(this.authRequest.token);
      this.getUserDetailsRestCallWithToken(this.authRequest);
      //this.bindFormData();
    },
    (error: any) => {
      console.log('Errors are there '+error);
    },
    () => {
      
    }
    );

  }


  public getUserDetailsRestCallWithToken(authRequest : any) {
       //this.sharedService.getUserDetailsWithToken(authRequest);

    this.profileDataSubscription = this.sharedService.getUserDetailsWithToken(authRequest).subscribe((response: any) => {
      this.profileData = response;
      console.log(this.profileData);
      if(this.profileData.role === 'ADMIN'){
        this.router.navigateByUrl('/admin');
      }else{
        this.bindFormData();       
      }
    },
    (httpErrorResponse: HttpErrorResponse) => {
      // this.loginError = true;
      console.log('Login Error');
      console.log(httpErrorResponse.error);
      //this.loginErrorMessage = httpErrorResponse.error;
      //this.loginSuccess = false;
    },
    () => {}
    ); 
  }


   /**
   * Method to populate form data using the Profile data obtained
   */
  bindFormData(){

    console.log("################# Obtained Profile Data");
    console.log(this.profileData);
    this.updateProfileForm.get('name')?.setValue(this.profileData.name);
    this.updateProfileForm.get('associateid')?.setValue(this.profileData.associateid);
    this.updateProfileForm.get('mobile')?.setValue(this.profileData.mobile);
    this.updateProfileForm.get('email')?.setValue(this.profileData.email);

    this.profileData.techskills.forEach((itemObtained: any) => {
      this.techskillsToAdd.push(itemObtained);
    });

    this.profileData.nontechskills.forEach((itemObtained: any) => {
      this.nontechskillsToAdd.push(itemObtained);
    });

    this.populateLatestSkillInformation();

     
  }

  populateLatestSkillInformation(){
    this.techskills.clear();
    this.nontechskills.clear();

    this.techskillsToAdd.forEach((item: any)=>{
      this.techskills.push(this.formBuilder.group({id: item.id, skillId: item.skillId, topic: item.topic, rating: item.rating}));
    });
    this.nontechskillsToAdd.forEach((item: any)=>{
      this.nontechskills.push(this.formBuilder.group({id: item.id, skillId: item.skillId, topic: item.topic, rating: item.rating}));
    });

    console.log("################## techskills");
    console.log(this.techskills);

  }

  get techskills(): FormArray{
    return this.updateProfileForm.get('techskills') as FormArray;
  }

  get nontechskills(): FormArray{
    return this.updateProfileForm.get('nontechskills') as FormArray;
  }


  updateButtonAction(){
    console.log(this.updateProfileForm.value);
    this.populateRestApiCallInParams();
    this.sharedServiceCall();
  }

  /**
   * Method to populate input obtained from the
   * Registration form into the Request Model 
   */
  populateRestApiCallInParams(){
    this.updateProfileRequestModel = this.updateProfileForm.value;
   // this.updateProfileRequestModel.lastupdated = this.profileData.lastupdated;

    this.updateProfileRequestModel.techskills = [];
    this.updateProfileRequestModel.nontechskills = [];

    for (const i in this.techskills.value){
      this.updateProfileRequestModel.techskills.push(this.techskills.value[i]);
    }
    for (const i in this.nontechskills.value){
      this.updateProfileRequestModel.nontechskills.push(this.nontechskills.value[i]);
    }

    console.log(this.updateProfileRequestModel);
  }

  /**
   * Method to call Shared Service function that
   * inserts a new user into the database
   */
  sharedServiceCall(){
    this.updateData = this.sharedService.updateAssociateSkills(this.updateProfileRequestModel).subscribe((success: any) => {
      console.log('Update Executed');
      this.updateSuccess = true;
      this.updateError = false;
      this.updateErrorMessage = '';
    },
    (httpErrorResponse: HttpErrorResponse) => {
      this.updateSuccess = false;
      console.log('Update Error');
      console.log(httpErrorResponse.error);
      this.updateError = true;
      this.updateErrorMessage = 'Problems with Update';
    },
    () => {}
    );
  }

  ngOnDestroy(){

    this.jwtTokenSubscription ? this.jwtTokenSubscription.unsubscribe(): null;
    this.allSkills ? this.allSkills.unsubscribe(): null;
    this.ratingsData ? this.ratingsData.unsubscribe(): null;
    this.updateData ? this.updateData.unsubscribe(): null;
  }

}
