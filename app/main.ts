import Vue from "vue";
import App from "./App.vue";
import { Client } from "../rpc-lib/client";
import { $Methods } from "../api/shared";

Vue.config.productionTip = false;

const client = new Client<$Methods>(async data => {
  const response = await fetch("http://localhost:3000/rpc", {
    method: "POST",
    body: JSON.stringify(data)
  });
  return await response.json();
});

Vue.prototype.$rpc = client.methods;

declare module "vue/types/vue" {
  interface Vue {
    $rpc: $Methods;
  }
}

new Vue({
  render: h => h(App)
}).$mount("#app");
