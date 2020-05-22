const pm2 = require("pm2");
const ain2 = require("ain2");
const stripAnsi = require("strip-ansi");

let tag = "pm2";
let facility = "syslog";
let stripColor = false;

if (process.env["pm2-syslog-logger"]) {
  let config = JSON.parse(process.env["pm2-syslog-logger"]);
  if (config.tag) {
    tag = config.tag;
  }
  if (config.facility) {
    facility = config.facility;
  }
  if (config.stripColor) {
    stripColor = config.stripColor;
  }
}
const logger = new ain2({ tag: tag, facility: facility });

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
