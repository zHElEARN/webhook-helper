export interface WebhookHandlerParams {
  chatType: string;
  chatNumber: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}

export interface WebhookHandler {
  handle(params: WebhookHandlerParams): Promise<Response>;
}

export interface WebhookContext {
  type: string;
  key: string;
  chatType: string;
  chatNumber: string;
}
