import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared-service/shared.service';
import { LoginModel } from './model/loginModel';
import { AuthenticationRequest } from './model/authenticationRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginSuccess: boolean;
  loginForm:FormGroup;
  loginModel: LoginModel;
  authRequest: AuthenticationRequest;
  loginData: Subscription;
  allSkills: Subscription;
  loginError: boolean;
  loginErrorMessage: any;

  constructor(private formBuilder:FormBuilder, private http:HttpClient, 
          private router:Router, private sharedService:SharedService){

      this.loginModel = new LoginModel();
      this.authRequest = new AuthenticationRequest();
    }


  ngOnInit(): void {
    this.initializeForm();
  }


  initializeForm(){
    this.loginForm=this.formBuilder.group({
      //associateID:['',[Validators.required,Validators.pattern("^CTS[0-9]{5,30}$")]],
      //associatePassword:['',[Validators.required,Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}")]],
      associateID:[''],
      associatePassword:[''],
    });
  }

  goToRegister(){
    this.router.navigateByUrl('/register');
  }
 

  loginButtonAction(){
    console.log("Login Component -  loginButtonAction");
    this.populateRestApiCallInParams();
    this.authenticateUserAndRetrieveTokenServiceCall();
  }

 /**
   * Method to populate input obtained from the
   * Login form into the Request Model
   */
 populateRestApiCallInParams(){
  this.loginModel = this.loginForm.value;
  // base64 password encryption
  this.loginModel.associatePassword = btoa(this.loginModel.associatePassword);

  //populate into the AuthenticationRequest object so that it can be sent to the Authentication Server
  this.authRequest.username = this.loginModel.associateID;
  this.authRequest.password = this.loginModel.associatePassword;
  this.authRequest.token = "";
  console.log("Login Component -  populateRestApiCallInParams");
  console.log("Encrypted Password is " + this.loginModel.associatePassword);
}


/**
 * Method to call Shared Service function that authenticates the user from the database
 * and recieves JWT Token from the Authentication Server
 */
authenticateUserAndRetrieveTokenServiceCall(){
  console.log("Login Component -  validateUserServiceCall");
  console.log("Login Component -  authRequest Details");

  console.log(this.authRequest.username);
  console.log(this.authRequest.password);
  console.log("Making AUTHTICATIOn BACKEND CALL");
  this.loginErrorMessage = "";
  this.loginData = this.sharedService.authenticateUserCredentials(this.authRequest).subscribe((jwtToken: any) => {
  this.authRequest.token = jwtToken;
  console.log("JWT OKEN = " + jwtToken); 
  
  //To transfer data between different Angular components (Login ==> User) we are using Behaviour Subject
  this.sharedService.populateLoggedInAssociateToken(this.authRequest);
  this.router.navigateByUrl('/user'); 

    // this.getUserDetailsRestCallWithToken(jwtToken);
  },
  (httpErrorResponse: HttpErrorResponse) => {
    this.loginError = true;
    console.log('Login Error');
    console.log(httpErrorResponse.error);
    if(null == httpErrorResponse.error){
      this.loginErrorMessage = 'Invalid Username';
    }else{
      this.loginErrorMessage = httpErrorResponse.error;
    }
    
    this.loginSuccess = false;
  },
  () => {}
  );
}




}
