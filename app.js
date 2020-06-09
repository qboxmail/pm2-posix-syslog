const pm2 = require("pm2");
const posix = require("posix");
const strip_ansi = require("strip-ansi");

let app_name = "pm2";
let facility = "syslog";
let strip_color = false;
let strip_log_date = false;

if (process.env["pm2-posix-syslog"]) {
  let app_config = JSON.parse(process.env["pm2-posix-syslog"]);

  // logger options
  if (app_config.app_name) {
    app_name = app_config.app_name;
  }
  if (app_config.facility) {
    facility = app_config.facility;
  }

  // feature options
  if (app_config.strip_color) {
    strip_color = app_config.strip_color === "1" ? true : false;
  }
  if (app_config.strip_log_date) {
    strip_log_date = app_config.strip_log_date === "1" ? true : false;
  }
}
const logger = posix.openlog(
  app_name,
  {
    ndelay: true,
    pid: false,
  },
  facility
);

const cleanLine = function (str) {
  if (strip_log_date) {
    // we assume the log format is YYYY-MM-DD...:
    str = str.replace(/^[0-9]{4}-[0-9]{2}-[0-9]{2}.*?: /, "");
  }
  if (strip_color) {
    str = strip_ansi(str);
  }
  return str;
};

pm2.launchBus(function (err, bus) {
  bus.on("log:err", (data) => {
    posix.syslog("crit", cleanLine(data.data));
  });

  bus.on("log:out", (data) => {
    posix.syslog("info", cleanLine(data.data));
  });
});
