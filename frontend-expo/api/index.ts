import { ApiBase } from "./base";
import { AuthApi } from "./auth";
import { CreditsApi } from "./credits";
import { LocationApi } from "./location";
import { MachineApi } from "./machine";
import { ScheduleApi } from "./schedule";
import { UserApi } from "./user";

export class Api extends ApiBase {
  // API classes
  private authApi: AuthApi;
  private creditsApi: CreditsApi;
  private locationApi: LocationApi;
  private machineApi: MachineApi;
  private scheduleApi: ScheduleApi;
  private userApi: UserApi;

  // Method declarations
  public signUp;
  public validateCredentials;
  public updateClerkMetadata;
  public getCredits;
  public buyCredits;
  public getLocations;
  public getLocation;
  public getLocationByCode;
  public getMachines;
  public getSchedules;
  public getScheduleById;
  public setSchedule;
  public getUser;

  constructor(accessToken?: unknown) {
    // Running the ApiBase constructor
    super(accessToken);

    // API classes
    this.authApi = new AuthApi(accessToken);
    this.creditsApi = new CreditsApi(accessToken);
    this.locationApi = new LocationApi(accessToken);
    this.machineApi = new MachineApi(accessToken);
    this.scheduleApi = new ScheduleApi(accessToken);
    this.userApi = new UserApi(accessToken);

    // Assign methods inside constructor
    this.signUp = this.authApi.signUp;
    this.validateCredentials = this.authApi.validateCredentials;
    this.updateClerkMetadata = this.authApi.updateClerkMetadata;
    this.getCredits = this.creditsApi.getCredits;
    this.buyCredits = this.creditsApi.buyCredits;
    this.getLocations = this.locationApi.getLocations;
    this.getLocation = this.locationApi.getLocation;
    this.getLocationByCode = this.locationApi.getLocationByCode;
    this.getMachines = this.machineApi.getMachines;
    this.getSchedules = this.scheduleApi.getSchedules;
    this.getScheduleById = this.scheduleApi.getScheduleById;
    this.setSchedule = this.scheduleApi.setSchedule;
    this.getUser = this.userApi.getUser;
  }
}
