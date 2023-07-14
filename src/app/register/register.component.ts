import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared-service/shared.service';
import { RegisterRequestModel } from './model/registerRequestModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  successFlag: boolean;
  registrationForm:FormGroup;
  registerRequestModel: RegisterRequestModel;
  insertData: Subscription;
  allSkills: Subscription;
  registrationInitialized: boolean;
  registrationSuccessID = 'User saved successfully with ID = ';
  secondMsg = "Please proceed by cicking the below Next Button";
  
  techskillsToAdd : {skillId: string, topic: string, rating:string}[] = [];
  nontechskillsToAdd : {skillId: string, topic: string, rating:string}[] = [];

  constructor(
    private formBuilder:FormBuilder,
    private http:HttpClient,
    private router:Router,
    private sharedService:SharedService
    ){
    this.registerRequestModel = new RegisterRequestModel();
  }


  ngOnInit():void{

    this.obtainAllSkills();
    this.initializeForm();
    //TODO add router nav after successful registreation

  }

  goToLogin(){
    this.router.navigateByUrl('/login');
  }

  /**
   * Method to Initialize the Registration Form and
   * add form validations to the input fields
   */
  initializeForm(){
    this.registrationForm=this.formBuilder.group({
      associateid:['',[Validators.required,Validators.pattern("^CTS[0-9]{5,30}$")]],
      name:['',[Validators.required,Validators.pattern("(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})")]],
      mobile:['',[Validators.required,Validators.min(1000000000),Validators.max(9999999999)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}")]],
      // associateid:[''],
      // name:[''],
      // mobile:[''],
      // email:[''],
      // password:[''],
      techskills: this.formBuilder.array([]),
      nontechskills: this.formBuilder.array([]),
    });
  }

  /**
   * Method to obtain list of all skills from the shared service
   * and divide them in two categories i.e. Techinal and Non Technical
   */
  obtainAllSkills(){
    this.allSkills = this.sharedService.getAllSkills().subscribe((success: any) => {
      const allSkillData = success;
      // console.log(allSkillData);
      allSkillData.forEach((item: any) => {
        if(item.skillid.indexOf('T')===0){
          // console.log(item.skillname);
          this.techskillsToAdd.push({skillId: item.skillid, topic: item.skillname, rating: "0"});        
        }        
        else if(item.skillid.indexOf('N')===0){
          // console.log(item.skillname);
          this.nontechskillsToAdd.push({skillId: item.skillid, topic: item.skillname, rating: "0"});
        }
      });
      this.populateLatestSkillInformation();

    },
    (error: any) => {
      console.log('Errors are there '+error);
    },
    () => {}
    ); 
  }

  populateLatestSkillInformation(){
    this.techskills.clear();
    this.nontechskills.clear();

    this.techskillsToAdd.forEach((item: any)=>{
      this.techskills.push(this.formBuilder.group({skillId: item.skillId, topic: item.topic, rating: item.rating}));
    });
    this.nontechskillsToAdd.forEach((item: any)=>{
      this.nontechskills.push(this.formBuilder.group({skillId: item.skillId, topic: item.topic, rating: item.rating}));
    });
  }

  registerButtonAction(){
    this.populateRestApiCallInParams();
    this.sharedServiceCall();
  }

  get techskills(): FormArray{
    return this.registrationForm.get('techskills') as FormArray;
  }

  get nontechskills(): FormArray{
    return this.registrationForm.get('nontechskills') as FormArray;
  }


  /**
   * Method to populate input obtained from the
   * Registration form into the Request Model 
   */
  populateRestApiCallInParams(){
    this.registerRequestModel = this.registrationForm.value;

    // base64 password encryption
    this.registerRequestModel.password = btoa(this.registerRequestModel.password);
    // console.log("Encrypted Password is " +this.registerRequestModel.password);

    this.registerRequestModel.techskills = [];
    this.registerRequestModel.nontechskills = [];

    for (const i in this.techskills.value){
      this.registerRequestModel.techskills.push(this.techskills.value[i]);
    }
    for (const i in this.nontechskills.value){
      this.registerRequestModel.nontechskills.push(this.nontechskills.value[i]);
    }

    console.log(this.registerRequestModel);
  }

  /**
   * Method to call Shared Service function that
   * inserts a new user into the database
   */
  sharedServiceCall(){
    this.insertData = this.sharedService.registerUserDetails(this.registerRequestModel).subscribe((response: any) => {
      console.log('Success Message');
      console.log(response);
      this.successFlag = true;
      this.registrationSuccessID = this.registrationSuccessID + response;
            
    },
    (httpErrorResponse: HttpErrorResponse) => {
      // this.loginError = true;
      console.log('Register Error');
      console.log(httpErrorResponse.error);
      // this.loginErrorMessage = httpErrorResponse.error;
      // this.loginSuccess = false;
    },
    () => {}
    );
  }

  initiateRegistration(){
  this.registrationInitialized = true;
  // console.log(this.techskillsToAdd);
  // console.log(this.nontechskillsToAdd);
  }

  ngOnDestroy(){

    this.insertData ? this.insertData.unsubscribe(): null;
    this.allSkills ? this.allSkills.unsubscribe(): null;
  }


  nextButtonAction(){
    this.router.navigateByUrl('/login');
  }
}
