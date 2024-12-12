import { ApiBase } from "./base";
import { AuthApi } from "./auth";
import { LocationApi } from "./location";
import { MachineApi } from "./machine";
import { NotifyerApi } from "./notifyer";
import { ScheduleApi } from "./schedule";
import { StatsApi } from "./stats";
import { UserApi } from "./user";

export class Api extends ApiBase {
  // API classes
  private authApi: AuthApi;
  private locationApi: LocationApi;
  private machineApi: MachineApi;
  private notifyerApi: NotifyerApi;
  private scheduleApi: ScheduleApi;
  private statsApi: StatsApi;
  private userApi: UserApi;

  // Method declarations
  public adminLogin;
  public getLocation;
  public updatePricing;
  public getMachines;
  public getMachine;
  public createMachine;
  public updateMachine;
  public deleteMachine;
  public sendNotification;
  public getNotifyableUsers;
  public cancelSchedule;
  public getSchedules;
  public getStats;
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
    this.notifyerApi = new NotifyerApi(accessToken);
    this.scheduleApi = new ScheduleApi(accessToken);
    this.statsApi = new StatsApi(accessToken);
    this.userApi = new UserApi(accessToken);

    // Assign methods inside constructor
    this.adminLogin = this.authApi.adminLogin;
    this.getLocation = this.locationApi.getLocation;
    this.updatePricing = this.locationApi.updatePricing;
    this.getMachines = this.machineApi.getMachines;
    this.getMachine = this.machineApi.getMachine;
    this.createMachine = this.machineApi.createMachine;
    this.updateMachine = this.machineApi.updateMachine;
    this.deleteMachine = this.machineApi.deleteMachine;
    this.sendNotification = this.notifyerApi.sendNotification;
    this.getNotifyableUsers = this.notifyerApi.getNotifyableUsers;
    this.cancelSchedule = this.scheduleApi.cancelSchedule;
    this.getSchedules = this.scheduleApi.getSchedules;
    this.getStats = this.statsApi.getStats;
    this.getUser = this.userApi.getUser;
    this.getUsers = this.userApi.getUsers;
    this.getUserById = this.userApi.getUserById;
  }
}
