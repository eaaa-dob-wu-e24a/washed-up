import { ApiBase } from "./base";
import { AuthApi } from "./auth";
import { LocationApi } from "./location";
import { MachineApi } from "./machine";
import { UserApi } from "./user";

export class Api extends ApiBase {
  // API classes
  private authApi: AuthApi;
  private locationApi: LocationApi;
  private machineApi: MachineApi;
  private userApi: UserApi;

  // Method declarations
  public adminLogin;
  public getLocation;
  public getMachines;
  public getMachine;
  public createMachine;
  public updateMachine;
  public deleteMachine;
  public getUser;
  public getUsers;
  public getUserById;

  constructor(accessToken?: unknown) {
    // Running the ApiBase constructor
    super(accessToken);

    // API classes
    this.authApi = new AuthApi(accessToken);
    this.locationApi = new LocationApi(accessToken);
    this.machineApi = new MachineApi(accessToken);
    this.userApi = new UserApi(accessToken);

    // Assign methods inside constructor
    this.adminLogin = this.authApi.adminLogin;
    this.getLocation = this.locationApi.getLocation;
    this.getMachines = this.machineApi.getMachines;
    this.getMachine = this.machineApi.getMachine;
    this.createMachine = this.machineApi.createMachine;
    this.updateMachine = this.machineApi.updateMachine;
    this.deleteMachine = this.machineApi.deleteMachine;
    this.getUser = this.userApi.getUser;
    this.getUsers = this.userApi.getUsers;
    this.getUserById = this.userApi.getUserById;
  }
}
