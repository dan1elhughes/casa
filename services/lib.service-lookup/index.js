const getServiceURL = (service = "") => {
  // Just in case we call it as "service.foo" instead of "foo"
  let s = service.replace("service.", "");

  return `http://service-${s}.default.svc.cluster.local:3000`;
};

module.exports = () => {
  return function serviceLookupMiddleware(req) {
    req.getServiceURL = getServiceURL;
  };
};
