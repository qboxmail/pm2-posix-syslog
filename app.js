const pm2 = require("pm2");
const ain2 = require("ain2");
const stripAnsi = require("strip-ansi");

let tag = "pm2";
let facility = "syslog";
let stripColor = false;

let ain2_config = {
  hostname: "localhost",
  port: 514,
  transport: "UDP",
  path: "/dev/log",
  tag: "pm2",
  facility: "user",
};
if (process.env["pm2-syslog3"]) {
  let config = JSON.parse(process.env["pm2-syslog3"]);

  // logger options
  if (config.tag) {
    ain2_config["tag"] = config.tag;
  }
  if (config.facility) {
    ain2_config["facility"] = config.facility;
  }
  if (config.hostname) {
    ain2_config["hostname"] = config.hostname;
  }
  if (config.port) {
    ain2_config["port"] = config.port;
  }
  if (config.transport) {
    ain2_config["transport"] = config.transport;
  }
  if (config.path) {
    ain2_config["path"] = config.path;
  }

  // feature options
  if (config.stripColor) {
    stripColor = config.stripColor === "1" ? true : false;
  }
}
const logger = new ain2(ain2_config);

pm2.launchBus(function (err, bus) {
  const cleanLine = function (str) {
    if (stripColor) {
      str = stripAnsi(str);
    }
    return str;
  };

  bus.on("*", function (event, data) {
    if (event == "process:event") {
      logger.warn(
        "app=pm2 target_app=%s target_id=%s restart_count=%s status=%s",
        data.process.name,
        data.process.pm_id,
        data.process.restart_time,
        data.event
      );
    }
  });

  bus.on("log:err", function (data) {
    logger.error(
      "app=%s id=%s line=%s",
      data.process.name,
      data.process.pm_id,
      cleanLine(data.data)
    );
  });

  bus.on("log:out", function (data) {
    logger.log(
      "app=%s id=%s line=%s",
      data.process.name,
      data.process.pm_id,
      cleanLine(data.data)
    );
  });
});
