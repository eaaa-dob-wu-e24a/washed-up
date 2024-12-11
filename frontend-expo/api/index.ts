import { ApiBase } from "./base";
import { AuthApi } from "./auth";
import { CreditsApi } from "./credits";
import { LocationApi } from "./location";
import { MachineApi } from "./machine";
import { NotificationsApi } from "./notifications";
import { ScheduleApi } from "./schedule";
import { StripeApi } from "./stripe";
import { TransactionsApi } from "./transactions";
import { UserApi } from "./user";

export class Api extends ApiBase {
  // API classes
  private authApi: AuthApi;
  private creditsApi: CreditsApi;
  private locationApi: LocationApi;
  private machineApi: MachineApi;
  private notificationsApi: NotificationsApi;
  private scheduleApi: ScheduleApi;
  private stripeApi: StripeApi;
  private transactionsApi: TransactionsApi;
  private userApi: UserApi;

  // Method declarations
  public signUp;
  public signIn;
  public validateEmail;
  public getCredits;
  public buyCredits;
  public getLocations;
  public getLocation;
  public getLocationByCode;
  public getMachines;
  public getMachineByCode;
  public registerToken;
  public removeToken;
  public getSchedules;
  public getScheduleById;
  public getByScheduleId;
  public cancelSchedule;
  public setSchedule;
  public createPaymentIntent;
  public getCreditPurchases;
  public getCreditPurchase;
  public getCreditUsages;
  public getCreditUsage;
  public getUser;

  constructor(accessToken?: unknown) {
    // Running the ApiBase constructor
    super(accessToken);

    // API classes
    this.authApi = new AuthApi(accessToken);
    this.creditsApi = new CreditsApi(accessToken);
    this.locationApi = new LocationApi(accessToken);
    this.machineApi = new MachineApi(accessToken);
    this.notificationsApi = new NotificationsApi(accessToken);
    this.scheduleApi = new ScheduleApi(accessToken);
    this.stripeApi = new StripeApi(accessToken);
    this.transactionsApi = new TransactionsApi(accessToken);
    this.userApi = new UserApi(accessToken);

    // Assign methods inside constructor
    this.signUp = this.authApi.signUp;
    this.signIn = this.authApi.signIn;
    this.validateEmail = this.authApi.validateEmail;
    this.getCredits = this.creditsApi.getCredits;
    this.buyCredits = this.creditsApi.buyCredits;
    this.getLocations = this.locationApi.getLocations;
    this.getLocation = this.locationApi.getLocation;
    this.getLocationByCode = this.locationApi.getLocationByCode;
    this.getMachines = this.machineApi.getMachines;
    this.getMachineByCode = this.machineApi.getMachineByCode;
    this.registerToken = this.notificationsApi.registerToken;
    this.removeToken = this.notificationsApi.removeToken;
    this.getSchedules = this.scheduleApi.getSchedules;
    this.getScheduleById = this.scheduleApi.getScheduleById;
    this.getByScheduleId = this.scheduleApi.getByScheduleId;
    this.cancelSchedule = this.scheduleApi.cancelSchedule;
    this.setSchedule = this.scheduleApi.setSchedule;
    this.createPaymentIntent = this.stripeApi.createPaymentIntent;
    this.getCreditPurchases = this.transactionsApi.getCreditPurchases;
    this.getCreditPurchase = this.transactionsApi.getCreditPurchase;
    this.getCreditUsages = this.transactionsApi.getCreditUsages;
    this.getCreditUsage = this.transactionsApi.getCreditUsage;
    this.getUser = this.userApi.getUser;
  }
}
