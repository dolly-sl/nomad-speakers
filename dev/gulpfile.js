"use strict";
const gulp = require("gulp");
const babel = require("gulp-babel");
const autoprefixer = require("gulp-autoprefixer");
const changed = require("gulp-changed");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const scsslint = require("gulp-scss-lint");
const sourcemaps = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");

/**
 * Asset paths.
 */
const srcSCSS_global = "scss/custom/**/*.scss";
const srcSCSS_a = "scss/custom/modules/*.scss";
const srcSCSSVendor = "scss/vendor/*.css";
const srcJSCustom = "js/custom/*.js";
const srcJSVendor = "js/vendor/*.js";
const assetsDir = "../assets/";
const format = {
  vendor: {
    scripts: srcJSVendor,
    styles: srcSCSSVendor,
  },
  custom: {
    scripts: srcJSCustom,
    styles_a: srcSCSS_a,
    styles_global: srcSCSS_global,
  },
};
gulp.task("sass", function () {
  return (
    gulp
      .src("scss/global.scss")
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(
        autoprefixer(
          "last 2 version",
          "safari 5",
          "ie 7",
          "ie 8",
          "ie 9",
          "opera 12.1",
          "ios 6",
          "android 4"
        )
      )
      .pipe(sourcemaps.write("./"))
      .pipe(rename("_sm-global.css"))

      // .pipe(clean())
      .pipe(gulp.dest(assetsDir))
  );
});

gulp.task("sass-a", function () {
  return (
    gulp
      .src("scss/sm-style.scss")
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(
        autoprefixer(
          "last 2 version",
          "safari 5",
          "ie 7",
          "ie 8",
          "ie 9",
          "opera 12.1",
          "ios 6",
          "android 4"
        )
      )
      .pipe(sourcemaps.write("./"))
      // .pipe(clean())
      .pipe(rename("_sm-style.css"))
      .pipe(gulp.dest(assetsDir))
  );
});

gulp.task("sass-vendor", function () {
  return gulp
    .src(format.vendor.styles)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(rename("_sm-style-vendor.css"))
    .pipe(gulp.dest(assetsDir));
});
// /**
//  * JS task
//  *
//  * Note: use npm to install libraries and add them below, like the babel-polyfill example
//  */
gulp.task("jsCustom", () => {
  return gulp
    .src(format.custom.scripts)
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("_sm-theme.js"))
    .pipe(gulp.dest(assetsDir))
    .pipe(rename("_sm-theme.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(assetsDir));
});
gulp.task("jsVendor", () => {
  return gulp
    .src(format.vendor.scripts)
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("sm-theme-vendor.js"))

    .pipe(rename("_sm-theme-vendor.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(assetsDir));
});

// /**
//  * Fonts task
//  */
gulp.task("fonts", () => {
  return gulp
    .src("fonts/**")
    .pipe(changed(assetsDir)) // ignore unchanged files
    .pipe(gulp.dest(assetsDir));
});
// /**
//  * Watch task
//  */
gulp.task("watch", function () {
  gulp.watch(format.custom.styles_global, gulp.series("sass"));
  gulp.watch(format.custom.styles_a, gulp.series("sass-a"));
  gulp.watch(format.vendor.styles, gulp.series("sass-vendor"));
  gulp.watch(srcJSCustom, gulp.series("jsCustom"));
  gulp.watch(srcJSVendor, gulp.series("jsVendor"));
  gulp.watch("fonts/*.{eot,svg,ttf,woff,woff2}", gulp.series("fonts"));
});
// /**
//  * Default task
//  */
gulp.task(
  "default",
  gulp.series("sass", "sass-a", "sass-vendor", "jsCustom", "jsVendor", "fonts")
);
