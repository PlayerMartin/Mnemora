export interface DialogGateway {
  selectDirectory(): Promise<string | null>;
}
