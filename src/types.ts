// src/types.ts

// A new type to define what a "Source" object looks like
export interface Source {
  id: number;
  content: string;
  metadata: any;
}

// The updated Message type
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  sources?: Source[]; // ADDED: The optional 'sources' property
}
