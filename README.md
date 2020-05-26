# pm2-posix-syslog

Redirect all logs of PM2 apps to syslog with some nice features using POSIX logger

## Install module

```
# Install
$ pm2 install pm2-posix-syslog

# Uninstall
$ pm2 uninstall pm2-posix-syslog
```

## Configuration

```
# Optionally change the facility
$ pm2 set pm2-posix-syslog:facility syslog  # 'syslog' is the default

# Optionally change the application name
$ pm2 set pm2-posix-syslog:app_name my_app  # 'pm2' is the default

# Optionally remove VT100 color chars
$ pm2 set pm2-posix-syslog:strip_color 1  # '0' is the default

# Optionally remove pm2 log_date_format (it must start with YYYY-MM-DD)
$ pm2 set pm2-posix-syslog:strip_log_date 1  # '0' is the default
```

## Facility

```
##  String  Description
-----------------------
 0  kern    kernel messages
 1  user    user-level messages
 2  mail    mail system
 3  daemon  system daemons
 4  auth    security/authorization messages
 5  syslog  messages generated internally by syslog daemon
 6  lpr     line printer subsystem
 7  news    network news subsystem
 8  uucp    UUCP subsystem
16  local0  local use 0
17  local1  local use 1
18  local2  local use 2
19  local3  local use 3
20  local4  local use 4
21  local5  local use 5
22  local6  local use 6
23  local7  local use 7
```

## Rsyslog

Configure RSYSLOG /etc/rsyslog.d/myapp.conf in this way:

```
:programname, isequal, "my_app" -/var/log/my_app.log
:programname, isequal, "my_app" stop
```

# License

MIT
