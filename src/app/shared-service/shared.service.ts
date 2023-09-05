import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  
  base_url_cloud_search_container_apps:string = "https://con-app-skiltracker-search.gentlefield-d9a4639f.southeastasia.azurecontainerapps.io/skill-tracker/api/v1/admin/getAllAssociates";
  base_url_cloud_search_app_service:string = "https://fse4-azure-search.azurewebsites.net/skill-tracker/api/v1/admin/";
  base_url_cloud_maintain_app_service:string = "https://fse4-azure-maintain.azurewebsites.net/skill-tracker/api/v1/engineer/";

  base_url_local_search:string = "http://localhost:8090/skill-tracker/api/v1/admin/";
  base_url_local_maintain:string = "http://localhost:8091/skill-tracker/api/v1/engineer/";
  
  final_base_url_search:string = this.base_url_local_search;
  final_base_url_maintain:string = this.base_url_local_maintain;
  final_service_url:string = "";


   //To transfer data between different Angular components (Login ==> User) we are using Behaviour Subject
  loggedInToken$: Observable<any>;
  private loggedInAssociateToken = new BehaviorSubject<any>(1);

  options  = {
    headers: new HttpHeaders({
      'Accept': 'text/html, application/xhtml+xml, */*',
      'Content-Type': 'application/json; charset=utf-8'
    }),
    responseType: 'text' as 'text'
  };

  
  constructor(private http: HttpClient) {
    this.loggedInToken$ = this.loggedInAssociateToken.asObservable();
   }


  //  Behaviour Subject (Login ==> User). This is a method invoked by the Angular Framework
  //  when the Behaviour subject variable is populated inside in the sender LOGIN component
   populateLoggedInAssociateToken(authRequestData: any){
    this.loggedInAssociateToken.next(authRequestData);
   }



/**
 * REST Service call to Microservice Backend MAINTAIN to Insert a new User in the ASSOCIATE and
 * MAPPING TABLES
 */
  registerUserDetails(registerRequestModel: any): Observable<any>{
    // console.log('Shared service printing input')
    // console.log(registerRequestModel);
    // return registerRequestModel;
    this.final_service_url = "";
    this.final_service_url = this.final_base_url_maintain + "add-profile";
    console.log('########## - REST SERVICE CALL add-profile = ' + this.final_service_url);
    return this.http.post(this.final_service_url, registerRequestModel, this.options);
  }
  
/**
 * REST Service call to Microservice Backend MAINTAIN to retrieve all skills for the Dropdown
 * This is extracted from the SKILLS TABLE
 */
  getAllSkills(): Observable<any>{
    this.final_service_url = "";
    this.final_service_url = this.final_base_url_maintain + "getAllSkills";
    console.log('########## - REST SERVICE CALL getAllSkills = ' + this.final_service_url);
    return this.http.get(this.final_service_url);
  }


/**
 * REST Service call to Microservice Backend MAINTAIN/AUTHENTICATE to authenticates the user 
 * from the ASSOCIATE TABLE of the database
 */
  authenticateUserCredentials(authRequest: any): Observable<any>{
    console.log("Login Service -  validateUserCredentials");
    console.log('Invoking the Auth-Server URL, INPARAMS are shown below');
    console.log(authRequest);
    this.final_service_url = "";
    this.final_service_url = this.final_base_url_maintain + "authenticate";
    console.log('########## - REST SERVICE CALL authenticateUserCredentials = ' + this.final_service_url);
    return this.http.post(this.final_service_url ,authRequest, this.options);
  }


/**
 * REST Service call to Microservice Backend MAINTAIN to extract the user details
 * from the ASSOCIATE TABLE of the database
 */
  getUserDetailsWithToken(authRequest : any){

    let tokenStr = 'Bearer ' + authRequest.token;

    // const headers = new HttpHeaders().set('Authorization', tokenStr);
    const params = new HttpParams()
    .set('associateID', authRequest.username)
    .set('associatePassword', authRequest.password) 
    console.log('Shared service - getUserDetailsWithToken');  

    this.final_service_url = "";
    this.final_service_url = this.final_base_url_maintain + "getUserDetails";
    console.log('########## - REST SERVICE CALL getUserDetails = ' + this.final_service_url);
    return this.http.get(this.final_service_url, {params});
  }


/**
 * REST Service call to Microservice Backend MAINTAIN to extract the users skills ratings details
 * from the MAPPING TABLE of the database
 */
  getAssociateSkillRatings(associateID: any){

    console.log('Shared service printing input')
    console.log(associateID );
    const params = new HttpParams()
    .set('associateID',associateID)

    this.final_service_url = "";
    this.final_service_url = this.final_base_url_maintain + "getAssociateSkillRatings";
    console.log('########## - REST SERVICE CALL getAssociateSkillRatings = ' + this.final_service_url);
    return this.http.get(this.final_service_url,{params});

  }


/**
 * REST Service call to Microservice Backend MAINTAIN to extract the users skills ratings details
 * from the MAPPING TABLE of the database
 */
  updateAssociateSkills(updateProfileRequestModel: any){
    console.log('########## - Shared service - updateAssociateSkills - Printing input')
    console.log(updateProfileRequestModel );

    this.final_service_url = "";
    this.final_service_url = this.final_base_url_maintain + "update-profile";
    console.log('########## - REST SERVICE CALL = update-profile' + this.final_service_url);
    return this.http.post(this.final_service_url, updateProfileRequestModel, this.options);

  }

  // LIST OF SEARCH MICROSERVICE REST CALLS

  searchWithName(obtainedName: any){
    const params = new HttpParams()
    .set('name',obtainedName)

    this.final_service_url = "";
    this.final_service_url = this.base_url_local_search + "getAssociatesByName";
    console.log('########## - REST SERVICE CALL getAssociatesByName = ' + this.final_service_url);
    return this.http.get(this.final_service_url, {params});
  }

  searchWithAssociateId(obtainedAssociateId: any){
    const params = new HttpParams()
    .set('associateID',obtainedAssociateId)

    this.final_service_url = "";
    this.final_service_url = this.final_base_url_search + "getAssociateByID";
    console.log('########## - REST SERVICE CALL getAssociateByID = ' + this.final_service_url);
    return this.http.get(this.final_service_url,{params});
  }

  searchSkillTopic(obtainedTopic: any){
    const params = new HttpParams()
    .set('topic',obtainedTopic)

    this.final_service_url = "";
    this.final_service_url = this.final_base_url_search + "getAssociatesBySkill";
    console.log('########## - REST SERVICE CALL getAssociateByID = ' + this.final_service_url);
    return this.http.get(this.final_service_url,{params});
  }


  // http://localhost:8070/skill-tracker/api/v1/admin/getAssociatesBySkill?topic=angular
  // http://localhost:8070/skill-tracker/api/v1/admin/getAssociatesByName?name=Gangotri%20Basu
  // http://localhost:8070/skill-tracker/api/v1/admin/getAssociatesByName?name=TS
  // http://localhost:8070/skill-tracker/api/v1/admin/getAllAssociates
  // http://localhost:8090/skill-tracker/api/v1/admin/getAssociateByID?associateID=174567
  // http://localhost:8090/skill-tracker/api/v1/admin/getAssociateByID?associateID=63bd7b306cbf4c84b4009882

  

}
