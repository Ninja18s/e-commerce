import express, { Express } from "express";

interface IGetRequestUser {
  name: string;
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      payload: any;
      user?: IGetRequestUser;
    }
  }
}
