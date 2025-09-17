// to keep our types organized
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}
