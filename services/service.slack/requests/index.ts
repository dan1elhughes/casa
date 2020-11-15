import { makeRequest, Route } from "@casa/lib-requests";

const { SERVICE_SLACK_URL: service } = process.env;

export let routes: Array<Route> = [];

interface SendMessageRequest {
  text: string;
}
interface SendMessageResponse {}

export const postSendMessage = makeRequest<
  SendMessageRequest,
  SendMessageResponse
>(routes, {
  service,
  method: "POST",
  route: "/message",
  handler: () => require("../routes/post-message"),
});

interface GetHealthzRequest {}
interface GetHealthzResponse {}

export const getHealthz = makeRequest<GetHealthzRequest, GetHealthzResponse>(
  routes,
  {
    service,
    method: "GET",
    route: "/healthz",
    handler: () => require("../routes/get-healthz"),
  }
);
