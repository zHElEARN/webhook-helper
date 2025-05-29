export interface WebhookHandlerParams {
  chatType: string;
  chatNumber: string;
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
