import { ApiBase } from "./base";

export class StripeApi extends ApiBase {
  public async createPaymentIntent(params: {
    amount: number;
    currency: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/payment/init`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
      }),
    });

    console.log(response);

    const data = await response.json();

    console.log(data);
    return {
      paymentIntent: data.paymentIntent,
      ephemeralKey: data.ephemeralKey,
      customer: data.customer,
    };
  }
}
