var gulp = require('gulp');

// 引入组件
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');

var apis = [
    '/customer',
    '/Customer',
    '/File',
    '/file',
    '/GameProject',
    '/Identity',
    '/Goods',
    '/Leaguer',
    '/Member',
    '/Message',
    '/numbergen',
    '/Organization',
    '/POS',
    '/Price',
    '/Product',
    '/Terminal',
    '/Ticket',
    '/VirtualCurrency',
    '/Workbranch',
    '/Product',
    '/Order',
];
var proxys = [];
for (var i = 0; i < apis.length; i++) {
    var api = apis[i];
    proxys.push(
        proxy(api, {
            target: 'http://192.168.100.138',
            changeOrigin:true
        }
    ));
}

gulp.task('webserver', function () {
    connect.server({
        livereload: true,
        root: 'wwwroot',
        middleware: function(connect, opt) {
            return proxys;
        }
    });
});

gulp.task('js', function () {
    gulp.src('./app/*.js')
      .pipe(connect.reload());
  });
   
  gulp.task('watch', function () {
    gulp.watch(['./wwwroot/*.js'], ['js']);
  });

// gulp.task('default');
gulp.task('default', ['webserver', 'watch']);