const express = require("express");
const router = express.Router();
const connectionController = require("../controller/connection");
const checkAuth = require("../middleware/check-auth");

//apply checkAuth middleware to all routes
router.use(checkAuth);

//send connection request
router.post(
  "/connection/request/:recipientId",
  connectionController.sendConnectionRequest
);

//accept connection request
router.patch(
  "/connection/accept/:requestId",
  connectionController.acceptConnectionRequest
);

//reject connection request
router.patch(
  "/connection/reject/:requestId",

  connectionController.rejectConnectionRequest
);

//GET Pending connection requests
router.get(
  "/connection/pending",
  connectionController.getPendingConnectionRequests
);

//checkConnection status
router.get("/connection/status/:userId/:networkId", connectionController.checkConnectionStatus);

//Get list of connections
router.get("/connection", connectionController.getConnections);

module.exports = router;
