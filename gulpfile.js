import { src, dest, watch, series, parallel, task } from 'gulp';
import sass from 'gulp-sass';
import prefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import bs from 'browser-sync';
import clean from 'gulp-clean-css';
import * as dartSass from 'sass';
import include from 'gulp-file-include';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import imagemin, { gifsicle, optipng, svgo } from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import recompress from 'imagemin-jpeg-recompress';
import webpConv from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';
import webpack from 'webpack-stream';

const sassCompiler = sass(dartSass);
const style = () => {
  return src('src/**/*.scss')
    .pipe(
      sassCompiler({
        outputStyle: 'compressed',
      }).on('error', sassCompiler.logError)
    )
    .pipe(
      prefixer({
        overrideBrowserslist: ['last 8 versions'],
        browsers: [
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24',
          'Explorer >= 11',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6',
        ],
      })
    )
    .pipe(
      clean({
        level: 2,
      })
    )
    .pipe(concat('index.min.css'))
    .pipe(dest('dist'))
    .pipe(bs.stream());
};
const html = () => {
  return src('src/**/*.html')
    .pipe(include())
    .pipe(dest('dist'))
    .pipe(bs.stream());
};

export const script = () => {
  return src('src/**/*.js')
    .pipe(
      webpack({
        mode: 'development',
        output: {
          filename: 'index.min.js',
        },
      })
    )
    .pipe(dest('dist'))
    .pipe(bs.stream());
};

const rastr = () => {
  return src('src/images/**/*.+(png|jpg|jpeg|gif|svg|ico)', { encoding: false })
    .pipe(plumber())
    .pipe(changed('dist/image'))
    .pipe(
      imagemin(
        {
          interlaced: true,
          progressive: true,
          optimizationLevel: 5,
        },
        [
          recompress({
            loops: 6,
            min: 50,
            max: 90,
            quality: 'high',
            use: [
              pngquant({
                quality: [0.8, 1],
                strip: true,
                speed: 1,
              }),
            ],
          }),
          gifsicle(),
          optipng(),
          svgo(),
        ]
      )
    )
    .pipe(dest('dist/images'))
    .pipe(bs.stream());
};

const svg = () => {
  return src('src/images/**/*.svg')
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(dest('dist/images'));
};
const webp = () => {
  return src('src/images/**/*.+(png|jpg|jpeg)', { encoding: false })
    .pipe(webpConv())
    .pipe(dest('dist/images'))
    .pipe(bs.stream());
};

const fonts = () => {
  return src('src/fonts/**/*', { encoding: false }).pipe(dest('dist/fonts'));
};

const serve = () => {
  bs.init({
    server: {
      baseDir: 'dist',
    },
    port: 3000,
  });
  watch('src/**/*.html', html);
  watch('src/**/*.scss', style);
  watch('src/**/*.js', script);
  watch('src/images/**/*.+(png|jpg|jpeg|gif|svg|ico)', rastr);
  watch('src/images/**/*.svg', svg);
  watch('src/images/**/*.+(png|jpg|jpeg)', webp);
  watch('src/fonts/**/*', fonts);
};

export default series(style, html, script, fonts, webp, rastr, svg, serve);
