import AuthPasswordForgotResetEmail from "./auth-forgot-password";
import AuthPasswordResetEmail from "./auth-password-reset";
import OrderPlacedEmail from "./order-placed";
import OrderMemoEmail from "./order-memo";
import WelcomeEmail from "./welcome";

// TODO: we should be able to use notification data in subjects too
export const subjects = {
  "auth-password-reset": "Reset your Kravex password",
  "order-placed": "Order confirmed — Kravex",
  "order-memo": "New order — fulfillment memo",
  "customer-welcome": "Welcome to Kravex",
  "auth-forgot-password": "Reset your Kravex password",
};

export default {
  "auth-password-reset": AuthPasswordResetEmail,
  "order-placed": OrderPlacedEmail,
  "order-memo": OrderMemoEmail,
  "customer-welcome": WelcomeEmail,
  "auth-forgot-password": AuthPasswordForgotResetEmail,
};
