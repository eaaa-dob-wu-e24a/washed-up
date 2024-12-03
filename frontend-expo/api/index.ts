import { ApiBase } from "./base";
import { AuthApi } from "./auth";
import { LocationApi } from "./location";
import { MachineApi } from "./machine";
import { ScheduleApi } from "./schedule";

export class Api extends ApiBase {
  // API classes
  private authApi: AuthApi;
  private locationApi: LocationApi;
  private machineApi: MachineApi;
  private scheduleApi: ScheduleApi;

  // Method declarations
  public signUp;
  public validateCredentials;
  public updateClerkMetadata;
  public getLocations;
  public getMachines;
  public getSchedules;
  public getScheduleById;
  public setSchedule;

  constructor(accessToken?: unknown | undefined) {
    // Running the ApiBase constructor
    super(accessToken);

    // API classes
    this.authApi = new AuthApi(accessToken);
    this.locationApi = new LocationApi(accessToken);
    this.machineApi = new MachineApi(accessToken);
    this.scheduleApi = new ScheduleApi(accessToken);

    // Assign methods inside constructor
    this.signUp = this.authApi.signUp;
    this.validateCredentials = this.authApi.validateCredentials;
    this.updateClerkMetadata = this.authApi.updateClerkMetadata;
    this.getLocations = this.locationApi.getLocations;
    this.getMachines = this.machineApi.getMachines;
    this.getSchedules = this.scheduleApi.getSchedules;
    this.getScheduleById = this.scheduleApi.getScheduleById;
    this.setSchedule = this.scheduleApi.setSchedule;
  }
}
