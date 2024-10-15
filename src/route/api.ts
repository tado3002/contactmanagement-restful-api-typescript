import express from "express";
import { authMiddleware } from "../middleware/aut-middleware";
import { UserController } from "../controller/user-controller";
import { ContactController } from "../controller/contact-controller";
import { AddressController } from "../controller/address-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

//User API
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

//Contact API
apiRouter.post("/api/contacts", ContactController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)", ContactController.getById);
apiRouter.patch("/api/contacts/:contactId(\\d+)", ContactController.update);
apiRouter.delete("/api/contacts/:contactId(\\d+)", ContactController.delete);
apiRouter.get("/api/contacts", ContactController.search);

//Address API
apiRouter.post(
  "/api/contacts/:contactId(\\d+)/addresses",
  AddressController.create,
);
apiRouter.get(
  "/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)",
  AddressController.get,
);
apiRouter.patch(
  "/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)",
  AddressController.update,
);
apiRouter.delete(
  "/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)",
  AddressController.delete,
);
apiRouter.get("/api/contacts/:contactId(\\d+)/addresses", AddressController.list)
