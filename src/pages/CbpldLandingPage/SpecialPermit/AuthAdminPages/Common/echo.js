import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.REACT_APP_PUSHER_APP_KEY,
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  // Private channels only; goes through global axios so baseURL + Bearer token come from App.js interceptor.
  authorizer: (channel) => ({
    authorize: (socketId, callback) => {
      axios
        .post("api/broadcasting/auth", {
          socket_id: socketId,
          channel_name: channel.name,
        })
        .then((res) => callback(null, res.data))
        .catch((err) => callback(err));
    },
  }),
  // wsHost: "172.16.0.124",
  // wsPort: 443,
  // forceTLS: false,
  // disableStats: false,
});
window.echo = echo;
export default echo;
