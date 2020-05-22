# pm2-syslog3

Redirect all logs of PM2 + Apps managed into `/var/log/syslog` with some nice features

## Configure OS

Edit `/etc/rsyslog.conf` and uncomment:

```
# provides UDP syslog reception
module(load="imudp")
input(type="imudp" port="514")
```

Restart rsyslog:

```
$ sudo service rsyslog restart
```

## Install module

```
# Install
$ pm2 install matteomattei/pm2-syslog3

# Uninstall
$ pm2 uninstall matteomattei/pm2-syslog3
```

## Configuration

```
# ENVIRONMENT
$ pm2 set pm2-syslog3:hostname localhost  # 'localhost' is the default.
$ pm2 set pm2-syslog3:port 514  # 514 is the default.
# or
$ pm2 set pm2-syslog3:path /dev/log

# Optionally change the facility
$ pm2 set pm2-syslog3:facility local0  # 'syslog' is the default

# Optionally change the log format
$ pm2 set pm2-syslog3:tag mytag  # 'pm2' is the default
```

# License

MIT
