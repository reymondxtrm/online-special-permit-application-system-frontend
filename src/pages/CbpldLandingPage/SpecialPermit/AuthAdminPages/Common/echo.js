import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.REACT_APP_PUSHER_APP_KEY,
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  wsHost: "172.16.0.124",
  wsPort: 443,
  forceTLS: false,
  disableStats: false,
});
window.echo = echo;
export default echo;
