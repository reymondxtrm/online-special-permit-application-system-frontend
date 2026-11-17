import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

// Lazy: the Pusher connection opens only when something (admin pages) first uses echo,
// so public visitors and clients don't count against the Pusher connection limit.
let instance = null;
const getEcho = () => {
  if (!instance) {
    instance = new Echo({
      broadcaster: "pusher",
      key: process.env.REACT_APP_PUSHER_APP_KEY,
      cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
      // wsHost: "172.16.0.124",
      // wsPort: 443,
      // forceTLS: false,
      // disableStats: false,
    });
  }
  return instance;
};

const echo = new Proxy(
  {},
  {
    get: (_, key) => {
      const e = getEcho();
      const value = e[key];
      return typeof value === "function" ? value.bind(e) : value;
    },
  },
);
window.echo = echo;
export default echo;
