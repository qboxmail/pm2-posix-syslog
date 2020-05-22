const pm2 = require("pm2");
const posix = require("posix");
const strip_ansi = require("strip-ansi");

let app_name = "pm2";
let facility = "syslog";
let strip_color = false;

if (process.env["pm2-syslog3"]) {
  let app_config = JSON.parse(process.env["pm2-syslog3"]);

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
