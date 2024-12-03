import { AuthApi } from "./auth";
import { MachineApi } from "./machine";
import { ScheduleApi } from "./schedule";
import { LocationApi } from "./location";
import { ApiBase } from "./base";

export class Api extends ApiBase {
  // API classes
  private authApi: AuthApi;
  private machineApi: MachineApi;
  private scheduleApi: ScheduleApi;
  private locationApi: LocationApi;

  // Method declarations
  public signUp;
  public validateCredentials;
  public updateClerkMetadata;
  public getMachines;
  public getSchedules;
  public getScheduleById;
  public getLocations;

  constructor(accessToken?: unknown | undefined) {
    // Running the ApiBase constructor
    super(accessToken);

    // API classes
    this.authApi = new AuthApi(accessToken);
    this.machineApi = new MachineApi(accessToken);
    this.scheduleApi = new ScheduleApi(accessToken);
    this.locationApi = new LocationApi(accessToken);

    // Assign methods inside constructor
    this.signUp = this.authApi.signUp;
    this.validateCredentials = this.authApi.validateCredentials;
    this.updateClerkMetadata = this.authApi.updateClerkMetadata;
    this.getMachines = this.machineApi.getMachines;
    this.getSchedules = this.scheduleApi.getSchedules;
    this.getScheduleById = this.scheduleApi.getScheduleById;
    this.getLocations = this.locationApi.getLocations;
  }
}
