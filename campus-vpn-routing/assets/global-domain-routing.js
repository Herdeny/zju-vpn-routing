// Paste into Clash Verge Rev's Global Extended Script only after reviewing
// the existing script and confirming the route with connectivity tests.
// ZJU only: the domain scope is deliberately fixed.
const ZJU_DOMAIN = "zju.edu.cn";
const CAMPUS_ROUTE = "proxy"; // "proxy" or "direct"; choose using evidence.
const PROXY_GROUP_BY_PROFILE = {
  "魔戒.net": "节点选择",
  "uuone": "uuone"
};
// Set a verified common group only if all unmapped subscriptions use it.
const VERIFIED_DEFAULT_PROXY_GROUP = "";
// Enabled in the ZJU case after cached-real-IP failure was demonstrated.
// This enables hostname detection for other unidentified-IP traffic too.
const RECOVER_HOSTNAME_FROM_CACHED_IP = true;

function main(config, profileName) {
  const domain = ZJU_DOMAIN;
  let target;
  if (CAMPUS_ROUTE === "direct") {
    target = "DIRECT";
  } else if (CAMPUS_ROUTE === "proxy") {
    target = PROXY_GROUP_BY_PROFILE[profileName] || VERIFIED_DEFAULT_PROXY_GROUP;
    if (!target || !Array.isArray(config["proxy-groups"]) ||
        !config["proxy-groups"].some(group => group.name === target)) {
      throw new Error("Verify and configure the proxy group for subscription: " + profileName);
    }
  } else {
    throw new Error("CAMPUS_ROUTE must be proxy or direct.");
  }

  const priorRules = Array.isArray(config.rules) ? config.rules : [];
  config.rules = [
    "DOMAIN-SUFFIX," + domain + "," + target,
    ...priorRules.filter(rule => {
      const fields = String(rule).split(",").map(field => field.trim());
      return !(fields[0] === "DOMAIN-SUFFIX" && fields[1].toLowerCase() === domain);
    })
  ];

  if (RECOVER_HOSTNAME_FROM_CACHED_IP) {
    const prior = config.sniffer || {};
    const forceDomains = Array.isArray(prior["force-domain"]) ? prior["force-domain"] : [];
    config.sniffer = {
      ...prior,
      enable: true,
      "parse-pure-ip": true,
      "override-destination": prior["override-destination"] === undefined
        ? false : prior["override-destination"],
      sniff: {
        HTTP: { ports: [80, 8080] },
        TLS: { ports: [443, 8443] },
        QUIC: { ports: [443, 8443] },
        ...(prior.sniff || {})
      },
      "force-domain": [...new Set([...forceDomains, "+." + domain])]
    };
  }
  return config;
}
