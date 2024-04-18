import { BellIcon } from "@chakra-ui/icons";

interface NotificationBubbleProps {
  count: number;
}

const NotificationBubble: React.FC<NotificationBubbleProps> = ({ count }) => {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        marginRight: "10px",
      }}
    >
      <BellIcon />
      <span style={{ marginLeft: "5px" }}>Notification</span>
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-2px",
            right: "-29px",
            padding: "2px 5px",
            borderRadius: "50%",
            backgroundColor: "red",
            color: "white",
          }}
        >
          {count}
        </span>
      )}
    </span>
  );
};

export default NotificationBubble;
