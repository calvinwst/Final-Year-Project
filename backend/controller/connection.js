const Connection = require("../model/connection");
const User = require("../model/user");
const mongoose = require("mongoose");
const { request } = require("express");

//send connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId } = req.params; // is the id of the user to whom the connection request is being sent
    const userId = req.userData.userId; // Assuming userId is set in the userData by your auth middleware
    // const userId = req.userData.userId;

    console.log("this is the userId: ", userId);
    console.log("this is the recipientId: ", recipientId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const username = user.username;
    if (recipientId === userId) {
      return res.status(400).json({
        message: "You cannot send a connection request to yourself!",
      });
    }

    //check if a connection request already exists
    const existingConnection = await Connection.findOne({
      requester: userId,
      recipient: recipientId,
    });
    if (existingConnection) {
      return res.status(400).json({
        message: "You have already sent a connection request to this user!",
      });
    }

    //create new connection request
    const connection = await Connection.create({
      requester: userId,
      recipient: recipientId,
      status: "pending",
    });
    await connection.save();

    //add a notification to the recipient account
    const recipient = await User.findById(recipientId);
    console.log("this is the recipient: ", recipient);

    if (recipient) {
      if (!recipient.notifications) {
        recipient.notifications = [];
        console.log("recipient.notifications >>>>>>>", recipient.notifications);
      }

      recipient.notifications.push({
        message: `${username} has sent you a connection request!`,
        link: `/network/${userId}`,
      });
      await recipient.save();
    } else {
      console.log("Recipient not found for notification");
    }

    res.status(200).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.log("Error in SendConnectRequest: ", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};


exports.acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // is the id of the connection request
    const userId = req.userData.userId; // Assuming userId is set in the userData by your auth middleware

    // Check if requestId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid requestId",
      });
    }

    // Find the connection request
    const connection = await Connection.findById(requestId);
    if (!connection) {
      return res.status(404).json({
        message: "Connection not found!",
      });
    }

    console.log("userId:", userId);
    console.log("connection.recipient:", connection.recipient);

    // Check if the logged-in user is the recipient of the connection request
    if (connection.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to accept this connection request!",
      });
    }

    try {
      // Update the connection status to connected
      connection.status = "connected";
      await connection.save();

      //fetch the recipient user
      const recipient = await User.findById(connection.recipient);
        if (!recipient) {
            return res.status(404).json({
                message: "Recipient not found!",
            });
        }
      //send notification to the requester that the connection request has been accepted
      const requester = await User.findById(connection.requester);
      if (requester) {
        console.log("recipient.username:", recipient.username);
        console.log("recipient id:", recipient._id);
        requester.notifications.push({
          message: `${recipient.username} has accepted your connection request!`,
          link: `/profile/${recipient._id}`,
        });
        try {
          await requester.save();
        } catch (error) {
          res.status(500).json({
            error: error.toString(),
            message: "Error in AcceptConnectionRequest",
          });
        }
      } else {
        console.log("Requester not found for notification");
        res.status(404).json({
          message: "Requester not found for notification",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.toString(),
        message: "Error in AcceptConnectionRequest",
      });
    }

    //Update the connection array for both users
    const requestUser = await User.findById(connection.requester);
    const recipientUser = await User.findById(connection.recipient);

    console.log("requestUser in accept:", requestUser);
    console.log("recipientUser in accept:", recipientUser);

    if (requestUser && recipientUser) {
      requestUser.connections.push(connection.recipient);
      recipientUser.connections.push(connection.requester);
      try {
        await requestUser.save();
      } catch (error) {
        res.status(500).json({
          error: error.toString(),
          message: "Error in AcceptConnectionRequest",
        });
      }
      try {
        await recipientUser.save();
      } catch (error) {
        res.status(500).json({
          error: error.toString(),
          message: "Error in AcceptConnectionRequest",
        });
      }
    } else {
      console.log("Requester or Recipient not found");
    }

    res.status(200).json({
      message: "Connection accepted successfully!",
      connection,
    });
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
      message: "Error in AcceptConnectionRequest",
    });
  }
};

exports.rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // is the id of the connection request
    // console.log("this is the req.user._id: ", req.user._id);
    const userId = req.userData.userId; // Assuming userId is set in the userData by your auth middleware

    const connection = await Connection.findOne({ _id: requestId });
    if (!connection) {
      return res.status(404).json({
        message: "Connection not found!",
      });
    }

    //check if the logged-in user is the recipient of the connection request
    if (connection.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to reject this connection request!",
      });
    }

    connection.status = "rejected";
    await connection.save();
    res.status(200).json({
      message: "Connection rejected successfully!",
      connection,
    });
  } catch (error) {
    res.status(400).json({
      error: error.toString(),
      message: "Error in RejectConnectionRequest",
    });
  }
};


exports.getPendingConnectionRequests = async (req, res) => {
  try {
    const userId = req.userData.userId;
    console.log("this is the userId: ", userId);
    const pendingRequests = await Connection.find({
      recipient: userId, // is the id of the user who is logged in
      status: "pending",
    }).populate("requester", "firstName lastName email");

    console.log("this is the pendingRequests: ", pendingRequests);
    if (!pendingRequests || pendingRequests.length === 0) {
      return res.status(404).json({
        message: "No pending requests found!",
      });
    }

    res.status(200).json({ pendingRequests });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

// Get All connections
exports.getConnections = async (req, res) => {
  try {
    const userId = req.userData.userId;
    console.log("this is the userId: ", userId);
    const connections = await Connection.find({
      $or: [{ recipient: userId }, { requester: userId }],
      status: "connected",
    }).populate("requester", "firstName lastName email");
    res.status(200).json({ connections });
  } catch (error) {
    res.status(400).json({ error });
  }
};

//check connection status
exports.checkConnectionStatus = async (req, res) => {
  try {
    const { userId, networkId } = req.params;
    console.log("this is the userId: ", userId); // is the id of the user who is logged in
    console.log("this is the networkId: ", networkId); // is the id of the user whose profile is being viewed

    const connection = await Connection.findOne({
      $or: [
        { requester: userId, recipient: networkId },
        { requester: networkId, recipient: userId },
      ],
    });

    let status = "none";
    if (connection) {
      status =
        connection.status === "pending" &&
        connection.requester.toString() === networkId
          ? "accept"
          : connection.status;
    }

    res.status(200).json({ status });
  } catch (error) {
    console.error("Error in CheckConnectionStatus: ", error);
    res.status(400).json({
      error: error.toString(),
      message: "Error in CheckConnectionStatus",
    });
  }
};
