var gulp = require('gulp');
var through = require('through2')
// var $ = require("gulp-load-plugins")()
//优化html文件
gulp.task("html", function () {
    gulp.src("./public/**/*.html")
        .pipe(through.obj(function (file, encode, cb) {
            var contents = file.contents.toString(encode);
            var HTMLMinifier = require("html-minifier").minify;
            var minified = HTMLMinifier(contents, {
                minifyCSS: true,
                minifyJS: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            })

            file.contents = new Buffer(minified, encode);
            cb(null, file, encode);
        }))
        .pipe(gulp.dest("./dist"));
})

function minifyAndComboCSS(name, encode, files) {
    var fs = require("fs");
    var CleanCSS = require("clean-css");
    var content = "";
    files.forEach(function (css) {
        var contents = fs.readFileSync(css, encode);
        var minified = new CleanCSS().minify(contents).styles;
        content += minified;
    });
    if (content) {
        var combo = "static/css/" + name;
    }
    fs.writeFileSync(combo, content);
    gulp.src(combo).pipe(gulp.dest("./dist/static/css"));
}

function minifyAndComboJS(name, encode, files) {
    var fs = require("fs");
    var UglifyJS = require("uglify-js");
    var content = "";
    files.forEach(function (js) {
        var minified = UglifyJS.minify(js).code;
        content += minified;
    });
    if (content) {
        var combo = "static/js/" + name;
    }
    fs.writeFileSync(combo, content);
    gulp.src(combo).pipe(gulp.dest("./dist/static/js"));
}
gulp.task("build-index", ["build-js-lib", "build-common-css"], function () {
    gulp.src("./index.html").pipe(through.obj(function (file, encode, cb) {
        var fs = require("fs");
        var contents = file.contents.toString(encode);
        var $ = require("cheerio").load(contents, {
            decodeEntities: false
        });
        //处理外链 css 
        var links = $("link");
        var cssToCombo = [];
        for (var i = 0; i < links.length; i++) {
            var link = $(links[i]);
            if (link.attr("rel") === "stylesheet") {
                var href = link.attr("href");
                if (/^static\/css\/(?!common)/.test(href)) {
                    cssToCombo.push(href);
                    if (cssToCombo.length == 1) {
                        link.attr("href", "static/css/index.min.css");
                    } else {
                        link.remove();
                    }
                }
            }
        }
        minifyAndComboCSS("index.min.css", encode, cssToCombo);
        //处理外链 js 
        var scripts = $("script");
        var jsToCombo = [];
        for (var i = 0; i < scripts.length; i++) {
            var s = $(scripts[i]);
            //判断script标签确实是js 
            if (s.attr("type") == null || s.attr("type") === "text/javascript") {
                var src = s.attr("src");
                if (src) {
                    //外链的js，默认只处理以/static/开头的资源 
                    if (/^static\/js\/(?!lib)/.test(src)) {
                        jsToCombo.push(src);
                        if (jsToCombo.length == 1) {
                            s.attr("src", "static/js/index.min.js");
                        } else {
                            s.remove();
                        }
                    }
                }
            }
        }
        minifyAndComboJS("index.min.js", encode, jsToCombo);
        //处理内联图片 
        var imgs = $("img");
        for (var i = 0; i < imgs.length; i++) {
            var img = $(imgs[i]);
            var src = img.attr("src");
            if (/^static\/img/.test(src)) {
                var stat = fs.statSync(src);
                var ext = require("path").parse(src).ext;
                if (stat.size <= 3000) {
                    var head = ext === ".png" ? "data:image/png;base64," : "data:image/jpeg;base64,";
                    var datauri = fs.readFileSync(src).toString("base64");
                    img.attr("src", head + datauri);
                }
            }
        }
        contents = $.html();
        //压缩 HTML 
        var HTMLMinifier = require("html-minifier").minify;
        var minified = HTMLMinifier(contents, {
            minifyCSS: true,
            minifyJS: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        });
        file.contents = new Buffer(minified, encode);
        cb(null, file, encode);
    })).pipe(gulp.dest("./dist"));
});
gulp.task("build-js-lib", function () {
    gulp.src("./static/js/lib/**/*.js").pipe(through.obj(function (file, encode, cb) {
        var UglifyJS = require("uglify-js");
        var contents = file.contents.toString(encode);
        var minified = UglifyJS.minify(contents, {
            fromString: true
        }).code;
        file.contents = new Buffer(minified, encode);
        cb(null, file, encode);
    })).pipe(gulp.dest("./dist/static/js/lib"));
});
gulp.task("build-common-css", function () {
    gulp.src("./static/css/common/**/*.css").pipe(through.obj(function (file, encode, cb) {
        var CleanCSS = require("clean-css");
        var contents = file.contents.toString(encode);
        var minified = new CleanCSS().minify(contents).styles;
        file.contents = new Buffer(minified, encode);
        cb(null, file, encode);
    })).pipe(gulp.dest("./dist/static/css/common"));
});