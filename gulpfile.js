var gulp    = require('gulp'),
  encode    = require('gulp-convert-encoding'),
  intercept = require('gulp-intercept'),
  concat    = require('gulp-concat'),
  path      = require('path');


var headers = [
    '元のファイルの名前',
    '避難先名称',
    '避難が予想される住民の地区名',
    '',
    '',
    '指定場所',
    '市町村名',
    '避難種別',
    '避難所区分',
    '土砂災害・浸水・津波浸水予測地域',
    '（風水害）緊急避難先レベル',
    '（津波）緊急避難先レベル',
    '耐震性',
    '備蓄の有無',
    '備蓄品目',
    '標高（m）',
    '経度：東経(世界測地系10進法)',
    '緯度：北緯(世界測地系10進法)',
    '備考１',
    '備考２（発電機有無）',
    '収容人数',
    '所在地'
];


gulp.task('bookbind', function(){
    gulp.src('./data/*.csv')
        .pipe(encode({
            from: 'shift_jis',
            to: 'utf8'
        }))
        .pipe(intercept(function(file){
            file.contents = new Buffer(
                file.contents
                    .toString()
                    .split('\n')
                    .slice(10,-1) //ヘッダと末尾の改行を除去
                    .map(function(row){
                        //不要な行頭のコロンを除去
                        //元のファイル名をデータに付与
                        row = path.basename(file.path) + ',' + (row[0] === ',' ? row.slice(1) : row);
                        return row;
                    })
                    .join('\n')
            );
            return file;
        }))
        .pipe(concat('all.csv'))
        .pipe(intercept(function(file){
            file.contents = new Buffer(
                headers.join(',') + '\n' + file.contents.toString()
            );
            return file;
        }))
        .pipe(gulp.dest('./data_bounden/'));
});
